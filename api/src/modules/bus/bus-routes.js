const express = require('express')
const { getMany, post, destroy, getOne, put } = require('./bus-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./bus-validation')

const routes = express.Router()

routes.get('/buses', 
  security([ 'admin' ]), 
  getMany
)

routes.post('/buses', 
  security([ 'admin' ]),
  validation(['description', 'layout']), 
  post
)

routes.get('/buses/:id', 
  security([ 'admin']), 
  getOne
)

routes.put('/buses/:id', 
  security([ 'admin' ]), 
  validation(['description', 'layout']),
  put
)

routes.delete('/buses/:id', 
  security([ 'admin' ]), 
  destroy
)

module.exports = routes
