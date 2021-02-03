import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'

function Value(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDestroy, setLoadingDestroy] = useState(false)
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  const [value, setValue] = useState([])

  let history = useHistory()

  let { travel_id, id } = props.match.params

  const config = { headers :{
    'x-access-token' : localStorage.getItem('token')
  }}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/travels/${travel_id}/values/${id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})

        const { data } = res

        setValue(data)
      } catch (error) {
        setMessage(error.response.data.message)
      }
    }

    if (id !== 'novo') {
      fetchData()
    }
  }, [travel_id, id])

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})

    try {
      if (id !== 'novo') {
        await api.put(`/travels/${travel_id}/values/${id}`, value, config)
      } else {
        await api.post(`/travels/${travel_id}/values`, value, config)
      }

      history.push(`/viagens/${travel_id}`)
    } catch (error) {
      setLoadingSave(false)
      setError(error.response.data)
    }
  }

  const handleDestroy = async () => {
    setLoadingDestroy(true)

    try {
      await api.delete(`/travels/${travel_id}/values/${id}`, config)
      history.push(`/viagens/${travel_id}`)
    } catch (error) {
      setError(error.response.data)
    }

    setLoadingSave(false)
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Sidebar pageType="admin"/>

        <h5>Cadastro de valores da viagem</h5>

        <form className="row g-3 mt-1 mb-4">
          <div className='alert text-center alert-primary' role="alert"
               style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

          <div className="col-md-3">
            <label htmlFor="initialAge" className='form-label'>Idade Inicial</label>
            <input  id="initialAge" type="number" className={`form-control ${error.initialAge ? 'is-invalid' : ''}`}
                    value={value.initialAge || ''}
                    onChange={e => {
                      setValue({ ...value,
                        initialAge: e.target.value
                      })
                    }}/>

            <div id="validationInitialAge" 
                className="invalid-feedback" 
                style={error.initialAge ? { display: 'inline' } : { display: 'none' }}>
                {error.initialAge}
            </div>
          </div>

          <div className="col-md-3">
            <label htmlFor="finalAge" className='form-label'>Idade Final</label>
            <input  id="finalAge" type="number" className={`form-control ${error.finalAge ? 'is-invalid' : ''}`}
                    value={value.finalAge || ''}
                    onChange={e => {
                      setValue({ ...value,
                        finalAge: e.target.value
                      })
                    }}/>

            <div id="validationFinalAge" 
                className="invalid-feedback" 
                style={error.finalAge ? { display: 'inline' } : { display: 'none' }}>
                {error.finalAge}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="value" className='form-label'>Valor</label>
            <input  id="value" type="number" className={`form-control ${error.finalAge ? 'is-invalid' : ''}`}
                    value={value.value || ''}
                    onChange={e => {
                      setValue({ ...value,
                        value: e.target.value
                      })
                    }}/>

            <div id="validationValue" 
                className="invalid-feedback" 
                style={error.value ? { display: 'inline' } : { display: 'none' }}>
                {error.value}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="onlyDepartureValue" className='form-label'>Valor Ida</label>
            <input  id="onlyDepartureValue" type="number" className={`form-control ${error.finalAge ? 'is-invalid' : ''}`}
                    value={value.onlyDepartureValue || ''}
                    onChange={e => {
                      setValue({ ...value,
                        onlyDepartureValue: e.target.value
                      })
                    }}/>

            <div id="validationOnlyDepartureValue" 
                className="invalid-feedback" 
                style={error.onlyDepartureValue ? { display: 'inline' } : { display: 'none' }}>
                {error.onlyDepartureValue}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="onlyReturnValue" className='form-label'>Valor Retorno</label>
            <input  id="onlyReturnValue" type="number" className={`form-control ${error.finalAge ? 'is-invalid' : ''}`}
                    value={value.onlyReturnValue || ''}
                    onChange={e => {
                      setValue({ ...value,
                        onlyReturnValue: e.target.value
                      })
                    }}/>

            <div id="validationOnlyReturnValue" 
                className="invalid-feedback" 
                style={error.onlyReturnValue ? { display: 'inline' } : { display: 'none' }}>
                {error.onlyReturnValue}
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
                    history.push(`/viagens/${travel_id}`)
                  }}>
            Voltar
          </button>
        </div>
      </div>
      </div>
    </React.Fragment>
  )
}

export default Value
