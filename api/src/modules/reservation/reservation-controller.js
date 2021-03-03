const db = require('../../database/connection')
const sendMail = require('../../config/email')
const mercadopago = require ('mercadopago')

const dbErrors = error => {
  let message = { message : 'Ocorreu um erro não identificado', error}
  if (error.hasOwnProperty('constraint')) {
    if (error.constraint === 'reservations_travel_id_foreign') {
      message = { reservation_id : 'A Viagem não existe!' }
    }
    if (error.constraint === 'reservations_user_id_foreign') {
      message = { user_id : 'O Usuário não existe!' }
    }
    if (error.constraint === 'reservations_dependent_id_foreign') {
      message = { dependent_id : 'O Dependente não existe!' }
    }
  }
  return message
}

const getTravel = async (id, departurePlace_id) => {
  let travel = await db('travels').where({ id })
  const departurePlace = await db('travelDeparturePlaces').where({ id: departurePlace_id })
  travel[0].departurePlace = departurePlace
  return travel[0]
}

const getDependent = async (id, user_id) => {
  let dependent = await db('dependents').where({ id })
  const user = await getUser(user_id)
  if (user.type === 'regular') {
    dependent[0].responsible = user.name
  }
  return dependent[0]
}

const getUser = async id => {
  const user = await db('users').where({ id })
  return user[0]
}

const getAdminData = async () => {
  const adminData = await db('adminData')
  return adminData[0]
}

const getPerson = async reservation => {
  const { dependent_id, user_id, lapChild, travel_id } = reservation
  let person = dependent_id ? await getDependent(dependent_id, user_id) : await getUser(user_id)

  if (lapChild) {
    const userReservation =  await db('reservations')
                                    .where({ travel_id })
                                    .where({ user_id })
                                    .where({ dependent_id: null })
    if (userReservation.length) {
      person.responsibleDepartureSeat = userReservation[0].departureSeat
      person.responsibleReturnSeat = userReservation[0].returnSeat
    }
  }

  return person
}

