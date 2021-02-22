import React, { useState, useEffect} from 'react'
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { CalendarCheck, PersonFill } from 'react-bootstrap-icons'
import { api, apiUrl } from '../../config/api'
import { dateTimeBrazil } from '../../config/util'
import { getUserId } from '../../config/security'

function UserReservations() {
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/reservations', 
          { headers :{
            'user_id': getUserId(), 
            'x-access-token' : localStorage.getItem('token')
          }})

        if (res.status === 200) {
          setReservations(res.data.data)
        }
      } catch (error) {  
        //fala que houve um erro
      }
    }
    fetchData()
  }, [])

  return (
    <React.Fragment>
      <NavHeader />            
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />
          
          {!reservations ? <h1>Você não fez nenhuma reserva!</h1> : <h5>Minhas Reservas</h5>}

          <div className="mt-1 row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3">

            {reservations.map((reservation, i) => {
              const { travel, reservations } = reservation
              const { imageName, destination, departurePlace } = travel

              const total = (reservation.reservations.reduce((tot, person) => tot + Number(person.value), 0)).toFixed(2)
              
              return (
                <div key={i} className="col">
                  <div className="card shadow-sm bg-light">
                    <img src={`${apiUrl}uploads/${imageName}`} className="card-img-top center-cropped" alt={destination} />
                    <div className="card-body">
                      <h5>{destination}</h5>
                      <hr />
                        {departurePlace.map((place, i) => {
                          const { departureDate, returnDate, homeAddress, addressNumber } = place

                          return (
                            <div key={i}>
                              <span className={`d-block ${i ? 'mt-2' : ''}`} >{`${homeAddress}, ${addressNumber}`}</span>
                              <span><CalendarCheck />{` ${dateTimeBrazil(departureDate)} - ${dateTimeBrazil(returnDate)}`}</span>
                            </div>
                          )
                        })}
                      <hr />
                        {reservations.map((res, i) => {
                          const { person, departureSeat, returnSeat } = res
                          const { name } = person

                          const departure = departureSeat ? `Ida: ${departureSeat}` : ''
                          const return_ = returnSeat ? `Volta: ${returnSeat}` : ''

                          return (
                            <div key={i}>
                              <span><PersonFill />{` ${name}`}</span><br />
                              <span>{`Poltronas - ${departure} ${return_}`}</span>
                            </div>
                          )
                        })}
                      <hr />
                        <div>
                          <span>{`Valor Total: ${total.toString().replace(".",",")}`}</span>
                        </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserReservations
