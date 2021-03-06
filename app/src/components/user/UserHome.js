import React, { useState, useEffect} from 'react'
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { CalendarCheck } from 'react-bootstrap-icons'
import { Link } from "react-router-dom"
import { api, apiUrl } from '../../config/api'
import { dateTimeBrazil } from '../../config/util'
import { errorApi } from '../../config/handleErrors'

function UserHome() {
  const [travels, setTravels] = useState([])
  const [message, setMessage] = useState('')
  const [noTravels, setNoTravels] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/travels', 
          { headers :{
            'openTravels': true, 
            'x-access-token' : localStorage.getItem('token')
          }})
        if (res.status === 200) {
          setTravels(res.data)
          if (!res.data.length) {
            setNoTravels(<h1>No momento não temos viagens em aberto!</h1>)
          }
        } else {
          setNoTravels(<h1>No momento não temos viagens em aberto!</h1>) 
        }
      } catch (error) {  
        const errorHandled = errorApi(error)
        if (errorHandled.general) {
          setMessage(errorHandled.error)
        }
      }
    }
    fetchData()
  }, [])

  return (
    <React.Fragment>
      <NavHeader />            
      <div className="container-fluid mb-4">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <div className='alert text-center alert-danger' role="alert"
               style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>
          
          {noTravels}

          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3">

            {travels.map(travel => {
              const { id, description, destination, departurePlaces, values, imageName, seatsAvailable } = travel
              const onlyOneValue = values.length === 1 ? true : false
              const random = Math.ceil(Math.random() * 1000000)

              const available = seatsAvailable <= 10 && seatsAvailable > 1 ? `* Últimas ${seatsAvailable} Poltronas!` 
                              : seatsAvailable === 1 ? 'Última Poltrona!' : ''

              const danger = <div className='text-danger mt-1'>{available}</div>

              return (
                <div key={id} className="col">
                  <Link className="card-link" to={`/reserva/${id}/${random}`}>
                    <div className="card shadow-sm bg-light">
                      <img src={`${apiUrl}uploads/${imageName}`} className="card-img-top center-cropped" alt={destination} />
                      <div className="card-body">
                        <h5>{destination}</h5>
                        <p className="card-text">
                          {description}
                          
                          {available ? danger : ''}
                        </p>
                        
                        <hr />
                          {departurePlaces.map((place, i) => {
                            const { id, departureDate, returnDate, city } = place

                            return (
                              <div key={id}>
                                <span className={`d-block ${i ? 'mt-2' : ''}`} >{`Saída de ${city}`}</span>
                                <span><CalendarCheck />{` ${dateTimeBrazil(departureDate)} - ${dateTimeBrazil(returnDate)}`}</span>
                              </div>
                            )
                          })}
                        <hr />
                        <div >
                          {values.map((val, i) => {
                            const { id, value, onlyDepartureValue, onlyReturnValue, initialAge, finalAge, lapChild } = val
                            
                            return (
                              <div key={id} className={i ? 'mt-2' : ''}>
                                {
                                  onlyOneValue ?
                                    ''
                                  :
                                    lapChild ?
                                      'Criança de Colo'
                                    :
                                      finalAge === 99 ?
                                        `Acima de ${initialAge} anos`
                                      :
                                        `Até ${finalAge} anos`
                                }
                                <div className="d-flex">
                                  <div className="badge bg-custom-primary fs-5">
                                    { 
                                      `R$ ${value.replace(".00","").replace(".",",")}`
                                    }
                                  </div>

                                  <div className="ms-1 badge bg-custom-secondary price-secondary"
                                        style={onlyDepartureValue > 0 ? { display: 'inline' } : { display: 'none' }}>

                                    <span className="d-block fs-7 text-start">Só Ida </span>
                                    <span className="d-block fs-6">
                                    { Number.isInteger(onlyDepartureValue) ?
                                        `R$ ${onlyDepartureValue.replace(".",",")}`
                                      :
                                        `R$ ${onlyDepartureValue.replace(".00","")}`
                                    }
                                    </span>
                                  </div>

                                  <div className="ms-1 badge bg-custom-secondary"
                                        style={onlyReturnValue > 0 ? { display: 'inline' } : { display: 'none' }}>

                                    <span className="d-block fs-7 text-start">Só Volta</span>
                                    <span className="d-block fs-6">
                                    { Number.isInteger(onlyReturnValue) ?
                                        `R$ ${onlyReturnValue.replace(".",",")}`
                                      :
                                        `R$ ${onlyReturnValue.replace(".00","")}`
                                    }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}                          
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserHome
