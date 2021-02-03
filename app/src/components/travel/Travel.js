import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { dateTimeDefault } from '../../config/transformations'

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

  let { id } = props.match.params

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
        let { data } = res.data
        setBuses(data)

        if (id === 'novo') {
          setTravel({bus_id: data[0].id})
        }
      } catch (error) {
        setMessage(error.response.data.message)
      }
    }

    if (id !== 'novo') {
      fetchData()
    }
    fetchBuses()
  }, [id])

  const handleSave = async () => {
    setLoadingSave(true)
    setError({})

    try {
      if (id !== 'novo') {
        await api.put(`/travels/${id}`, travel, config)
      } else {
        const res = await api.post('/travels', travel, config)
        id = res.data.id
      }

      if (file) {
        const data = new FormData()
        data.append("name", travel.description)
        data.append("file", file)
    
        await api.patch(`/travels/image/${id}`, data, config)
      }

      history.push('/viagens')
    } catch (error) {
      setLoadingSave(false)
      setError(error.response.data)
    }
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

  const handleAddValue = async () => {
    setValues([...values, {
			value: 0,
			onlyReturnValue: 0,
			onlyDepartureValue: 0,
			initialAge: 0,
			finalAge: 0
		}])
  }

  const handleAddDeparturePlace = async () => {
    setDeparturePlaces([...departurePlaces, {
			cep: '',
			homeAddress: '',
			addressNumber: 0,
			complement: '',
      neighborhood: '',
      city: '',
      state: '',
      departureDate: null,
      returnDate: null
		}])
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
            <select className={`form-select ${error.state ? 'is-invalid' : ''}`} id="state"
              value={travel.controlsSeats || ''}
              onChange={e => {
                setTravel({ ...travel,
                  controlsSeats: e.target.value
                })
              }}>
              <option value={true}>Sim</option>
              <option value={false}>Não</option>
            </select>
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
              style={error.text ? { display: 'inline' } : { display: 'none' }}>
              {error.text}
            </div>
          </div>

          <div className="col-md-2">
            <label htmlFor="" className="form-label">Valores</label>
            <br />
            <button type="button" 
                    className="btn btn-primary"
                    onClick={handleAddValue}>
              Adicionar Valor
            </button>
          </div>

          <div className="col-md-2">
            <label htmlFor="installments" className="form-label">Parcelas</label>
            <input type="number" className={`form-control ${error.value ? 'is-invalid' : ''}`} id="description" maxLength="2" 
              value={travel.installments || ''}
              onChange={e => {
                setTravel({ ...travel,
                  installments: e.target.value
                })
              }}/>

            <div id="validationInstallments" 
              className="invalid-feedback" 
              style={error.installments ? { display: 'inline' } : { display: 'none' }}>
              {error.installments}
            </div>
          </div>

          <div className="col-md-12">
            {values.map((value, j) => {
              return (
                <div className="row g-3 mb-4">
                  <div key={j} className="col-md-2">
                    <label htmlFor="initialAge" className="form-label">Idade Ini.</label>
                    <input  id="initialAge" type="number" className='form-control' 
                            value={values[j].initialAge || ''}
                            onChange={e => {
                              const valuesAux = values.slice()
                              valuesAux[j].initialAge = e.target.value
                              setValues(valuesAux)
                            }}/>
                  </div>

                  <div key={j} className="col-md-2">
                    <label htmlFor="finalAge" className="form-label">Idade Fin.</label>
                    <input  id="finalAge" type="number" className='form-control' 
                            value={values[j].finalAge || ''}
                            onChange={e => {
                              const valuesAux = values.slice()
                              valuesAux[j].finalAge = e.target.value
                              setValues(valuesAux)
                            }}/>
                  </div>

                  <div key={j} className="col-md-2">
                    <label htmlFor="value" className="form-label">Valor</label>
                    <input  id="value" type="number" className='form-control' 
                            value={values[j].value || ''}
                            onChange={e => {
                              const valuesAux = values.slice()
                              valuesAux[j].value = e.target.value
                              setValues(valuesAux)
                            }}/>
                  </div>

                  <div key={j} className="col-md-2">
                    <label htmlFor="onlyDepartureValue" className="form-label">Valor Ida</label>
                    <input  id="onlyDepartureValue" type="number" className='form-control' 
                            value={values[j].onlyDepartureValue || ''}
                            onChange={e => {
                              const valuesAux = values.slice()
                              valuesAux[j].onlyDepartureValue = e.target.value
                              setValues(valuesAux)
                            }}/>
                  </div>

                  <div key={j} className="col-md-2">
                    <label htmlFor="onlyReturnValue" className="form-label">Valor Volta</label>
                    <input  id="onlyReturnValue" type="number" className='form-control' 
                            value={values[j].onlyReturnValue || ''}
                            onChange={e => {
                              const valuesAux = values.slice()
                              valuesAux[j].onlyReturnValue = e.target.value
                              setValues(valuesAux)
                            }}/>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="col-md-6">
            <label htmlFor="" className="form-label">Pontos de Saída</label>
            <br />
            <button type="button" 
                    className="btn btn-primary"
                    onClick={handleAddDeparturePlace}>
              Adicionar Ponto de Saída
            </button>
          </div>

          <div className="col-md-12">
            {departurePlaces.map((dp, j) => {
              return (
                <div className="row g-3 mb-4">
                  <div key={j} className="col-lg-2">
                    <label htmlFor="cep" className="form-label">CEP</label>
                    <input  id="cep" type="text" className='form-control' maxLength="8"
                            value={departurePlaces[j].cep || ''}
                            onChange={e => {
                              const re = /^[0-9\b]+$/
                              const key = e.target.value
                  
                              if (key === '' || re.test(key)) {
                                const departurePlacesAux = departurePlaces.slice()
                                departurePlacesAux[j].cep = e.target.value
                                setValues(departurePlacesAux)
                              }
                            }}/>
                  </div>

                  <div key={j} className="col-lg-4">
                    <label htmlFor="homeAddress" className="form-label">Endereço</label>
                    <input  id="homeAddress" type="text" className='form-control' maxLength="255"
                            value={departurePlaces[j].homeAddress || ''}
                            onChange={e => {
                              const departurePlacesAux = departurePlaces.slice()
                              departurePlacesAux[j].homeAddress = e.target.value
                              setValues(departurePlacesAux)
                            }}/>
                  </div>

                  <div key={j} className="col-lg-1">
                    <label htmlFor="addressNumber" className="form-label">Número</label>
                    <input  id="addressNumber" type="number" className='form-control'
                            value={departurePlaces[j].addressNumber || ''}
                            onChange={e => {
                              const departurePlacesAux = departurePlaces.slice()
                              departurePlacesAux[j].addressNumber = e.target.value
                              setValues(departurePlacesAux)
                            }}/>
                  </div>

                  <div key={j} className="col-lg-3">
                    <label htmlFor="complement" className="form-label">Complemento</label>
                    <input  id="complement" type="text" className='form-control' maxLength="255"
                            value={departurePlaces[j].complement || ''}
                            onChange={e => {
                              const departurePlacesAux = departurePlaces.slice()
                              departurePlacesAux[j].complement = e.target.value
                              setValues(departurePlacesAux)
                            }}/>
                  </div>

                  <div key={j} className="col-lg-2">
                    <label htmlFor="neighborhood" className="form-label">Bairro</label>
                    <input  id="neighborhood" type="text" className='form-control' maxLength="255"
                            value={departurePlaces[j].neighborhood || ''}
                            onChange={e => {
                              const departurePlacesAux = departurePlaces.slice()
                              departurePlacesAux[j].neighborhood = e.target.value
                              setValues(departurePlacesAux)
                            }}/>
                  </div>

                  <div className="col-lg-2">
                    <label htmlFor="state" className="form-label">Estado</label>
                    <select className='form-select' id="state" type="text" maxLength="255"
                      value={departurePlaces[j].state || ''}
                      onChange={e => {
                        const departurePlacesAux = departurePlaces.slice()
                        departurePlacesAux[j].state = e.target.value
                        setValues(departurePlacesAux)
                      }}>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>

                  <div className="col-lg-2">
                    <label htmlFor="city" className="form-label">Cidade</label>
                    <input type="text" className='form-control' id="city" maxLength="255"
                      value={departurePlaces[j].city || ''}
                      onChange={e => {
                        const departurePlacesAux = departurePlaces.slice()
                        departurePlacesAux[j].city = e.target.value
                        setValues(departurePlacesAux)
                      }}/>

                  </div>
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
