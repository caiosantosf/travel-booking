import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { dateTimeDefault } from '../../config/transformations'

function Travel(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDestroy, setLoadingDestroy] = useState(false)
  const [travel, setTravel] = useState({description: '', layout: {seats: []}})
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
        const res = await api.get(`/travels/${id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})
        let { data } = res
        data.departure = dateTimeDefault(data.departure)
        setTravel(res.data)
      } catch (error) {
        console.log(error)
        setMessage(error.response.data.message)
      }
    }
    if (id !== 'novo') {
      fetchData()
    }
  }, [id])

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})
    
    try {
      id !== 'novo' 
        ? await api.put(`/travels/${id}`, travel, config) 
        : await api.post('/travels', travel, config)

      history.push('/viagens')
    } catch (error) {
      setError(error.response.data)
    }

    setLoadingSave(false)
  }

  const handleDestroy = async () => {
    setLoadingDestroy(true)

    try {
      await api.delete(`/travels/${id}`, config)
      history.push('/viagens')
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
            <label htmlFor="departure" className="form-label">Data de Saída</label>
            <input type="datetime-local" className={`form-control ${error.departure ? 'is-invalid' : ''}`} id="departure" 
              value={travel.departure || ''}
              onChange={e => {
                setTravel({ ...travel,
                  departure: e.target.value
                })
              }}/>

            <div id="validationDeparture" 
               className="invalid-feedback" 
               style={error.departure ? { display: 'inline' } : { display: 'none' }}>
               {error.departure}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="days" className="form-label">Dias</label>
            <input type="number" className={`form-control ${error.days ? 'is-invalid' : ''}`} id="days" maxLength="2" 
              value={travel.days || ''}
              onChange={e => {
                setTravel({ ...travel,
                  days: e.target.value
                })
              }}/>

            <div id="validationDays" 
              className="invalid-feedback" 
              style={error.days ? { display: 'inline' } : { display: 'none' }}>
              {error.days}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="destination" className="form-label">Valor</label>
            <input type="number" className={`form-control ${error.value ? 'is-invalid' : ''}`} id="description" maxLength="2" 
              value={travel.value || ''}
              onChange={e => {
                setTravel({ ...travel,
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
            <label htmlFor="departurePlace" className="form-label">Local de Saída</label>
            <input type="text" className={`form-control ${error.value ? 'is-invalid' : ''}`} id="departurePlace" maxLength="2" 
              value={travel.departurePlace || ''}
              onChange={e => {
                setTravel({ ...travel,
                  departurePlace: e.target.value
                })
              }}/>

            <div id="validationDeparturePlace" 
              className="invalid-feedback" 
              style={error.departurePlace ? { display: 'inline' } : { display: 'none' }}>
              {error.departurePlace}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="file" className="form-label">Imagem</label>
            <input name="file" type="file"
                   className="form-control file-upload" data-cloudinary-field="image_id"
                   data-form-data="{ 'transformation': {'crop':'limit','tags':'samples','width':3000,'height':2000}}"/>
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
