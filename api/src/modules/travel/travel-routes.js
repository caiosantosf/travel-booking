const express = require('express')
const { getMany, post, destroy, getOne, put } = require('./travel-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./travel-validation')

const routes = express.Router()

routes.get('/travels', 
  security([ 'admin', 'regular' ]), 
  getMany
)

routes.post('/travels', 
  security([ 'admin' ]),
  validation(['description', 'layout']), 
  post
)

routes.get('/travels/:id', 
  security([ 'admin', 'regular' ]), 
  getOne
)

routes.put('/travels/:id', 
  security([ 'admin' ]), 
  validation(['description', 'layout']),
  put
)

routes.delete('/travels/:id', 
  security([ 'admin' ]), 
  destroy
)

module.exports = routes
