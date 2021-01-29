const db = require('../../database/connection')

module.exports = {

  async getMany (req, res) {
    const { currentpage: currentPage } = req.headers
    const travels = await db('travels')
                          .orderBy('departure', 'desc')
                          .paginate({ perPage: 10, currentPage, isLengthAware: true })

    if (travels.hasOwnProperty('data')) {
      if (travels.data.length) {
        return res.status(200).json(travels)
      }
    }
    return res.status(204).json({ message: 'Não existem viagens cadastradas' })
  },

  async getOne (req, res) {
    const { id } = req.params
    const travel = await db('travels').where({ id })

    if (travel.length) {
      return res.status(200).json(travel[0])
    }
    return res.status(404).json({ message: 'Viagem não encontrada'})
  },

  async post (req, res) {
    const data = req.body

    try {
      const id = await db('travels').insert(data).returning('id')
      return res.status(201).json({ id: id[0] })
    } catch (error) {
      return res.status(400).json({ message: 'Ocorreu um erro não identificado', error })
    }
  },

  async put (req, res) {
    const { id } = req.params
    const data = req.body
    try {
      const result = await db('travels').where({ id }).update({ id, ...data })
      if (result) {
        return res.status(200).json({ message : 'Viagem salva com sucesso'})
      }
      return res.status(404).json({ message: 'Viagem não encontrada'})
    } catch (error) {
      return res.status(500).json({ message: 'Ocorreu um erro não identificado', error })     
    }
  },

  async destroy (req, res) {
    const { id } = req.params
    const result = await db('travels').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Viagem excluída com sucesso'})
    }
    return res.status(404).json({ message: 'Viagem não encontrada'})
  }
}
