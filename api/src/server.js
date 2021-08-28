require('dotenv').config()
const express = require('express')
const cors = require('cors')

const userRoutes = require('./modules/user/user-routes')
const busRoutes = require('./modules/bus/bus-routes')
const travelRoutes = require('./modules/travel/travel-routes')
const valueRoutes = require('./modules/travel/values/values-routes')
const departurePlacesRoutes = require('./modules/travel/departurePlaces/departure-places-routes')
const reservation = require('./modules/reservation/reservation-routes')
const dependent = require('./modules/dependent/dependent-routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static(`${process.cwd()}/public`))

app.get('/', function(req, res) {
  res.status(200).json({ message: 'Travel Booking is flying!' })
})

app.use(userRoutes)
app.use(busRoutes)
app.use(travelRoutes)
app.use(valueRoutes)
app.use(departurePlacesRoutes)
app.use(reservation)
app.use(dependent)

app.listen(process.env.PORT, () => {
  console.log(`API server running on port ${process.env.PORT}!`)
})
