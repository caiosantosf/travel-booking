const express = require('express')
const { getMany, post, destroy, getOne, put } = require('./departure-places-controller')
const { routeSecurity : security } = require('../../../config/security')
const validation = require('./departure-places-validation')

const routes = express.Router()

routes.get('/travels/:travel_id/departureplaces', 
  security([ 'admin', 'regular' ]),
  getMany
)

routes.post('/travels/:travel_id/departureplaces', 
  security([ 'admin' ]),
  validation(['cep', 'homeAddress', 'addressNumber', 'neighborhood', 'city', 'state', 'departureDate', 'returnDate']),
  post
)

routes.get('/travels/:travel_id/departureplaces/:id', 
  security([ 'admin', 'regular' ]), 
  getOne
)

routes.put('/travels/:travel_id/departureplaces/:id', 
  security([ 'admin' ]), 
  validation(['cep', 'homeAddress', 'addressNumber', 'neighborhood', 'city', 'state', 'departureDate', 'returnDate']),
  put
)

routes.delete('/travels/:travel_id/departureplaces/:id', 
  security([ 'admin' ]), 
  destroy
)

module.exports = routes
