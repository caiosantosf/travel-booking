import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api, apiCep } from '../../config/api'
import { dateTimeDefault } from '../../config/transformations'

function DeparturePlace(props) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDestroy, setLoadingDestroy] = useState(false)
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  const [departurePlace, setDeparturePlace] = useState([])

  let history = useHistory()

  let { travel_id, id } = props.match.params

  const config = { headers :{
    'x-access-token' : localStorage.getItem('token')
  }}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/travels/${travel_id}/departureplaces/${id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})

        let { data } = res

        data.departureDate = dateTimeDefault(data.departureDate)
        data.returnDate = dateTimeDefault(data.returnDate)

        setDeparturePlace(data)
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
        await api.put(`/travels/${travel_id}/departureplaces/${id}`, departurePlace, config)
      } else {
        await api.post(`/travels/${travel_id}/departureplaces`, departurePlace, config)
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
      await api.delete(`/travels/${travel_id}/departureplaces/${id}`, config)
      history.push(`/viagens/${travel_id}`)
    } catch (error) {
      setError(error.response.data)
    }

    setLoadingSave(false)
  }

  const handleCepApi = async () => {
    try {
      if (!error.cep) {
        const res = await apiCep(departurePlace.cep)
        const { data } = res
        setDeparturePlace({ ...departurePlace,
                            homeAddress: data.logradouro, 
                            complement: data.complement,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf
                          })
      }
    } catch (error) {
      setError({cep: "CEP Inválido!"})
    }
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Sidebar pageType="admin"/>

        <h5>Cadastro de pontos de saída da viagem</h5>

        <form className="row g-3 mt-1 mb-4">
          <div className='alert text-center alert-primary' role="alert"
               style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

          <div className="col-lg-2">
            <label htmlFor="initialAge" className="form-label">CEP</label>
            <input  id="initialAge" type="text" className={`form-control ${error.cep ? 'is-invalid' : ''}`} maxLength="8"
                    value={departurePlace.cep || ''}
                    onChange={e => {
                      const re = /^[0-9\b]+$/
                      const key = e.target.value
          
                      if (key === '' || re.test(key)) {
                        setDeparturePlace({ ...departurePlace, cep: key })
                      }
                    }}
                    onBlur={handleCepApi}/>

            <div id="validationInitialAge" 
                className="invalid-feedback" 
                style={error.cep ? { display: 'inline' } : { display: 'none' }}>
                {error.cep}
            </div>
          </div>

          <div className="col-lg-6" >
            <label htmlFor="homeAddress" className="form-label">Endereço</label>
            <input type="text" className={`form-control ${error.homeAddress ? 'is-invalid' : ''}`} id="homeAddress" maxLength="255"
              value={departurePlace.homeAddress || ''}
              onChange={e => {
                setDeparturePlace({ ...departurePlace,
                  homeAddress: e.target.value
                })
              }}/>

            <div id="validationHomeAddress" 
               className="invalid-feedback" 
               style={error.homeAddress ? { display: 'inline' } : { display: 'none' }}>
               {error.homeAddress}
            </div>
          </div>

          <div className="col-lg-1">
            <label htmlFor="addressNumber" className="form-label">Número</label>
            <input type="text" className={`form-control ${error.addressNumber ? 'is-invalid' : ''}`} id="addressNumber" maxLength="5"
              value={departurePlace.addressNumber || ''}
              onChange={e => {
                const re = /^[0-9\b]+$/
                const key = e.target.value
    
                if (key === '' || re.test(key)) {
                  setDeparturePlace({ ...departurePlace, addressNumber: key })
                }
              }}/>

            <div id="validationNumber" 
               className="invalid-feedback" 
               style={error.addressNumber ? { display: 'inline' } : { display: 'none' }}>
               {error.addressNumber}
            </div>
          </div>

          <div className="col-lg-3">
            <label htmlFor="complement" className="form-label">Complemento</label>
            <input type="text" className={`form-control ${error.complement ? 'is-invalid' : ''}`} id="complement" maxLength="255"
              value={departurePlace.complement || ''}
              onChange={e => {
                setDeparturePlace({ ...departurePlace,
                  complement: e.target.value
                })
              }}/>

            <div id="validationComplement" 
               className="invalid-feedback" 
               style={error.complement ? { display: 'inline' } : { display: 'none' }}>
               {error.complement}
            </div>
          </div>

          <div className="col-lg-6" >
            <label htmlFor="neighborhood" className="form-label">Bairro</label>
            <input type="text" className={`form-control ${error.neighborhood ? 'is-invalid' : ''}`} id="neighborhood" maxLength="255"
              value={departurePlace.neighborhood || ''}
              onChange={e => {
                setDeparturePlace({ ...departurePlace,
                  neighborhood: e.target.value
                })
              }}/>

            <div id="validationNeighborhood" 
               className="invalid-feedback" 
               style={error.neighborhood ? { display: 'inline' } : { display: 'none' }}>
               {error.neighborhood}
            </div>
          </div>

          <div className="col-lg-3">
            <label htmlFor="state" className="form-label">Estado</label>
            <select className={`form-select ${error.state ? 'is-invalid' : ''}`} id="state"
              value={departurePlace.state || ''}
              onChange={e => {
                setDeparturePlace({ ...departurePlace,
                  state: e.target.value
                })
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

            <div id="validationState" 
               className="invalid-feedback" 
               style={error.state ? { display: 'inline' } : { display: 'none' }}>
               {error.state}
            </div>
          </div>

          <div className="col-lg-3">
            <label htmlFor="city" className="form-label">Cidade</label>
            <input type="text" className={`form-control ${error.city ? 'is-invalid' : ''}`} id="city" maxLength="255"
              value={departurePlace.city || ''}
              onChange={e => {
                setDeparturePlace({ ...departurePlace,
                  city: e.target.value
                })
              }}/>

            <div id="validationCity" 
               className="invalid-feedback" 
               style={error.city ? { display: 'inline' } : { display: 'none' }}>
               {error.city}
            </div>
          </div>

          <div className="col-lg-6">
            <label htmlFor="departureDate" className="form-label">Data de Saída</label>
            <input type="datetime-local" className={`form-control ${error.city ? 'is-invalid' : ''}`} id="departureDate"
              value={departurePlace.departureDate || ''}
              onChange={e => {
                setDeparturePlace({ ...departurePlace,
                  departureDate: e.target.value
                })
              }}/>

            <div id="validationCity" 
               className="invalid-feedback" 
               style={error.departureDate ? { display: 'inline' } : { display: 'none' }}>
               {error.departureDate}
            </div>
          </div>

          <div className="col-lg-6">
            <label htmlFor="returnDate" className="form-label">Data de Retorno</label>
            <input type="datetime-local" className={`form-control ${error.returnDate ? 'is-invalid' : ''}`} id="departureDate"
              value={departurePlace.returnDate || ''}
              onChange={e => {
                setDeparturePlace({ ...departurePlace,
                  returnDate: e.target.value
                })
              }}/>

            <div id="validationCity" 
               className="invalid-feedback" 
               style={error.returnDate ? { display: 'inline' } : { display: 'none' }}>
               {error.returnDate}
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

export default DeparturePlace
