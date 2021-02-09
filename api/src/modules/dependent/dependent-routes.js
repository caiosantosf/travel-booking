const express = require('express')
const { getMany, post, destroy, getOne, put } = require('./dependent-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./dependent-validation')

const routes = express.Router()
const columns = ['name', 'documentType', 'document', 'birth']

routes.get('/dependents',
  security([ 'admin' ]),
  getMany
)

routes.post('/dependents', 
  security([ 'admin', 'regular' ]),
  validation(columns),
  post
)

routes.get('/dependents/:id', 
  security([ 'admin' ]), 
  getOne
)

routes.put('/dependents/:id', 
  security([ 'admin' ]), 
  validation(columns),
  put
)

routes.delete('/dependents/:id', 
  security([ 'admin' ]), 
  destroy
)

module.exports = routes
