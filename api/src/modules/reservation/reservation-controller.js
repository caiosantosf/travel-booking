const db = require('../../database/connection')

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
        }
      }
      return res
    }
    
    const { currentpage: currentPage, user_id, travel_id } = req.headers
    let reservations = {}
    let reservationsGrouped = {}

    if (!user_id) {
      reservations = await db('reservations')
                                  .modify(q => {
                                    if (travel_id) q.where({ travel_id })
                                  })
                                  .orderBy('id', 'desc')
                                  .paginate({ perPage: 10, currentPage, isLengthAware: true })
      
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
                            .paginate({ perPage: 10, currentPage, isLengthAware: true })
      
      if (reservationsGrouped.hasOwnProperty('data')) {
        if (reservationsGrouped.data.length) {

          for (const [i, reservation] of reservationsGrouped.data.entries()) {
            reservations = await db('reservations')
                                  .where({ user_id })
                                  .where({ datetime: reservation.datetime })
          
            reservationsGrouped.data[i].reservations = await completeReservation(reservations)
            reservationsGrouped.data[i].travel = await getTravel(reservation.travel_id, reservationsGrouped.data[i].reservations[0].departurePlace_id)
          }

          return res.status(200).json(reservationsGrouped)
        }
      }
      return res.status(204).json({ message: 'Não existem reservas cadastradas' })
    }
  },

  async getOne (req, res) {
    const { travel_id } = req.params
    let reservation = await db('reservations').where({ travel_id })
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
  }
}
