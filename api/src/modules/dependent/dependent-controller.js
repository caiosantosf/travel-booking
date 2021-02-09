const db = require('../../database/connection')

const dbErrors = error => {
  let message = { message : 'Ocorreu um erro não identificado', error}
  return message
}

module.exports = {

  async getMany (req, res) {
    const { currentpage: currentPage, opendependents: opendependents } = req.headers
    
    let dependents = currentPage ? await db('dependents')
                                .orderBy('id', 'desc')
                                .paginate({ perPage: 10, currentPage, isLengthAware: true })
                              : await db('dependents')
                                .orderBy('id', 'desc')

    if (dependents.hasOwnProperty('data')) {
      if (dependents.data.length) {
        return res.status(200).json(dependents)
      }
    } else {
      if (dependents.length) {
        return res.status(200).json(dependents)
      }
    }
    return res.status(204).json({ message: 'Não existem Dependentes cadastrados' })
  },

  async getOne (req, res) {
    const { id } = req.params
    let dependent = await db('dependents').where({ id })

    if (dependent.length) {
      return res.status(200).json(dependent[0])
    }
    return res.status(404).json({ message: 'Dependente não encontrado'})
  },

  async post (req, res) {
    const data = req.body
    
    try {
      const id = await db('dependents').insert(data).returning('id')
      
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
      const result = await db('dependents').where({ id }).update({ id, ...data })

      if (result) {
        return res.status(200).json({ message : 'Dependente salvo com sucesso'})
      }

      return res.status(404).json({ message: 'Dependente não encontrado'})
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async destroy (req, res) {
    const { id } = req.params
    
    const result = await db('dependents').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Dependente excluído com sucesso'})
    }
    return res.status(404).json({ message: 'Dependente não encontrado'})
  }
}
