const db = require('../../../database/connection')

const dbErrors = error => {
  let message = { message : 'Ocorreu um erro não identificado', error}
  if (error.hasOwnProperty('constraint')) {
    if (error.constraint === '"traveldepartureplaces_travel_id_foreign"') {
      message = { bus_id : 'a viagem não existe!' }
    }
  }
  return message
}

module.exports = {

  async getMany (req, res) {
    const { travel_id } = req.params

    let departurePlaces = await db('travelDeparturePlaces')
                          .where('travel_id', travel_id)
                          .orderBy('id', 'desc')
                          
    if (departurePlaces.hasOwnProperty('data')) {
      if (departurePlaces.data.length) {
        return res.status(200).json(departurePlaces)
      }
    }

    return res.status(204).json({ message: 'Não existem pontos de saída cadastrados' })
  },

  async getOne (req, res) {
    const { id } = req.params
    let departurePlace = await db('travelDeparturePlaces').where({ id })

    if (departurePlace.length) {      
      return res.status(200).json(departurePlace[0])
    }
    return res.status(404).json({ message: 'Ponto de saída não encontrados'})
  },

  async post (req, res) {
    const data = req.body
    const { travel_id } = req.params

    data.departureDate = new Date(data.departureDate)
    data.returnDate = new Date(data.returnDate)
    data.travel_id = travel_id

    try {
      const id = await db('travelDeparturePlaces').insert(data).returning('id')
      
      if (id) {
        return res.status(201).json({ id: id[0] })
      }

      return res.status(500).json({message: 'Ocorreu um erro inesperado'})
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async put (req, res) {
    const { id, travel_id } = req.params
    const data = req.body

    data.departureDate = new Date(data.departureDate)
    data.returnDate = new Date(data.returnDate)
    data.travel_id = travel_id

    try {
      const result = await db('travelDeparturePlaces').where({ id }).update({ id, ...data })

      if (result) {
        return res.status(200).json({ message : 'Ponto de saída salvo com sucesso'})
      }

      return res.status(404).json({ message: 'Ponto de saída não encontrado'})
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async destroy (req, res) {
    const { id } = req.params
    const result = await db('travels').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Ponto de saída excluído com sucesso'})
    }
    return res.status(404).json({ message: 'Ponto de saída não encontrado'})
  }
}
