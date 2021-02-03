const express = require('express')
const { getMany, post, destroy, getOne, put } = require('./values-controller')
const { routeSecurity : security } = require('../../../config/security')
const validation = require('./values-validation')

const routes = express.Router()

routes.get('/travels/:travel_id/values', 
  security([ 'admin', 'regular' ]),
  getMany
)

routes.post('/travels/:travel_id/values', 
  security([ 'admin' ]),
  validation(['travel_id', 'value', 'onlyReturnValue', 'onlyDepartureValue', 'initialAge', 'finalAge']),
  post
)

routes.get('/travels/:travel_id/values/:id', 
  security([ 'admin', 'regular' ]), 
  getOne
)

routes.put('/travels/:travel_id/values/:id', 
  security([ 'admin' ]), 
  validation(['travel_id', 'value', 'onlyReturnValue', 'onlyDepartureValue', 'initialAge', 'finalAge']),
  put
)

routes.delete('/travels/:travel_id/values/:id', 
  security([ 'admin' ]), 
  destroy
)

module.exports = routes
