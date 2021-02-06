import React, { useState, useEffect} from 'react'
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { CalendarCheck } from 'react-bootstrap-icons'
import { Link, useHistory } from "react-router-dom"
import { api, apiUrl } from '../../config/api'
import { dateTimeBrazil } from '../../config/transformations'

function AdminHome({ userType }) {
  const [travels, setTravels] = useState([])

  //let history = useHistory()

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
        } else {
          //fala que nao tem viagem em aberto
        }
      } catch (error) {  
        //fala que houve um erro
      }
    }
    fetchData()
  })

  const noTravels = <h1>No momento não temos viagens em aberto!</h1>

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="row">
          <NavHeader />
          
          <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Sidebar pageType={userType}/>

            {!travels.length ? noTravels : ''}

            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3">

              {travels.map(travel => {
                const { id, description, destination, departurePlaces, values, imageName } = travel
                const onlyOneValue = values.length === 1 ? true : false

                return (
                  <div className="col">
                    <Link key={id} className="card-link" to="/">
                      <div className="card shadow-sm bg-light">
                        <img src={`${apiUrl}uploads/${imageName}`} className="card-img-top center-cropped" alt={destination} />
                        <div className="card-body">
                          <h5>{destination}</h5>
                          <p className="card-text">{description}</p>
                          <p className="text-danger">* Últimas Poltronas!</p>
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
                            {values.map(val => {
                              const { value, initialAge, finalAge, lapChild } = val
                              
                              return (
                                <span>
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
                                  <div className="d-block">
                                    <h5 className="badge bg-custom fs-5 values">{`R$ ${value.replace(".",",")}`}</h5>
                                  </div>
                                </span>
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
      </div>
    </React.Fragment>
  )
}

export default AdminHome
