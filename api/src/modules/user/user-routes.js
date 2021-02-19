const express = require('express')
const { auth, getMany, post, destroy, getOne, put, emailResetPassword, putAdminData, getAdminData } = require('./user-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./user-validation')

const routes = express.Router()

routes.post('/users/login', 
  validation(['cpf', 'password']), 
  auth
)

routes.post('/users/login/admin', 
  validation(['cpf', 'password']), 
  auth
)

routes.post('/users/login/emailresetpassword',
  validation(['email']), 
  emailResetPassword
)

routes.patch('/users/login/resetpassword/:id', 
  security(['regular', 'admin']), 
  validation(['password']), 
  put
)

routes.get('/users', 
  security(['admin']), 
  getMany
)

routes.post('/users', 
  validation(['name', 'cpf', 'phone', 'email', 'password', 'documentType', 
              'document', 'cep', 'homeAddress', 'addressNumber',
              'neighborhood', 'city', 'state', 'birth']), 
  post
)

routes.get('/users/:id', 
  security(['regular', 'admin']), 
  getOne
)

routes.put('/users/:id', 
  security(['regular', 'admin']), 
  validation(['name', 'cpf', 'phone', 'email', 'password', 'documentType', 
              'document', 'cep', 'homeAddress', 'addressNumber',
              'neighborhood', 'city', 'state', 'birth']),
  put
)

routes.put('/admin-data/:id', 
  security(['admin']),
  putAdminData
)

routes.get('/admin-data/', 
  security(['regular', 'admin']),
  getAdminData
)

routes.delete('/users/:id', 
  security(['regular', 'admin']), 
  destroy
)

module.exports = routes
