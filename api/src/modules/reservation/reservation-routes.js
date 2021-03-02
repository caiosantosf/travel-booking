const express = require('express')
const { getMany, post, destroy, getOne, put, mercadoPagoPayment, mercadoPagoPaymentStatus } = require('./reservation-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./reservation-validation')

const routes = express.Router()

routes.post('/reservations/payment/mercadopago/:user_id/:reservation_id',
  security(['admin', 'regular']),
  mercadoPagoPayment
)

routes.get('/reservations/payment-status/mercadopago/:reservation_id',
  security(['admin', 'regular']),
  mercadoPagoPaymentStatus
)

routes.get('/reservations',
  security(['admin', 'regular']),
  getMany
)

routes.post('/reservations-email', 
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
  validation(['status']),
  put
)

routes.delete('/reservations/:id', 
  security(['admin']), 
  destroy
)

module.exports = routes