const dateTimeBrazil = dtstr => {
  const dt = new Date(dtstr)
  const day = dt.getDate().toString().padStart(2, '0')
  const month = (dt.getMonth() + 1).toString().padStart(2, '0')
  const year = dt.getFullYear()
  const hour = dt.getHours().toString().padStart(2, '0')
  const minute = dt.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hour}:${minute}`
}

const getStatusMercadoPago = async reservation_id => {
  const adminData = await getAdminData()

  mercadopago.configure({
    access_token: adminData.mercadoPagoToken
  })

  try {
    const resMP = await mercadopago.payment.search({ qs: { external_reference: reservation_id }})
    return resMP.body.results[0].status
  } catch(error) {
    return false
  }
}

module.exports = {
  async getMany (req, res) {
    const completeReservation = async (reservations) => {
      let res = reservations
      if (res.length) {
        for (const [i, reservation] of res.entries()) {
          res[i].person = await getPerson(reservation)

          if (res[i].person.responsibleDepartureSeat) {
            res[i].departureSeat = res[i].person.responsibleDepartureSeat
          }

          if (res[i].person.responsibleReturnSeat) {
            res[i].returnSeat = res[i].person.responsibleReturnSeat
          }

          if (res[i].status !== '1' && res[i].status !== '2' && !res[i].dependent_id) {
            const statusUpdated = await getStatusMercadoPago(res[i].id)

            if (res[i].status !== statusUpdated && statusUpdated){
              res[i].status = statusUpdated

              try {
                await db('reservations')
                        .where({ id: res[i].id })
                        .update({ status: statusUpdated, departureSeat: 0, returnSeat: 0 })
              } catch (error) {
                return []
              }
            }
          }
        }
      }
      return res
    }

    const emailReservation = async (reservations) => {
      const { email } = reservations.data[0].reservations[0].person
      const { reservations: passengers } = reservations.data[0]
      const { departurePlace, destination } = reservations.data[0].travel
      const { homeAddress, addressNumber, neighborhood, city, state, departureDate, returnDate } = departurePlace[0]
  
      const passengersHtml = passengers.map(passenger => {
        const { departureSeat, returnSeat, lapChild, value } = passenger
        const { name } = passenger.person
        return `<p>Nome: ${name}, Poltronas: Ida: ${departureSeat} Volta: ${returnSeat}${lapChild ? ' (Colo)' : ''}, R$: ${value.replace('.', ',')}</p>`
      }).join('')

      const total = (passengers.reduce((tot, person) => tot + Number(person.value), 0)).toFixed(2).replace('.', ',')

      const admin = await db('users').where({ type: 'admin' })
      const { name, phone } = admin[0]
      const phoneLen = phone.length
      const phoneFomartted = `(${phone.substr(0, 2)}) ${phone.substr(2, phoneLen === 10 ? 4: 5)}-${phone.substr(phoneLen === 10 ? 6: 7, 4)}`
  
      const emailContent = `<h2>Olá, obrigado por viajar conosco!</h2><h3>Confira os dados da sua reserva</h3>
        <p>Destino: ${destination}</p>
        <p>Local de Saída: ${homeAddress}, ${addressNumber}, ${neighborhood}, ${city}-${state}</p>
        <p>Data de Saída: ${dateTimeBrazil(departureDate)}</p>
        <p>Data de Retorno: ${dateTimeBrazil(returnDate)}</p>
        <h4>Passageiros</h4>
        ${passengersHtml}
        <h4>Total R$ ${total}</h4>
        <br /><p>${name} - ${phoneFomartted}</p>`
      
      const { adminUser_id } = await getAdminData()
      const { emailAdmin } = await getUser(adminUser_id)
      
      await sendMail(email, 'Confirmação de Reserva', emailContent, emailAdmin) 
    }
    
    const { currentpage: currentPage, user_id, travel_id, email } = req.headers
    let reservations = {}
    let reservationsGrouped = {}

    if (!user_id) {
      reservations = await db('reservations')
                            .modify(q => {
                              if (travel_id) q.where({ travel_id })
                            })
                            .orderBy('id', 'desc')
                            .paginate({ perPage: 100, currentPage, isLengthAware: true })
  
      if (reservations.hasOwnProperty('data')) {
        reservations.data = await completeReservation(reservations.data)
        reservations.data.sort((a, b) => (a.departureSeat > b.departureSeat) ? 1 : (a.departureSeat === b.departureSeat) ? ((a.dependent_id > b.dependent_id) ? 1 : -1) : -1 )

        return res.status(200).json(reservations)
      }
      return res.status(204).json({ message: 'Não existem reservas cadastradas' })

    } else {
      reservationsGrouped = await db('reservations')
                            .select('user_id', 'datetime', 'travel_id')
                            .where({ user_id })

                            .groupBy('user_id', 'datetime', 'travel_id')
                            .paginate({ perPage: 100, currentPage, isLengthAware: true })
      
      if (reservationsGrouped.hasOwnProperty('data')) {
        if (reservationsGrouped.data.length) {

          for (const [i, reservation] of reservationsGrouped.data.entries()) {
            reservations = await db('reservations')
                                  .where({ user_id })
                                  .where({ datetime: reservation.datetime })
          
            reservationsGrouped.data[i].reservations = await completeReservation(reservations)
            reservationsGrouped.data[i].travel = await getTravel(reservation.travel_id, reservationsGrouped.data[i].reservations[0].departurePlace_id)
          }

          if (email) {
            emailReservation(reservationsGrouped)
          }
          return res.status(200).json(reservationsGrouped)
        }
      }
      return res.status(204).json({ message: 'Não existem reservas cadastradas' })
    }
  },

  async getOne (req, res) {
    const { id } = req.params
    let reservation = await db('reservations').where({ id })
    reservation = reservation[0]

    if (reservation) {
      reservation.person = await getPerson(reservation)
      
      return res.status(200).json(reservation)
    }
    return res.status(404).json({ message: 'Reserva não encontrada' })
  },

  async post (req, res) {
    const data = req.body

    try {
      const id = await db('reservations').insert(data).returning('id')
      
      if (id) {
        return res.status(201).json({ id: id[0] })
      }
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async put (req, res) {
    const { id } = req.params
    const data = req.body

    try {
      const result = await db('reservations').where({ id }).update({ id, ...data })

      if (result) {
        return res.status(200).json({ message : 'Reserva salva com sucesso' })
      }

      return res.status(404).json({ message: 'Reserva não encontrada' })
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async destroy (req, res) {
    const { id } = req.params
    
    const result = await db('reservations').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Reserva excluída com sucesso' })
    }
    return res.status(404).json({ message: 'Reserva não encontrada' })
  },

  async mercadoPagoPaymentStatus (req, res) {
    const adminData = await getAdminData()

    mercadopago.configure({
      access_token: adminData.mercadoPagoToken
    })

    const { reservation_id } = req.params

    try {
      const response = await mercadopago.payment.search({ qs: { external_reference: reservation_id }})
      res.json(response.body)
    } catch (error) {
      res.status(500).json({ message: "Erro desconhecido ao acessar o Mercado Pago. Tente novamente mais tarde!", error})
    }
  },

  async mercadoPagoPayment (req, res) {
    const adminData = await getAdminData()

    mercadopago.configure({
      access_token: adminData.mercadoPagoToken
    })

    const { user_id, reservation_id } = req.params
    const { description, total } = req.body

    const user = await getUser(user_id)

    const { name, email, phone, cpf, homeAddress, addressNumber, cep } = user

    let preference = {
      items: [{
        title: description,
        unit_price: Number(total),
        quantity: 1,
      }],
      payer: {
        name: name.split(' ').slice(0, -1).join(' '),
        surname: name.split(' ').slice(-1).join(' '),
        email: email,
        phone: {
          area_code: phone.substr(0, 2),
          number: Number(phone.substr(2))
        },
        identification: {
          type: "CPF",
          number: cpf
        },
        address: {
          street_name: homeAddress,
          street_number: addressNumber,
          zip_code: cep
        },
      },
      external_reference: reservation_id,
      back_urls: {
        "success": `${process.env.APP_LOCATION}pagamento/success`,
        "failure": `${process.env.APP_LOCATION}pagamento/failure`,
        "pending": `${process.env.APP_LOCATION}pagamento/pending`
      },
      auto_return: 'all',
    }

    try {
      const response = await mercadopago.preferences.create(preference)  
      res.json({ id: response.body.id })
    } catch (error) {
      res.status(500).json({ message: "Erro desconhecido ao acessar o Mercado Pago. Tente novamente mais tarde!", error})
    }
  }
}
