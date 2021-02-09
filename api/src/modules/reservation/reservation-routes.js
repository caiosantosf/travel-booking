const express = require('express')
const { getMany, post, destroy, getOne, put } = require('./reservation-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./reservation-validation')

const routes = express.Router()
const columns = ['travel_id', 'user_id', 'dependent_id', 'departureSeat', 'returnSeat']

routes.get('/reservations',
  security(['admin']),
  getMany
)

routes.post('/reservations', 
  security(['admin', 'regular']),
  validation(columns),
  post
)

routes.get('/reservations/:id', 
  security(['admin']), 
  getOne
)

routes.put('/reservations/:id', 
  security(['admin']), 
  validation(columns),
  put
)

routes.delete('/reservations/:id', 
  security(['admin']), 
  destroy
)

module.exports = routes
