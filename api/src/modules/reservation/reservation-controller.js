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

const getDependent = async id => {
  const dependent = await db('dependents').where({ id })
  return dependent[0]
}

const getUser = async id => {
  const user = await db('users').where({ id })
  return user[0]
}

const getPerson = async reservation => {
  const { dependent_id, user_id } = reservation
  let person = dependent_id ? await getDependent(dependent_id) : await getUser(user_id)
  return { name: person.name, birth: person.birth, documentType: person.documentType, document: person.document }
}

module.exports = {

  async getMany (req, res) {
    const { currentpage: currentPage } = req.headers
    
    let reservations = currentPage ? await db('reservations')
                                .orderBy('id', 'desc')
                                .paginate({ perPage: 10, currentPage, isLengthAware: true })
                              : await db('reservations')
                                .orderBy('id', 'desc')

    if (reservations.hasOwnProperty('data')) {
      if (reservations.data.length) {

        for (const [i, reservation] of reservations.data.entries()) {
          reservations[i].person = await getPerson(reservation)
        }
      
        return res.status(200).json(reservations)
      }
    } else {
      if (reservations.length) {
        for (const [i, reservation] of reservations.entries()) {
          reservations[i].person = await getPerson(reservation)
        }
        return res.status(200).json(reservations)
      }
    }
    return res.status(204).json({ message: 'Não existem reservas cadastradas' })
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
  }
}
