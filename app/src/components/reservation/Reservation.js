import React, { useState, useEffect } from 'react'
import { useHistory, Link } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { dateTimeBrazil, calculateAge, calculateValue } from '../../config/util'
import { getUserId } from '../../config/security'
import { PersonXFill } from 'react-bootstrap-icons'

function Reservation(props) {
  const [message, setMessage] = useState('')
  const [loadingSave, setLoadingSave] = useState(false)
  const [values, setValues] = useState([])
  const [departurePlaces, setDeparturePlaces] = useState([])
  const [hasOnlyDeparture, setHasOnlyDeparture] = useState(false)
  const [hasOnlyReturn, setHasOnlyReturn] = useState(false)
  const [user, setUser] = useState({name: '', document: '', documentType: '', value: '0.00'})
  const [dependents, setDependents] = useState([])
  const [travelType, setTravelType] = useState('normal')
  const [departurePlace, setDeparturePlace] = useState()
  const [total, setTotal] = useState('0.00')

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

        setDeparturePlace(data.departurePlaces[0].id)

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
      } catch (error) {
        //setMessage(error.response.data.message)
      }
    }

    fetchData()
  }, [travel_id])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/users/${getUserId()}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})

        const { data } = res
        data.birth = dateTimeBrazil(data.birth).substr(0, 10)
        data.age = calculateAge(data.birth)
        data.value = calculateValue(values, data.age, travelType, false).value

        setUser(data)
      } catch (error) {
        //setMessage(error.response.data.message)
      }
    }

    fetchData()
  }, [travelType, values])

  useEffect(() => {
    setTotal(dependents.reduce((tot, dependent) => tot + Number(dependent.value), 0) + Number(user.value))
  }, [dependents, user])

  const handleSave = async () => {
    setLoadingSave(true)
    setMessage('')

    const config = { headers :{
      'x-access-token' : localStorage.getItem('token')
    }}

    try {
      await api.post('/reservations', {travel_id: Number(travel_id), user_id: user.id, departureSeat: 0, 
        returnSeat: 0, value: Number(user.value), status: "1", travelType, departurePlace_id: departurePlace
      }, config)
    } catch (error) {
      let msg = ''
      Object.entries(error.response.data).forEach(([key, value]) => {
        msg += `${value} | `
      })
      msg = msg.substr(0, msg.length - 3)
      setMessage(msg)
    }
    
    for (const [i, dependent] of dependents.entries()) {
      let dependentsAux = dependents.slice(0)
      dependentsAux[i].error = {}
      setDependents(dependentsAux)

      try {
        const { name, documentType, birth, document, value } = dependent
        const res = await api.post('/dependents', { name, documentType, document, birth }, config)          

        if (res.status === 201) {
          try {
            await api.post('/reservations', {travel_id: Number(travel_id), user_id: user.id, dependent_id: res.data.id,
              departureSeat: 0, returnSeat: 0, value: Number(value), status: "1", travelType, departurePlace_id: departurePlace
            }, config)
          } catch (error) {
            let msg = ''
            Object.entries(error.response.data).forEach(([key, value]) => {
              msg += `${value} | `
            })
            msg = msg.substr(0, msg.length - 3)
            setMessage(msg)
          }
        }
      } catch (error) {
        setMessage('Corrija as informações inválidas')
        let dependentsAux = dependents.slice(0)
        dependentsAux[i].error = error
        setDependents(dependentsAux)
      }  
    }

    setLoadingSave(false) 
  }

  const handleAddPerson = async () => {
    let dependentsAux = dependents.slice(0)
    dependentsAux.push({name: '', document: '', documentType: 'RG', birth: '', error: {}, value: '0.00', optionLapChild: false})
    setDependents(dependentsAux)
  }

  const handleDestroyPerson = async i => {
    let dependentsAux = dependents.slice(0)
    dependentsAux.splice(i, 1)
    setDependents(dependentsAux)
  }

  const handleAgeCalculations = i => {
    try {
      const { birth } = dependents[i]
      const age = calculateAge(birth)
      const { value, optionLapChild } = calculateValue(values, age, travelType, false)

      let dependentsAux = dependents.slice(0)
      dependentsAux[i].age = age
      dependentsAux[i].optionLapChild = optionLapChild
      dependentsAux[i].value = value

      setDependents(dependentsAux)
    } catch (err) {
      let dependentsAux = dependents.slice(0)
      const birth = err.message
      dependentsAux[i].error = { birth }
      setDependents(dependentsAux)
    }
  }

  const handleLapChildOption = i => {
    const { age, lapChild } = dependents[i]
    const { value } = calculateValue(values, age, travelType, lapChild)

    let dependentsAux = dependents.slice(0)
    dependentsAux[i].value = value

    setDependents(dependentsAux)
  }

  const onlyDepartureReturn = option => {
    return (<div className="form-check">
              <input  className="form-check-input" 
                      type="radio" 
                      name="radioTravelType" 
                      id={`radio${option}`}
                      value={option}
                      onChange={e => {
                        setTravelType(e.target.value)
                      }}
              />
              <label className="form-check-label" htmlFor="radioDeparture">
                {option === 'departure' ? 'Só Ida' : 'Só Volta'}
              </label>
            </div>
    )
  }

  const lapChild = (dependent, i) => {
    return  (<div className="col-lg-2">
              <select type="text" 
                      className={`form-select form-select-sm ${dependent.error.lapChild ? 'is-invalid' : ''}`}
                      value={dependents[i].lapChild || false}
                      onChange={e => {
                        let dependentsAux = dependents.slice(0)
                        dependentsAux[i].lapChild = e.target.value === 'true' ? true : false
                        setDependents(dependentsAux)
                        handleLapChildOption(i)
                      }}
              >
                <option value={true}>Vai no Colo</option>
                <option value={false}>Vai em Poltrona</option>
              </select>

              <div id="validationLapChild" 
                className="invalid-feedback" 
                style={dependent.error.lapChild ? { display: 'inline' } : { display: 'none' }}>
                {dependent.error.lapChild}
              </div>
            </div>
    )
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid mb-2">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <Sidebar />

          <h5>Reserva</h5>

          <form id="reservationDetails" className="row g-3 mt-1 mb-4">
            <div className="col-md-12">
              <h6>Tipo de viagem</h6>

              <div className="form-check">
                <input className="form-check-input" type="radio" name="radioTravelType" id="radioDepartureReturn" 
                  value="normal"
                  onChange={e => {
                    setTravelType(e.target.value)
                  }}
                  defaultChecked
                  disabled={!hasOnlyDeparture && !hasOnlyReturn ? true : false} 
                />

                <label className="form-check-label" htmlFor="radioDepartureReturn">
                  Ida e Volta
                </label>
              </div>

              {hasOnlyDeparture ? onlyDepartureReturn('departure') : ''}
              {hasOnlyReturn ? onlyDepartureReturn('return') : ''}
              
            </div>

            <div className="col-md-12">
              <h6>Escolha o ponto de saída / retorno</h6>

              {departurePlaces.map((place, i) => {
                const { id, departureDate, returnDate, city, homeAddress, addressNumber, state } = place

                return (
                  <div className="form-check" key={id}>
                    <input className="form-check-input" type="radio" name="radioPlace" id={`radioPlace${id}`} 
                      defaultChecked={i === 0 ? true : false} 
                      disabled={departurePlaces.length === 1 ? true : false} 
                      value={id}
                      onChange={e => {
                        setDeparturePlace(e.target.value)
                      }}
                    />
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
              <span className="d-block mb-1">{`${user.name} - ${user.documentType} ${user.document}`}</span>
              <span className="d-block mb-2">{`R$ ${user.value.toString().replace(".",",")}`}</span>
              <button type="button" 
                      className="btn btn-primary"
                      onClick={handleAddPerson}>
                Adicionar Passageiro
              </button>

              {dependents.map((dependent, i) => {

                return (
                  <div className={`row g-3 ${i === 0 ? 'mt-1' : ''}`} key={i}>
                    
                    <div className="col-lg-4">
                      <div className="d-flex">
                        <Link onClick={() => {handleDestroyPerson(i)}} to="#">
                          <PersonXFill className="icon me-2" size={30}/>
                        </Link>
                        <input  type="text" 
                                className={`form-control form-control-sm ${dependent.error.dependentName ? 'is-invalid' : ''}`}
                                maxLength='255' 
                                placeholder="Nome"
                                value={dependents[i].name || ''}
                                onChange={e => {
                                  let dependentsAux = dependents.slice(0)
                                  dependentsAux[i].name = e.target.value
                                  setDependents(dependentsAux)
                                }}
                        />
                      </div>
                      
                      <div id="validationName" 
                        className="invalid-feedback" 
                        style={dependent.error.dependentName ? { display: 'inline' } : { display: 'none' }}>
                        {dependent.error.dependentName}
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <input  type="date" 
                              className={`form-control form-control-sm ${dependent.error.birth ? 'is-invalid' : ''}`}
                              maxLength='255' 
                              placeholder="Nascimento"
                              value={dependents[i].birth || ''}
                              onBlur={() => handleAgeCalculations(i)}
                              onChange={e => {
                                let dependentsAux = dependents.slice(0)
                                dependentsAux[i].birth = e.target.value
                                setDependents(dependentsAux)
                              }}
                      />
              
                      <div id="validationBirth" 
                        className="invalid-feedback" 
                        style={dependent.error.birth ? { display: 'inline' } : { display: 'none' }}>
                        {dependent.error.birth}
                      </div>
                    </div>

                    { dependent.optionLapChild ? lapChild(dependent, i) : '' }

                    <div className="col-lg-1">
                      <select type="text" 
                              className={`form-select form-select-sm ${dependent.error.documentType ? 'is-invalid' : ''}`}
                              value={dependents[i].documentType || ''}
                              onChange={e => {
                                let dependentsAux = dependents.slice(0)
                                dependentsAux[i].documentType = e.target.value
                                setDependents(dependentsAux)
                              }}
                      >
                        <option value="RG">RG</option>
                        <option value="CNH">CNH</option>
                      </select>

                      <div id="validationDocumentType" 
                        className="invalid-feedback" 
                        style={dependent.error.documentType ? { display: 'inline' } : { display: 'none' }}>
                        {dependent.error.documentType}
                      </div>
                    </div>

                    <div className="col-lg-2">
                      <input  type="text" 
                              className={`form-control form-control-sm ${dependent.error.document ? 'is-invalid' : ''}`} 
                              maxLength='14' 
                              placeholder="Documento"
                              value={dependents[i].document || ''}
                              onChange={e => {
                                let dependentsAux = dependents.slice(0)
                                dependentsAux[i].document = e.target.value
                                setDependents(dependentsAux)
                              }}
                      />

                      <div id="validationDocument" 
                        className="invalid-feedback" 
                        style={dependent.error.document ? { display: 'inline' } : { display: 'none' }}>
                        {dependent.error.document}
                      </div>
                    </div>

                    <span className="d-block value-span">{`R$ ${dependent.value.toString().replace(".",",")}`}</span>
                    <hr className={`value-separator ${i + 1 === dependents.length ? 'd-none' : ''}`} />
                  </div>
                )
              })}
            </div>
            
            <span className="d-block fs-5">{`Total R$ ${total.toString().replace(".",",")}`}</span>
          </form>

          <div className='alert text-center alert-dismissible alert-danger fade show' role="alert"
              style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

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
              Continuar
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
