import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { errorApi } from '../../config/handleErrors'

function Bus(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDestroy, setLoadingDestroy] = useState(false)
  const [passenger, setPassenger] = useState({})
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  
  let history = useHistory()

  const { id } = props.match.params

  const config = { headers :{
    'x-access-token' : localStorage.getItem('token')
  }}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/reservation/${id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})
        setPassenger(res.data)
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

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})
    
    try {
      /*id !== 'novo' 
        ? await api.put(`/buses/${id}`, bus, config) 
        : await api.post('/buses', bus, config)*/

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
                value={passenger.description || ''}
                onChange={e => {
                  setPassenger({ ...passenger,
                    description: e.target.value
                  })
                }}/>

              <div id="validationName" 
                className="invalid-feedback" 
                style={error.description ? { display: 'inline' } : { display: 'none' }}>
                {error.description}
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
