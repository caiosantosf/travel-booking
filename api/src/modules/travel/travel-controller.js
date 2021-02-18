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
                .where('travel_id', id)
                .orderBy('initialAge', 'asc')
}

const getDeparturePlaces = async id => {
  return await db('travelDeparturePlaces')
                .where('travel_id', id)
                .orderBy('departureDate', 'asc')
}

const getSeatsWithReserves = async (id, travel_id) => {
  const bus = await db('buses').where({ id })
  const { seats } = bus[0].layout

  const reservations = await db('reservations').where({ travel_id })
  const seatsWithReserves = []

  const corridorLeft = Array.from({length: 20}, (j, i) => i * 4 + 1)
  const corridorRight = Array.from({length: 20}, (j, i) => i * 4 + 2)
  const windowRight = Array.from({length: 20}, (j, i) => i * 4 + 3)
  const windowLeft = Array.from({length: 20}, (j, i) => i * 4 + 4)

  for (const [i, seat] of seats.entries()) {
    let departureAvailable = true
    let returnAvailable = true
    let place = ''

    if (corridorLeft.includes(i)) {
      place = 'corridorLeft'
    }

    if (corridorRight.includes(i)) {
      place = 'corridorRight'
    }

    if (windowRight.includes(i)) {
      place = 'windowRight'
    }

    if (windowLeft.includes(i) || (!i)) {
      place = 'windowLeft'
    }

    for (const reservation of reservations) {
      if (seat) {
        if (seat === reservation.departureSeat) {
          departureAvailable = false
          break
        } 
        if (seat === reservation.returnSeat) {
          returnAvailable = false
          break
        } 
      }
    }

    seatsWithReserves.push({ seat, departureAvailable, returnAvailable, place })
  }
  return seatsWithReserves
}

module.exports = {

  async getMany (req, res) {
    const { currentpage: currentPage, opentravels: openTravels } = req.headers
    
    let travels = currentPage ? await db('travels')
                                .orderBy('id', 'desc')
                                .paginate({ perPage: 10, currentPage, isLengthAware: true })
                              : await db('travels')
                                .orderBy('id', 'desc')

    if (travels.hasOwnProperty('data')) {
      if (travels.data.length) {

        for (const [i, travel] of travels.data.entries()) {
          travels.data[i].values = await getValues(travel.id)
          travels.data[i].departurePlaces = await getDeparturePlaces(travel.id)
        }
        
        if (openTravels) {
          travels.data = travels.data.filter((travel) => (travel.departurePlaces[0] >= new Date()))
        }

        return res.status(200).json(travels)
      }
    } else {
      if (travels.length) {
        for (const [i, travel] of travels.entries()) {
          travels[i].values = await getValues(travel.id)
          travels[i].departurePlaces = await getDeparturePlaces(travel.id)
        }

        if (openTravels) {
          travels = travels.filter((travel) => (travel.departurePlaces[0].departureDate >= new Date()))
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
      travel[0].seats = await getSeatsWithReserves(travel[0].bus_id, id)
      
      delete travel[0].bus_id
      
      return res.status(200).json(travel[0])
    }
    return res.status(404).json({ message: 'Viagem não encontrada'})
  },

  async post (req, res) {
    const data = req.body
    
    data.imageName = ''
    data.installments = 1

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
