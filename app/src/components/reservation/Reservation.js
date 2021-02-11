import React, { useState, useEffect } from 'react'
import { useHistory, Link } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { dateTimeBrazil } from '../../config/transformations'
import { getUserId } from '../../config/security'
import { PersonXFill } from 'react-bootstrap-icons'

function Reservation(props) {
  const [message, setMessage] = useState('')
  const [loadingSave, setLoadingSave] = useState(false)
  const [travel, setTravel] = useState({})
  const [values, setValues] = useState([])
  const [departurePlaces, setDeparturePlaces] = useState([])
  const [hasOnlyDeparture, setHasOnlyDeparture] = useState(false)
  const [hasOnlyReturn, setHasOnlyReturn] = useState(false)
  const [user, setUser] = useState({name: '', document: '', documentType: ''})
  const [dependents, setDependents] = useState([])

  let { travel_id } = props.match.params

  let history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/travels/${travel_id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})

        const { data } = res

        setValues(data.values)
        setDeparturePlaces(data.departurePlaces)

        data.values.forEach(val => {
          if (val.finalAge === 99) {
            if (val.onlyDepartureValue > 0) {
              setHasOnlyDeparture(true)
            }
            if (val.onlyReturnValue > 0) {
              setHasOnlyReturn(true)
            }
          }
        })

        setTravel(data)
      } catch (error) {
        setMessage(error.response.data.message)
      }

      try {
        const res = await api.get(`/users/${getUserId()}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})

        const { data } = res
        data.birth = dateTimeBrazil(data.birth).substr(0, 10)

        setUser(data)
      } catch (error) {
        setMessage(error.response.data.message)
      }
    }

    fetchData()
  }, [travel_id])

  const handleSave = async () => {

  }

  const handleAddPerson = async () => {
    let dependentsAux = dependents.slice(0)
    dependentsAux.push({name: '', document: '', documentType: 'RG', birth: ''})
    setDependents(dependentsAux)
  }

  const handleDestroyPerson = async i => {
    let dependentsAux = dependents.slice(0)
    dependentsAux.splice(i, 1)
    setDependents(dependentsAux)
  }

  const onlyDeparture = <div className="form-check">
                          <input className="form-check-input" type="radio" name="radioTravelType" id="radioDeparture" />
                          <label className="form-check-label" htmlFor="radioDeparture">
                            Só Ida
                          </label>
                        </div>

  const onlyReturn = <div className="form-check">
                        <input className="form-check-input" type="radio" name="radioTravelType" id="radioReturn" />
                        <label className="form-check-label" htmlFor="radioReturn">
                          Só Volta
                        </label>
                      </div>

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Sidebar />

        <h5>Reserva</h5>

        <form className="row g-3 mt-1 mb-4">
          <div className='alert text-center alert-primary' role="alert"
               style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

          <div className="col-md-12">
            <h6>Tipo de viagem</h6>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="radioTravelType" id="radioDepartureReturn" />
              <label className="form-check-label" htmlFor="radioDepartureReturn">
                Ida e Volta
              </label>
            </div>

            {hasOnlyDeparture ? onlyDeparture : ''}
            {hasOnlyReturn ? onlyReturn : ''}
            
          </div>

          <div className="col-md-12">
            <h6>Escolha o ponto de saída / retorno</h6>

            {departurePlaces.map((place, i) => {
              const { id, departureDate, returnDate, city, homeAddress, addressNumber, state } = place

              return (
                <div className="form-check" key={id}>
                  <input className="form-check-input" type="radio" name="radioPlace" id={`radioPlace${id}`} />
                  <label className="form-check-label" htmlFor={`radioPlace${id}`}>
                    {`${homeAddress}, ${addressNumber}, ${city}-${state}`}
                    <br /> 
                    {`${dateTimeBrazil(departureDate)} - ${dateTimeBrazil(returnDate)}`}
                  </label>
                </div>
              )
            })}
          </div>

          <div className="col-md-12">
            <h6>Passageiros</h6>
            <span className="d-block mb-2">{`${user.name} - ${user.documentType} ${user.document}`}</span>

            <button type="button" 
                    className="btn btn-primary mb-3"
                    onClick={handleAddPerson}>
              Adicionar Passageiro
            </button>

            {dependents.map((dependent, i) => {

              return (
                <div className="row g-3" key={i}>
                  
                  <div className="col-lg-4 d-flex">
                    <Link onClick={() => {handleDestroyPerson(i)}}>
                      <PersonXFill className="icon me-2" size={30}/>
                    </Link>
                    <input type="text" className='form-control form-control-sm' maxLength='255' placeholder="Nome"
                            value={dependents[i].name || ''}
                            onChange={e => {
                              let dependentsAux = dependents.slice(0)
                              dependentsAux[i].name = e.target.value
                              setDependents(dependentsAux)
                            }}/>
                  </div>
                  <div className="col-lg-3">
                    <input type="date" className='form-control form-control-sm' maxLength='255' placeholder="Nascimento"
                            value={dependents[i].birth || ''}
                            onChange={e => {
                              let dependentsAux = dependents.slice(0)
                              dependentsAux[i].name = e.target.value
                              setDependents(dependentsAux)
                            }}/>
                  </div>
                  <div className="col-lg-2">
                    <select type="text" className='form-select form-select-sm'
                            value={dependents[i].documentType || ''}
                            onChange={e => {
                              let dependentsAux = dependents.slice(0)
                              dependentsAux[i].name = e.target.value
                              setDependents(dependentsAux)
                            }}>
                      <option value="RG">RG</option>
                      <option value="CNH">CNH</option>
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <input type="text" className='form-control form-control-sm' maxLength='14' placeholder="Documento"
                            value={dependents[i].document || ''}
                            onChange={e => {
                              let dependentsAux = dependents.slice(0)
                              dependentsAux[i].name = e.target.value
                              setDependents(dependentsAux)
                            }}/>
                  </div>
                  <hr />
                </div>
              )
            })}
          </div>

        </form>

        <div className="text-center d-grid gap-2">
          <button type="button" 
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loadingSave}>
            <span className="spinner-border spinner-border-sm mx-1" 
                  role="status" 
                  aria-hidden="true" 
                  style={loadingSave ? { display: 'inline-block'} : { display : 'none' }}>
            </span>
            Confirmar
          </button>

          <button type="button" 
                  className="btn btn-warning text-white"
                  onClick={() => {
                    history.push('/')
                  }}>
            Voltar
          </button>

        </div>
      </div>
      </div>
    </React.Fragment>
  )
}

export default Reservation
