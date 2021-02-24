import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { errorApi } from '../../config/handleErrors'

function Bus(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDestroy, setLoadingDestroy] = useState(false)
  const [bus, setBus] = useState({description: '', layout: {seats: []}})
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  const [seats, setSeats] = useState(4)

  let history = useHistory()

  const { id } = props.match.params

  const config = { headers :{
    'x-access-token' : localStorage.getItem('token')
  }}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/buses/${id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})
        setBus(res.data)
        setSeats(res.data.layout.seats.length)
      } catch (error) {
        const errorHandled = errorApi(error)
        if (errorHandled.forbidden) {
          history.push('/')
        } else {
          if (errorHandled.general) {
            setMessage(errorHandled.error)
          }
        }
      }
    }
    if (id !== 'novo') {
      fetchData()
    }
  }, [id, history])

  const handleAddSeat = async () => {
    setSeats(seats + 1)

    let seatsAux = bus.layout.seats
    seatsAux.push(0)

    setBus({ ...bus,
      layout: {seats: seatsAux}
    })
  }

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})
    
    try {
      id !== 'novo' 
        ? await api.put(`/buses/${id}`, bus, config) 
        : await api.post('/buses', bus, config)

      history.push('/onibus')
    } catch (error) {
      setLoadingSave(false)

      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      } else {
        setError(errorHandled.error)
      }
    }    
  }

  const handleDestroy = async () => {
    setLoadingDestroy(true)
    
    try {
      await api.delete(`/buses/${id}`, config)
      history.push('/onibus')
    } catch (error) {
      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      } else {
        setError(errorHandled.error)
      }
    }

    setLoadingSave(false)
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h5>Cadastro de ônibus</h5>

          <form className="row g-3 mt-1 mb-4">
            <div className='alert text-center alert-danger' role="alert"
                 style={message ? { display: 'block'} : { display : 'none' }}>
              {message}
            </div>

            <div className="col-md-12">
              <label htmlFor="description" className="form-label">Descrição</label>
              <input type="text" className={`form-control ${error.description ? 'is-invalid' : ''}`} id="description" maxLength="255" 
                value={bus.description || ''}
                onChange={e => {
                  setBus({ ...bus,
                    description: e.target.value
                  })
                }}/>

              <div id="validationName" 
                className="invalid-feedback" 
                style={error.description ? { display: 'inline' } : { display: 'none' }}>
                {error.description}
              </div>
            </div>

            <div className="col-md-2">
              <label htmlFor="layout" className="form-label">Layout</label>
              <br />
              <button type="button" 
                      className="btn btn-primary"
                      onClick={handleAddSeat}>
                Adicionar Poltrona
              </button>
            </div>

            <div className="col-lg-6 col-xl-4">
              <div className="row">
              <label htmlFor="layout" className="form-label">Informe o número das poltronas</label>
                {Array.from({length: seats}, (i, j) => {
                  return (
                    <div key={j} className="col-3 mb-1">
                      <input type="number" className='form-control' maxLength='2'
                              value={bus.layout.seats[j] || ''}
                              onChange={e => {
                                let seatsAux = bus.layout.seats
                                seatsAux[j] = parseInt(e.target.value)
                                setBus({ ...bus,
                                  layout: {seats: seatsAux}
                                })
                              }}/>
                    </div>
                  )
                })}
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
                    style={id !== 'novo' ? { display: 'inline-block'} : { display : 'none' }}
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
                      history.push('/onibus')
                    }}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Bus
