const express = require('express')
const { getMany, post, destroy, getOne, put, patchImage } = require('./travel-controller')
const { routeSecurity : security } = require('../../config/security')
const validation = require('./travel-validation')
const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 100000000) + file.originalname)
  }
})

const upload = multer({ storage })

const routes = express.Router()

routes.get('/travels', 
  security([ 'admin', 'regular' ]), 
  getMany
)

routes.post('/travels', 
  security([ 'admin' ]),
  validation(['description', 'destination', 'departure', 
              'value', 'bus_id', 'days', 'departurePlace']), 
  post
)

routes.get('/travels/:id', 
  security([ 'admin', 'regular' ]), 
  getOne
)

routes.put('/travels/:id', 
  security([ 'admin' ]), 
  validation(['description', 'destination', 'departure', 
              'value', 'bus_id', 'days', 'departurePlace']),
  put
)

routes.patch('/travels/image/:id', 
  security([ 'admin' ]),
  upload.single('file'),
  patchImage
)

routes.delete('/travels/:id', 
  security([ 'admin' ]), 
  destroy
)

module.exports = routes
