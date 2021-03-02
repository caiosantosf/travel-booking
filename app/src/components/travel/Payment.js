import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { errorApi } from '../../config/handleErrors'

function Payment(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  const [payment, setPayment] = useState('')

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
        setPayment(res.data)
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

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})
    
    try {
      await api.put(`/reservations/${id}`, {status: payment.status}, config) 
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

          <form className="row g-3 mt-1 mb-4">
            <div className='alert text-center alert-danger' role="alert"
                 style={message ? { display: 'block'} : { display : 'none' }}>
              {message}
            </div>

            <h6>{name}</h6>

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
