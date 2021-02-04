const db = require('../../database/connection')

module.exports = {

  async getMany (req, res) {
    const { currentpage: currentPage } = req.headers
    const buses = currentPage ? await db('buses')
                                  .orderBy('description')
                                  .paginate({ perPage: 10, currentPage, isLengthAware: true })
                              : await db('buses')
                                  .orderBy('description')
                          
    if (buses.hasOwnProperty('data')) {
      if (buses.data.length) {
        return res.status(200).json(buses)
      }
    } else {
      if (buses.length) {
        return res.status(200).json(buses)
      }
    }
    return res.status(204).json({ message: 'Não existem ônibus cadastrados' })
  },

  async getOne (req, res) {
    const { id } = req.params
    const bus = await db('buses').where({ id })

    if (bus.length) {
      return res.status(200).json(bus[0])
    }
    return res.status(404).json({ message: 'Ônibus não encontrado'})
  },

  async post (req, res) {
    const data = req.body

    try {
      const id = await db('buses').insert(data).returning('id')
      return res.status(201).json({ id: id[0] })
    } catch (error) {
      return res.status(400).json({ message: 'Ocorreu um erro não identificado', error })
    }
  },

  async put (req, res) {
    const { id } = req.params
    const data = req.body
    try {
      const result = await db('buses').where({ id }).update({ id, ...data })
      if (result) {
        return res.status(200).json({ message : 'Ônibus salvo com sucesso'})
      }
      return res.status(404).json({ message: 'Ônibus não encontrado'})
    } catch (error) {
      return res.status(500).json({ message: 'Ocorreu um erro não identificado', error })     
    }
  },

  async destroy (req, res) {
    const { id } = req.params
    const result = await db('buses').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Ônibus excluído com sucesso'})
    }
    return res.status(404).json({ message: 'Ônibus não encontrado'})
  }
}
