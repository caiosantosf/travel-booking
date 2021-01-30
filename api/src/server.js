require('dotenv').config()
const express = require('express')
const cors = require('cors')

const userRoutes = require('./modules/user/user-routes')
const busRoutes = require('./modules/bus/bus-routes')
const travelRoutes = require('./modules/travel/travel-routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use(userRoutes)
app.use(busRoutes)
app.use(travelRoutes)

app.listen(process.env.PORT, () => {
  console.log(`API server running on port ${process.env.PORT}!`)
})
