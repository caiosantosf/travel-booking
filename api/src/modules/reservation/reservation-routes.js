const express = require('express')
const { getMany, post, destroy, getOne, put } = require('./reservation-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./reservation-validation')

const routes = express.Router()

routes.get('/reservations',
  security(['admin', 'regular']),
  getMany
)

routes.post('/reservations', 
  security(['admin', 'regular']),
  validation(['travel_id', 'user_id']),
  post
)

routes.get('/reservations/:id', 
  security(['admin']), 
  getOne
)

routes.put('/reservations/:id', 
  security(['admin', 'regular']), 
  validation(['travel_id', 'user_id', 'dependent_id', 'departureSeat', 'returnSeat']),
  put
)

routes.delete('/reservations/:id', 
  security(['admin']), 
  destroy
)

module.exports = routes
