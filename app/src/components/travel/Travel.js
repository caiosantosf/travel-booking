import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { PencilSquare } from 'react-bootstrap-icons'
import { dateTimeBrazil } from '../../config/util'

function Travel(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDestroy, setLoadingDestroy] = useState(false)
  const [travel, setTravel] = useState({})
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  const [file, setFile] = useState()
  const [buses, setBuses] = useState([])
  const [values, setValues] = useState([])
  const [departurePlaces, setDeparturePlaces] = useState([])

  let history = useHistory()

  let { id: travel_id } = props.match.params

  const config = { headers :{
    'x-access-token' : localStorage.getItem('token')
  }}

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

        setTravel(data)
      } catch (error) {
        setMessage(error.response.data.message)
      }
    }

    const fetchBuses = async () => {
      try {
        const res = await api.get(`/buses`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})

        if (res.status === 200) {
          const { data } = res
          setBuses(data)
        
          if (travel_id === 'novo') {
            setTravel({controlsSeats: true, bus_id: data[0].id})
          }
        }
      } catch (error) {
        //setMessage(error.response.data.message)
      }
    }

    if (travel_id !== 'novo') {
      fetchData()
    }

    fetchBuses()
  }, [travel_id])

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})

    try {
      let travel_id_created = 0

      if (travel_id !== 'novo') {
        await api.put(`/travels/${travel_id}`, travel, config)
      } else {
        const res = await api.post('/travels', travel, config)
        travel_id_created = res.data.id
      }

      if (file) {
        const data = new FormData()
        data.append("name", travel.description)
        data.append("file", file)
    
        await api.patch(`/travels/image/${travel_id_created}`, data, config)
      }

      setLoadingSave(false)

      if (travel_id !== 'novo') {
        history.push(`/viagens`)
      } else {
        history.push(`/viagens/${travel_id_created}`)
      }
    } catch (error) {
      setLoadingSave(false)
      setError(error.response.data)
    }
  }

  const handleDestroy = async () => {
    setLoadingDestroy(true)

    try {
      await api.delete(`/travels/${travel_id}`, config)
      history.push('/viagens')
    } catch (error) {
      setError(error.response.data)
    }

    setLoadingSave(false)
  }

  const handleAddValues = async () => {
    history.push(`/viagens/${travel_id}/valores/novo`)
  }

  const handleAddDeparturePlaces = async () => {
    history.push(`/viagens/${travel_id}/saidas/novo`)
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h5>Cadastro de viagens</h5>

          <form className="row g-3 mt-1 mb-4">
            <div className='alert text-center alert-primary' role="alert"
                style={message ? { display: 'block'} : { display : 'none' }}>
              {message}
            </div>

            <div className="col-md-12">
              <label htmlFor="description" className="form-label">Descrição</label>
              <input type="text" className={`form-control ${error.description ? 'is-invalid' : ''}`} id="description" maxLength="255" 
                value={travel.description || ''}
                onChange={e => {
                  setTravel({ ...travel,
                    description: e.target.value
                  })
                }}/>

              <div id="validationDescription" 
                className="invalid-feedback" 
                style={error.description ? { display: 'inline' } : { display: 'none' }}>
                {error.description}
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="destination" className="form-label">Destino</label>
              <input type="text" className={`form-control ${error.destination ? 'is-invalid' : ''}`} id="description" maxLength="255" 
                value={travel.destination || ''}
                onChange={e => {
                  setTravel({ ...travel,
                    destination: e.target.value
                  })
                }}/>

              <div id="validationDestination" 
                className="invalid-feedback" 
                style={error.destination ? { display: 'inline' } : { display: 'none' }}>
                {error.destination}
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="bus" className="form-label">Ônibus</label>
              <select className={`form-select ${error.bus_id ? 'is-invalid' : ''}`} id="bus"
                value={travel.bus_id || ''}
                onChange={e => {
                  setTravel({ ...travel,
                    bus_id: e.target.value
                  })
              }}>
                {buses.map(bus => {
                  return (
                    <option key={bus.id} value={bus.id}>{bus.description}</option>
                  )
                })}
              </select>

              <div id="validationBusId" 
                className="invalid-feedback" 
                style={error.bus_id ? { display: 'inline' } : { display: 'none' }}>
                {error.bus_id}
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="controlsSeat">Controla Poltronas?</label>
              <select className={`form-select ${error.controlsSeats ? 'is-invalid' : ''}`} id="controlsSeat"
                value={travel.controlsSeats || ''}
                onChange={e => {
                  setTravel({ ...travel,
                    controlsSeats: e.target.value
                  })
                }}>
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>

              <div id="validationControlsSeats" 
                  className="invalid-feedback" 
                  style={error.controlsSeats ? { display: 'inline' } : { display: 'none' }}>
                  {error.controlsSeats}
              </div>
            </div>

            <div className="col-md-8">
              <label htmlFor="file" className="form-label">Imagem</label>
              <input name="file" type="file"
                    className="form-control file-upload"
                    onChange={e => {
                      const file = e.target.files[0];
                      setFile(file);
                    }} />
            </div>

            <div className="col-md-12">
              <label htmlFor="notes" className="form-label">Observações</label>
              <textarea type="text" className={`form-control ${error.notes ? 'is-invalid' : ''}`} id="description" maxLength="1000" 
                value={travel.notes || ''}
                onChange={e => {
                  setTravel({ ...travel,
                    notes: e.target.value
                  })
                }}>
              </textarea>

              <div id="validationNotes" 
                className="invalid-feedback" 
                style={error.notes ? { display: 'inline' } : { display: 'none' }}>
                {error.notes}
              </div>
            </div>

            <div style={travel_id !== 'novo' ? { display: 'block'} : { display : 'none' }}>
              <div className="col-md-12">
                <label htmlFor="" className="form-label">Valores</label>
                <br />
                <button type="button" 
                        className="btn btn-primary"
                        onClick={handleAddValues}>
                  Adicionar Valor
                </button>
              </div>

              <div className="table-responsive-sm mt-1">
                <table className="table table-sm table-striped table-hover">
                  <thead>
                    <tr key="0">
                      <th scope="col">Idade Ini.</th>
                      <th scope="col">idade Fin.</th>
                      <th scope="col">Valor</th>
                      <th scope="col">Valor Ida</th>
                      <th scope="col">Valor Volta</th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.map(v => {
                      const { id, value, onlyReturnValue, onlyDepartureValue, initialAge, finalAge } = v
                      
                      return (
                        <tr key={id}>
                          <td>{initialAge}</td>
                          <td>{finalAge}</td>
                          <td>{value}</td>
                          <td>{onlyDepartureValue}</td>
                          <td>{onlyReturnValue}</td>
                          <td><Link className="me-2" to={`/viagens/${travel_id}/valores/${id}`}><PencilSquare /></Link></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="col-md-12">
                <label htmlFor="" className="form-label">Pontos de Saída</label>
                <br />
                <button type="button" 
                        className="btn btn-primary"
                        onClick={handleAddDeparturePlaces}>
                  Adicionar Ponto de Saída
                </button>
              </div>
            
              <div className="table-responsive-sm mt-1">
                <table className="table table-sm table-striped table-hover">
                  <thead>
                    <tr key="0">
                      <th scope="col">Endereço</th>
                      <th scope="col">Número</th>
                      <th scope="col">Cidade</th>
                      <th scope="col">Data e Hora de Saída</th>
                      <th scope="col">Data e Hora de Retorno</th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departurePlaces.map(dp => {
                      const { id, homeAddress, addressNumber, city, departureDate, returnDate } = dp
                      
                      return (
                        <tr key={id}>
                          <td>{homeAddress}</td>
                          <td>{addressNumber}</td>
                          <td>{city}</td>
                          <td>{dateTimeBrazil(departureDate)}</td>
                          <td>{dateTimeBrazil(returnDate)}</td>
                          <td><Link className="me-2" to={`/viagens/${travel_id}/saidas/${id}`}><PencilSquare /></Link></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
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
              Salvar
            </button>

            <button type="button" 
                    className="btn btn-primary"
                    onClick={() => history.push(`/reserva/${travel_id}/${Math.ceil(Math.random() * 1000000)}`)}>
              Fazer Reserva
            </button>

            <button type="button" 
                    className="btn btn-primary"
                    onClick={() => history.push(`/viagens/${travel_id}/reservas`)}>
              Lista de Passageiros
            </button>

            <button type="button" 
                    className="btn btn-primary"
                    style={travel_id !== 'novo' ? { display: 'inline-block'} : { display : 'none' }}
                    onClick={handleDestroy}
                    disabled={loadingDestroy}>
              <span className="spinner-border spinner-border-sm mx-1" 
                    role="status" 
                    aria-hidden="true" 
                    style={loadingDestroy ? { display: 'inline-block'} : { display : 'none' }}>
              </span>
              Excluir
            </button>

            <button type="button" 
                    className="btn btn-warning text-white mb-4"
                    onClick={() => {
                      history.push('/viagens')
                    }}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Travel
