const db = require('../../../database/connection')

const dbErrors = error => {
  let message = { message : 'Ocorreu um erro não identificado', error}
  if (error.hasOwnProperty('constraint')) {
    if (error.constraint === 'travelvalues_travel_id_foreign') {
      message = { bus_id : 'A viagem não existe!' }
    }
  }
  return message
}

module.exports = {

  async getMany (req, res) {    
    const { travel_id } = req.params

    let values = await db('travelValues')
                          .where('travel_id', travel_id)
                          .orderBy('id', 'desc')
                          
    if (values.hasOwnProperty('data')) {
      if (values.data.length) {
        return res.status(200).json(values)
      }
    }

    return res.status(204).json({ message: 'Não existem valores cadastrados' })
  },

  async getOne (req, res) {
    const { id } = req.params
    let value = await db('travelValues').where({ id })

    if (value.length) {      
      return res.status(200).json(value[0])
    }
    return res.status(404).json({ message: 'Valor não encontrados'})
  },

  async post (req, res) {
    const data = req.body
    const { travel_id } = req.params

    data.travel_id = travel_id

    try {
      const id = await db('travelValues').insert(data).returning('id')
      
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

    data.travel_id = travel_id

    try {
      const result = await db('travelValues').where({ id }).update({ id, ...data })

      if (result) {
        return res.status(200).json({ message : 'Valor salvo com sucesso'})
      }

      return res.status(404).json({ message: 'Valor não encontrado'})
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async destroy (req, res) {
    const { id } = req.params
    const result = await db('travelValues').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Valor excluído com sucesso'})
    }
    return res.status(404).json({ message: 'Valor não encontrado'})
  }
}
