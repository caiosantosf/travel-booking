import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { errorApi } from '../../config/handleErrors'

function Payment(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDestroy, setLoadingDestroy] = useState(false)
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  const [payment, setPayment] = useState('')
  const [originalStatus, setOriginalStatus] = useState('')

  let history = useHistory()

  const { id } = props.match.params
  const { name } = props.location.state

  const config = { headers :{
    'x-access-token' : localStorage.getItem('token')
  }}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/reservations/${id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})

        let data = res.data

        const status = data.status === '1' ? '1' :
                       data.status === '2' ? '2' :
                       data.status === '3' ? '1' :
                       data.status === '4' ? '2' :
                       data.status === '5' ? '1' :
                       data.status === '6' ? '2' : data.status

        data.status = status

        setPayment(data)
        setOriginalStatus(res.data.status)
        console.log(res.data)
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
      fetchData()
  }, [id, history])

  const handleDestroy = async () => {
    setLoadingDestroy(true)

    try {
      await api.put(`/reservations/${id}`, {active: false}, config)
      props.history.goBack()
    } catch (error) {
      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      } else {
        setError(errorHandled.error)
      }
    }

    setLoadingDestroy(false)
  }

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})

    const status = payment.status === '1' && originalStatus === '1' ? '1' :
                   payment.status === '1' && originalStatus === '2' ? '1' :
                   payment.status === '1' && originalStatus === '3' ? '3' :
                   payment.status === '1' && originalStatus === '4' ? '3' :
                   payment.status === '1' && originalStatus === '5' ? '5' :
                   payment.status === '1' && originalStatus === '6' ? '5' :
                   payment.status === '2' && originalStatus === '1' ? '2' :
                   payment.status === '2' && originalStatus === '2' ? '2' :
                   payment.status === '2' && originalStatus === '3' ? '4' :
                   payment.status === '2' && originalStatus === '4' ? '4' :
                   payment.status === '2' && originalStatus === '5' ? '6' :
                   payment.status === '2' && originalStatus === '6' ? '6' : ''
    
    try {
      await api.put(`/reservations/${id}`, {status}, config) 
      props.history.goBack()
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

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h5>Alteração do Status de Pagamento</h5>

          <div className='alert text-center alert-danger' role="alert"
                style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

          <h6>{name}</h6>

          <form className={`row g-3 mt-1 mb-4`} style={['1', '2', '3', '4', '5', '6'].includes(originalStatus) ? { display: 'block'} : { display : 'none' }}>
            <div className="col-lg-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select className={`form-select ${error.status ? 'is-invalid' : ''}`} id="status"
                value={payment.status || ''}
                onChange={e => {
                  setPayment({ ...payment,
                    status: e.target.value
                  })
                }}>
                <option value={'1'}>Esperando</option>
                <option value={'2'}>Recebido</option>
              </select>

              <div id="validationStatus" 
                className="invalid-feedback" 
                style={error.status ? { display: 'inline' } : { display: 'none' }}>
                {error.status}
              </div>
            </div>
          </form>

          <div className={`text-center d-grid gap-2`}>
            <button type="button" 
                    className={`btn btn-primary`}
                    onClick={handleSave}
                    disabled={loadingSave}
                    style={['1', '2', '3', '4', '5', '6'].includes(originalStatus) ? { display: 'block'} : { display : 'none' }}>
              <span className="spinner-border spinner-border-sm mx-1" 
                    role="status" 
                    aria-hidden="true" 
                    style={loadingSave ? { display: 'inline-block'} : { display : 'none' }}>
              </span>
              Salvar
            </button>

            <button type="button" 
                    className="btn btn-primary"
                    onClick={handleDestroy}
                    disabled={loadingSave}>
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
                      props.history.goBack()
                    }}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Payment
