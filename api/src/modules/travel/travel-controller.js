const db = require('../../database/connection')

const dbErrors = error => {
  let message = { message : 'Ocorreu um erro não identificado', error}
  if (error.hasOwnProperty('constraint')) {
    if (error.constraint === 'travels_bus_id_foreign') {
      message = { bus_id : 'O ônibus não existe!' }
    }
  }
  return message
}

const getValues = async id => {
  return await db('travelValues')
                .where('id', id)
                .orderBy('id', 'desc')
}

const getDeparturePlaces = async id => {
  return await db('travelDeparturePlaces')
                .where('id', id)
                .orderBy('id', 'desc')
}

module.exports = {

  async getMany (req, res) {
    const { currentpage: currentPage } = req.headers
    
    let travels = await db('travels')
                          .orderBy('id', 'desc')
                          .paginate({ perPage: 10, currentPage, isLengthAware: true })

    if (travels.hasOwnProperty('data')) {
      if (travels.data.length) {

        for (i = 0; i < travels.data.length; i++) {
          travels.data[i].values = await getValues(travels.data[i].id)
          travels.data[i].departurePlaces = await getDeparturePlaces(travels.data[i].id)
        }

        return res.status(200).json(travels)
      }
    }
    return res.status(204).json({ message: 'Não existem viagens cadastradas' })
  },

  async getOne (req, res) {
    const { id } = req.params
    let travel = await db('travels').where({ id })

    if (travel.length) {
      travel[0].values = await getValues(travel[0].id)
      travel[0].departurePlaces = await getDeparturePlaces(travel[0].id)
      
      return res.status(200).json(travel[0])
    }
    return res.status(404).json({ message: 'Viagem não encontrada'})
  },

  async post (req, res) {
    const data = req.body
    
    data.imageName = ''

    try {
      const id = await db('travels').insert(data).returning('id')
      
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

    data.imageName = ''

    try {
      const result = await db('travels').where({ id }).update({ id, ...data })

      if (result) {
        return res.status(200).json({ message : 'Viagem salva com sucesso'})
      }

      return res.status(404).json({ message: 'Viagem não encontrada'})
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async patchImage (req, res) {
    const { id } = req.params
    const { filename : imageName} = req.file

    try {
      const result = await db('travels').where({ id }).update({ id, imageName })
      if (result) {
        return res.status(200).json({ message : 'Imagem salva com sucesso'})
      }
      return res.status(404).json({ message: 'Imagem não encontrada'})
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async destroy (req, res) {
    const { id } = req.params
    
    await db('travelValues').where({ travel_id: id }).del()
    await db('travelDeparturePlaces').where({ travel_id: id }).del()

    const result = await db('travels').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Viagem excluída com sucesso'})
    }
    return res.status(404).json({ message: 'Viagem não encontrada'})
  }
}
