import React, { useState, useEffect } from 'react'
import { useHistory, Link } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { dateTimeBrazil, dateTimeDefault, calculateAge, calculateValue } from '../../config/util'
import { getUserId } from '../../config/security'
import { PersonXFill } from 'react-bootstrap-icons'
import { errorApi } from '../../config/handleErrors'

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
  const [status, setStatus] = useState(1)
  const [seats, setSeats] = useState([])
  const [controlsSeats, setControlsSeats] = useState(false)
  const [peopleSeats, setPeopleSeats] = useState([{ person: {}, seats: [], departurePosition: '', returnPosition: '' }])
  const [windowAllowed, setWindowAllowed] = useState(0)
  const [windowAmount, setWindowAmount] = useState({ departureSelected: 0, returnSelected: 0 })
  const [seatsSelected, setSeatsSelected] = useState({ departure: [], return: [] })
  const [adminData, setAdminData] = useState({})
  const [reservation, setReservation] = useState([])
  const [notes, setNotes] = useState()
  const [description, setDescription] = useState()
  
  const { travel_id, random } = props.match.params

  let history = useHistory()

  const resetState = () => {
    setMessage('')
    setLoadingSave(false)
    setValues([])
    setDeparturePlaces([])
    setHasOnlyDeparture(false)
    setHasOnlyReturn(false)
    setUser({name: '', document: '', documentType: '', value: '0.00'})
    setDependents([])
    setTravelType('normal')
    setDeparturePlace()
    setTotal('0.00')
    setSeats([])
    setControlsSeats(false)
    setPeopleSeats([{ person: {}, seats: [], departurePosition: '', returnPosition: '' }])
    setWindowAllowed(0)
    setWindowAmount({ departureSelected: 0, returnSelected: 0 })
    setSeatsSelected({ departure: [], return: [] })
    setAdminData({})
    setReservation([])
  }

  useEffect(() => {
    setStatus(1)
  }, [random])

  useEffect(() => {
    resetState()
    const fetchData = async () => {

      try {
        const res = await api.get(`/travels/${travel_id}`,
        { headers :{
          'x-access-token' : localStorage.getItem('token')
        }})

        const { data } = res
        setControlsSeats(data.controlsSeats)
        setValues(data.values)
        setDeparturePlaces(data.departurePlaces)
        setNotes(data.notes)
        setDescription(data.description)

        if (data.controlsSeats) {
          setSeats(data.seats)
        }

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
        const errorHandled = errorApi(error)
        if (errorHandled.general) {
          setMessage(errorHandled.error)
        }
      }

      try {
        const res = await api.get(`/admin-data/`, 
        { headers :{
          'x-access-token' : localStorage.getItem('token')
        }})

        const { data } = res
        setAdminData(data)
      } catch (error) {
        const errorHandled = errorApi(error)
        if (errorHandled.general) {
          setMessage(errorHandled.error)
        }
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
        const errorHandled = errorApi(error)
        if (errorHandled.general) {
          setMessage(errorHandled.error)
        }
      }
    }

    fetchData()
  }, [travelType, values])

  useEffect(() => {
    let auxTotal = dependents.reduce((tot, dependent) => tot + Number(dependent.value), 0)
    auxTotal += user.type === 'regular' ? Number(user.value) : 0
    setTotal((auxTotal).toFixed(2))
  }, [dependents, user])

  const handleContinue = async () => {
    if (status === 1) {
      if (controlsSeats) {

        let peopleSeatsAux = []
        let dependentsAux = dependents.slice(0)
        let hasError = false
        let count = 0
        
        setDependents(dependentsAux)

        for (const [index, person] of dependents.entries()) {
          if (!person.name) {
            dependentsAux[index].error = { name: 'O Nome é obrigatório' }
            hasError = true
          }
          if (!person.birth) {
            dependentsAux[index].error = { birth: 'A Data de Nascimento é obrigatória' }
            hasError = true
          }
          if (!person.document) {
            dependentsAux[index].error = { document: 'O Documento é obrigatório' }
            hasError = true
          }
          if (!hasError) {
            peopleSeatsAux.push({ index, person, seats: seats.slice(0), departurePosition: '', returnPosition: '' })  
          }
          count++
        }

        if (!hasError) {
          if (user.type !== 'admin') {
            peopleSeatsAux.push({ index: dependents.length, person: user, seats: seats.slice(0), departurePosition: '', returnPosition: '' })
          }

          setPeopleSeats(peopleSeatsAux)
          count++
        
          setMessage('')

          if (count) {
            setStatus(2)
          } else {
            setMessage('Insira ao menos um passageiro')
          }
        }
      } else {
        setStatus(3)
      }
    } 
    if (status === 2) {
      setMessage('')
      let nextStep = true

      for (const ps of peopleSeats) {
        if (!ps.person.lapChild) {
          if (!ps.departureSeat && (travelType === 'normal' || travelType === 'departure')) {
            setMessage('Selecione todas as suas poltronas')
            nextStep = false
            break
          }
          if (!ps.returnSeat && (travelType === 'normal' || travelType === 'return')) {
            setMessage('Selecione todas as suas poltronas')
            nextStep = false
            break
          }
        }
      }

      if (nextStep) {
        if (user.type === 'admin') {
          save()
          history.push('/')
         } else {
          if (adminData.mercadoPago) {
            handleMercadoPagoPayment()
          }
         }
        setStatus(3)
      }
    }
  }

  const handleBack = () => {
    if (status === 1 || status === 4) {
      history.push('/')
    }
    if (status === 2) {
      setStatus(1)
    }
    if (status === 3) {
      if (controlsSeats) {
        setStatus(2)
      } else {
        setStatus(1)
      }
    }
  }

  const save = async () => {
    setLoadingSave(true)
    setMessage('')

    const datetime = dateTimeDefault(new Date())

    let returnSeat = 0
    let departureSeat = 0

    for (const ps of peopleSeats) {
      if (ps.person.type) {
        returnSeat = ps.returnSeat
        departureSeat = ps.departureSeat
        break
      }
    }

    const config = { headers :{
      'x-access-token' : localStorage.getItem('token')
    }}

    let id = 0
    try {
      const res = await api.post('/reservations', {
        travel_id: Number(travel_id), 
        user_id: user.id, 
        departureSeat, 
        datetime,
        returnSeat, 
        value: Number(user.value), 
        status: "created", 
        travelType, 
        departurePlace_id: departurePlace,
        lapChild: false
      }, config)

      id = res.data.id
      setReservation({ id: res.data.id})
    } catch (error) {
      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      } else {
        let msg = ''
        Object.entries(error.response.data).forEach(([key, value]) => {
          msg += `${value} | `
        })
        msg = msg.substr(0, msg.length - 3)
        setMessage(msg)
      }
    }
    
    for (const [i, dependent] of dependents.entries()) {
      let dependentsAux = dependents.slice(0)
      dependentsAux[i].error = {}
      setDependents(dependentsAux)

      try {
        const { name, documentType, birth, document, value, lapChild } = dependent
        const res = await api.post('/dependents', { name, documentType, document, birth }, config)    
        
        returnSeat = lapChild ? 0 : peopleSeats[i].returnSeat
        departureSeat = lapChild ? 0 : peopleSeats[i].departureSeat

        if (res.status === 201) {
          try {
            await api.post('/reservations', {
              travel_id: Number(travel_id), 
              user_id: user.id, 
              dependent_id: res.data.id, 
              datetime,
              departureSeat, 
              returnSeat, 
              value: Number(value), 
              status: "dependent", 
              travelType, 
              departurePlace_id: departurePlace, 
              lapChild: lapChild ? true : false
            }, config)
          } catch (error) {
            const errorHandled = errorApi(error)
            if (errorHandled.general) {
              setMessage(errorHandled.error)
            } else {
              let msg = ''
              Object.entries(error.response.data).forEach(([key, value]) => {
                msg += `${value} | `
              })
              msg = msg.substr(0, msg.length - 3)
              setMessage(msg)
            }
          }
        }
      } catch (error) {
        const errorHandled = errorApi(error)
        if (errorHandled.general) {
          setMessage(errorHandled.error)
        } else {
          setMessage('Corrija as informações inválidas')

          let dependentsAux = dependents.slice(0)
          dependentsAux[i].error = errorHandled.error
          setDependents(dependentsAux)
        }
      }  
    }

    if (user.type !== 'admin' && reservation) {
      try {
        await api.post('/reservations-email', {}, { headers :{
          'x-access-token': localStorage.getItem('token'),
          'email': true,
          'user_id': user.id,
          'datetime': datetime
        }})
      } catch (error) {
        const errorHandled = errorApi(error)
        if (errorHandled.general) {
          setMessage(errorHandled.error)
        }
      }
    }

    setLoadingSave(false) 

    return id
  }

  const handleCompanyPayment = async () => {
    const id = await save()
    const link = adminData.companyPaymentLink.replace('email@email.com', user.email)
                                             .replace('@numeroreserva', id || 0)
                                             .replace('@nome', user.name)
                                             .replace('@cpf', user.cpf)
                                             .replace('@documento', user.document)
                                             .replace('@valor', total.toString().replace(".",","))
    
    window.open(link, "_blank")

    setStatus(4)
    resetState()
  }

  const handleInfinitePayPayment = async () => {
    await save()
    
    const link = `https://pay.infinitepay.io/${adminData.infinitePayUser}/${total.replace(".",",")}`

    window.open(link, "_blank")

    setStatus(4)
    resetState()
  }

  const handleMercadoPagoPayment = async () => {
    const id = await save()

    try {
      const res = await api.post(`/reservations/payment/mercadopago/${user.id}/${id}`, {
        description,
        total
      }, { headers :{
        'x-access-token' : localStorage.getItem('token')
      }})

      const script = document.createElement('script')

      script.src = 'https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js'
      script.dataset.preferenceId = res.data.id      

      document.querySelector("#mercadoPago").appendChild(script)
    } catch(error) {
      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      }
    }
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
    } catch (error) {
      let dependentsAux = dependents.slice(0)
      const birth = error.message
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
    return (
      <div className="form-check">
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

  useEffect(() => {
    let departureSelected = 0
    let returnSelected = 0
    let departure = []
    let return_ = []

    const allowed = peopleSeats.length === 1 ? 1 : Math.ceil(peopleSeats.length / 2)
    setWindowAllowed(allowed)

    for (const ps of peopleSeats) {
      if (ps.departurePosition.indexOf('window') !== -1) {
        departureSelected += 1
      }

      if (ps.returnPosition.indexOf('window') !== -1) {
        returnSelected += 1
      }

      if (ps.departureSeat) {
        departure.push(ps.departureSeat)
      }
      
      if (ps.returnSeat) {
        return_.push(ps.returnSeat)
      }
    }

    setWindowAmount({ departureSelected, returnSelected })
    setSeatsSelected({ departure, return: return_ })
  }, [peopleSeats])

  const handleSelectSeat = (personSeats, type, seat, position) => {
    const { index } = personSeats
    let peopleSeatsAux = peopleSeats.slice(0)

    if (type === 'departure') {
      peopleSeatsAux[index].departureSeat = seat
      peopleSeatsAux[index].departurePosition = position
    } else {
      peopleSeatsAux[index].returnSeat = seat
      peopleSeatsAux[index].returnPosition = position
    }

    setPeopleSeats(peopleSeatsAux)
  }

  const lapChild = (dependent, i) => {
    return (
      <div className="col-lg-2">
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

  const formReservationDetails = 
    <form id="reservationDetails" className="row g-3 mt-1 mb-3">
      <div className="col-md-12">
        <h6>Detalhes</h6>
        <div>{notes}</div>
      </div>

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

        <span className={`${user.type === 'admin' ? 'd-none' : 'd-block'} mb-1`}>
          {`${user.name} - ${user.documentType} ${user.document}`}
        </span>

        <span className={`${user.type === 'admin' ? 'd-none' : 'd-block'} mb-2`}>
          {`R$ ${user.value.toString().replace(".",",")}`}
        </span>

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

              <div className="col-lg-2">
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

              <div className="col-lg-2">
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
                  <option value="CN">C. Nascimento</option>
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
                        maxLength='32' 
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
    </form>

  const seatRow = (personSeats, type) => {
    const { person, departureSeat, returnSeat, departurePosition, returnPosition } = personSeats
    const { name } = person

    return (
      <div className="col">
        <span>{`${name} - ${type === 'departure' ? 'Ida' : 'Volta'}`}</span>

        <div className="m-0 row row-cols-5 mt-1">

          {personSeats.seats.map((s, i) => {
            const { seat, position, departureAvailable, returnAvailable } = s
            
            let disabled = false
            let classBtn = 'btn-primary'

            const classMargin = position === 'corridorRight'
                                ? 'ms-3 m-1'
                                : position  === 'windowLeft' || !position
                                  ? 'windowLeft'
                                  : 'm-1'

            if (type === 'departure') {
              if (departureSeat === seat) {
                classBtn = 'btn-warning text-white'
              } else {
                if (!departureAvailable || seatsSelected.departure.includes(seat)) {
                  disabled = true
                } else {
                  if (position.indexOf('window') !== -1 && departurePosition.indexOf('window') === -1) {
                    if (windowAllowed <= windowAmount.departureSelected) {
                      disabled = true
                    }
                  }
                }
              }
            } else {
              if (returnSeat === seat) {
                classBtn = 'btn-warning text-white'
              } else {
                if (!returnAvailable || seatsSelected.return.includes(seat)) {
                  disabled = true
                } else {
                  if (position.indexOf('window') !== -1 && returnPosition.indexOf('window') === -1) {
                    if (windowAllowed <= windowAmount.returnSelected) {
                      disabled = true
                    }
                  }
                }
              }
            }

            const className = `btn btn-sm mb-1 ${classMargin} ${classBtn}`

            return (
              seat ?
                <button key={i} type="button" 
                        onClick={() => handleSelectSeat(personSeats, type, seat, position)}
                        disabled={disabled}
                        className={className}>
                  {seat}
                </button>
              :
                <div className={classMargin}></div>
            )
          })}

        </div>
      </div>
    )
  }

  const formSeatsChoice = 
    <form id="seatsChoice" className="row g-3 mt-1 mb-4">
      <h6>Escolha de Poltronas</h6>

      <div className="row mt-0 g-3 row-cols-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4">

        {travelType === 'normal' || travelType === 'departure' ? 
          peopleSeats.map(p => {
            if (!p.person.lapChild) {
              return seatRow(p, 'departure')
            }
            return ''
          }) : ''}

        {travelType === 'normal' || travelType === 'return' ? 
          peopleSeats.map(p => {
            if (!p.person.lapChild) {
              return seatRow(p, 'return')
            }
            return ''
        }) : ''}
      </div>
    </form>

  const formPayment =
    <div id="payment" className="row g-3 mt-1 mb-4">
      <h6>Pagamento</h6>
      
      <div className={`col-md-12 ${!adminData.companyPayment ? 'd-none' : ''}`}>
        <button type="button" 
                className="btn btn-primary mb-2"
                onClick={handleCompanyPayment}>
          Pagamento Direto com a Empresa
        </button>
        <br />
        <span>Ao escolher esta opção a sua reserva será salva e será aberta uma tela externa ao aplivativo para seguir com o pagamento com a empresa</span>
      </div>

      <div className={`col-md-12 ${!adminData.infinitePay ? 'd-none' : ''}`}>
        <button type="button" 
                className="btn btn-primary mb-2"
                onClick={handleInfinitePayPayment}>
          Pagamento pelo InfinitePay
        </button>
        <br />
        <span>Ao escolher esta opção a sua reserva será salva e será aberta uma tela externa ao aplivativo para seguir com o pagamento pelo App InfinitePay</span>
      </div>

      <div className={`col-md-12 ${!adminData.mercadoPago ? 'd-none' : ''}`}>
        <div id="mercadoPago"></div>
        <br />
        <span>Ao escolher clicar no botão acima a sua reserva será salva e será aberta uma tela externa ao aplivativo para seguir com o pagamento pelo MercadoPago</span>
      </div>
    </div>

  const formSuccess =
    <form id="payment" className="row g-3 mt-1 mb-4">
      <div className="col-md-12">
        <h5>A sua reserva foi salva e você poderá sempre revisar todas as informações sobre ela pelo menu "Minhas Reservas"</h5>
        <h6>Caso queira falar conosco utilize o botão WhatsApp abaixo</h6>
      </div>
    </form>

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid mb-4">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h5>Reserva</h5>

          {status === 1 ? formReservationDetails : ''}
          {status === 2 ? formSeatsChoice : ''}
          {status === 3 ? formPayment : ''}
          {status === 4 ? formSuccess : ''}

          <span className={`${status === 4 ? 'd-none' : 'd-block'} fs-5 mb-3`}>{`Total R$ ${total.toString().replace(".",",")}`}</span>

          <div className='alert text-center alert-dismissible alert-danger fade show' role="alert"
              style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

          <div className="text-center d-grid gap-2">
            <button type="button" 
                    className={`btn btn-primary ${(status === 3 && !adminData.infinitePay) || status === 4 ? 'd-none' : ''}`}
                    onClick={handleContinue}
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
                    onClick={handleBack}>
              Voltar
            </button>

          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Reservation
