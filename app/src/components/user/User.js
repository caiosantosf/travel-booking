import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { api, apiCep } from '../../config/api'
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { getUserType, getUserId } from '../../config/security'

function User(props) {
  const [user, setUser] = useState({documentType: 'RG', state: 'AC'})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  let history = useHistory()

  const returnTo = localStorage.getItem('to')

  const id = parseInt(props.match.params.id)
  const admin = getUserType() === 'admin' ? true : false

  if ( (!admin) && (id) && (id !== getUserId()) ) {
    history.push('/acesso-negado')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/users/${id}`, 
          { headers :{
            'x-access-token' : localStorage.getItem('token')
          }})
        const { data } = res
        data.birth = data.birth.substr(0, 10)
        delete data.password
        setUser(data)
      } catch (error) {
        setMessage(error.response.data.message)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id])

  const handleSave = async () => {
    try {
      setLoading(true)
      setError({})

      if ( ((user.password !== user.passwordConfirmation) && (!id)) || 
           ((user.newPassword !== user.passwordConfirmation) && (id)) ) {

        setError({passwordConfirmation: "Confirmação de Senha está diferente da Senha"})
        setLoading(false)
      } else {
        const { passwordConfirmation, id, ...userData} = user

        const res = id ? await api.put(`/users/${id}`, userData, 
                                { headers :{
                                  'x-access-token' : localStorage.getItem('token')
                                }})
                       : await api.post('/users/', userData)

        const { type, token } = res.data

        finish(type, token)
      }
    } catch (err) {
      setMessage(err.response.data.message)
      setError(err.response.data)
      setLoading(false)
    }
  }

  const handleCepApi = async () => {
    try {
      const res = await apiCep(user.cep)
      const { data } = res
      if (!data.erro) {
        setUser({ ...user,
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

  const finish = (type, token) => {
    if (token) {
      localStorage.setItem('token', token)
    }

    setLoading(false)

    if (returnTo) {
      history.push(returnTo)
      localStorage.setItem('to', '')
    } else {
      if (type === 'admin') {
        history.push('/admin-inicial')
      } else {
        history.push('/')
      }
    }
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <Sidebar />

          <h5>{id ? "Dados do usuário" : "Informe seus dados para o cadastro"}</h5>

          <form className="row g-3 mt-1 mb-4">
            <div className='alert text-center alert-primary' role="alert"
                style={message ? { display: 'block'} : { display : 'none' }}>
              {message}
            </div>

            <div className="col-lg-6">
              <label htmlFor="name" className="form-label">Nome</label>
              <input type="text" className={`form-control ${error.name ? 'is-invalid' : ''}`} id="name" maxLength="255" 
                disabled={admin}
                value={user.name || ''}
                onChange={e => {
                  setUser({ ...user,
                    name: e.target.value
                  })
                }}/>

              <div id="validationName" 
                className="invalid-feedback" 
                style={error.name ? { display: 'inline' } : { display: 'none' }}>
                {error.name}
              </div>
            </div>
            <div className="col-lg-3">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input type="text" className={`form-control ${error.name ? 'is-invalid' : ''}`} id="cpf" maxLength="11" 
                disabled={admin}
                value={user.cpf || ''}
                onChange={e => {
                  const re = /^[0-9\b]+$/
                  const key = e.target.value
      
                  if (key === '' || re.test(key)) {
                    setUser({ ...user, cpf: key })
                  }
                }}/>

              <div id="validationCpf" 
                className="invalid-feedback" 
                style={error.cpf ? { display: 'inline' } : { display: 'none' }}>
                {error.cpf}
              </div>
            </div>
            <div className="col-lg-3">
              <label htmlFor="birth" className="form-label">Nascimento</label>
              <input type="date" className={`form-control ${error.birth ? 'is-invalid' : ''}`} id="birth" 
                disabled={admin}
                value={user.birth || ''}
                onChange={e => {
                  setUser({ ...user,
                    birth: e.target.value
                  })
                }}/>

              <div id="validationBirth" 
                className="invalid-feedback" 
                style={error.birth ? { display: 'inline' } : { display: 'none' }}>
                {error.birth}
              </div>
            </div>
            <div className="col-lg-2">
            <label htmlFor="documentType" className="form-label">Tipo de Documento</label>
              <select className={`form-select ${error.documentType ? 'is-invalid' : ''}`} id="documentType" 
                disabled={admin}
                value={user.documentType || ''}
                onChange={e => {
                    setUser({ ...user,
                      documentType: e.target.value
                    })
                  }}>
                <option value="RG">RG</option>
                <option value="CNH">CNH</option>
              </select>
              <div id="validationDocumentType" 
                className="invalid-feedback" 
                style={error.documentType ? { display: 'inline' } : { display: 'none' }}>
                {error.documentType}
              </div>
            </div>
            <div className="col-lg-3">
              <label htmlFor="document" className="form-label">Documento</label>
              <input type="text" className={`form-control ${error.document ? 'is-invalid' : ''}`} id="document" maxLength="14"
                disabled={admin}
                value={user.document || ''}
                onChange={e => {
                  setUser({ ...user,
                    document: e.target.value
                  })
                }}/>

              <div id="validationDocument" 
                className="invalid-feedback" 
                style={error.document ? { display: 'inline' } : { display: 'none' }}>
                {error.document}
              </div>
            </div>
            <div className="col-lg-3">
              <label htmlFor="phone" className="form-label">Celular (WhatsApp)</label>
              <input type="text" className={`form-control ${error.phone ? 'is-invalid' : ''}`} id="phone" maxLength="11"
                disabled={admin}
                value={user.phone || ''}
                onChange={e => {
                  const re = /^[0-9\b]+$/
                  const key = e.target.value
      
                  if (key === '' || re.test(key)) {
                    setUser({ ...user, phone: key })
                  }
                }}/>

              <div id="validationPhone" 
                className="invalid-feedback" 
                style={error.phone ? { display: 'inline' } : { display: 'none' }}>
                {error.phone}
              </div>
            </div>
            <div className="col-lg-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className={`form-control ${error.email ? 'is-invalid' : ''}`} id="email" maxLength="255" 
                disabled={admin}
                value={user.email || ''}
                onChange={e => {
                  setUser({ ...user,
                    email: e.target.value
                  })
                }}/>

              <div id="validationEmail" 
                className="invalid-feedback" 
                style={error.email ? { display: 'inline' } : { display: 'none' }}>
                {error.email}
              </div>
            </div>

            <div className="col-lg-2">
              <label htmlFor="cep" className="form-label">CEP</label>
              <input type="text" className={`form-control ${error.cep ? 'is-invalid' : ''}`} id="cep" maxLength="8"
                disabled={admin}
                value={user.cep || ''}
                onChange={e => {
                  const re = /^[0-9\b]+$/
                  const key = e.target.value
      
                  if (key === '' || re.test(key)) {
                    setUser({ ...user, cep: key })
                  }
                }}
                onBlur={handleCepApi}/>

              <div id="validationCep" 
                className="invalid-feedback" 
                style={error.cep ? { display: 'inline' } : { display: 'none' }}>
                {error.cep}
              </div>
            </div>

            <div className="col-lg-6" >
              <label htmlFor="homeAddress" className="form-label">Endereço</label>
              <input type="text" className={`form-control ${error.homeAddress ? 'is-invalid' : ''}`} id="homeAddress" maxLength="255"
                disabled={admin}
                value={user.homeAddress || ''}
                onChange={e => {
                  setUser({ ...user,
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
                disabled={admin}
                value={user.addressNumber || ''}
                onChange={e => {
                  const re = /^[0-9\b]+$/
                  const key = e.target.value
      
                  if (key === '' || re.test(key)) {
                    setUser({ ...user, addressNumber: key })
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
                disabled={admin}
                value={user.complement || ''}
                onChange={e => {
                  setUser({ ...user,
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
                disabled={admin}
                value={user.neighborhood || ''}
                onChange={e => {
                  setUser({ ...user,
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
                disabled={admin}
                value={user.state || ''}
                onChange={e => {
                  setUser({ ...user,
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
                disabled={admin}
                value={user.city || ''}
                onChange={e => {
                  setUser({ ...user,
                    city: e.target.value
                  })
                }}/>

              <div id="validationCity" 
                className="invalid-feedback" 
                style={error.city ? { display: 'inline' } : { display: 'none' }}>
                {error.city}
              </div>
            </div>

            <div className="col-lg-4">
              <label htmlFor="password" className="form-label">{`Senha ${id ? 'Atual' : ''}`}</label>
              <input type="password" className={`form-control ${error.password ? 'is-invalid' : ''}`} id="password"
                disabled={admin}
                value={user.password || ''}
                onChange={e => {
                  setUser({ ...user,
                    password: e.target.value
                  })
                }}/>

              <div id="validationPassword" 
                className="invalid-feedback" 
                style={error.password ? { display: 'inline' } : { display: 'none' }}>
                {error.password}
              </div>
            </div>

            <div className="col-lg-4" style={id ? { display: 'inline-block'} : { display : 'none'}}>
              <label htmlFor="newPassword" className="form-label">Nova Senha</label>
              <input type="password" className={`form-control ${error.newPassword ? 'is-invalid' : ''}`} id="newPassword"
                disabled={admin}
                value={user.newPassword || ''}
                onChange={e => {
                  setUser({ ...user,
                    newPassword: e.target.value
                  })
                }}/>

              <div id="validationNewPassword" 
                className="invalid-feedback" 
                style={error.newPassword ? { display: 'inline' } : { display: 'none' }}>
                {error.newPassword}
              </div>
            </div>

            <div className="col-lg-4">
              <label htmlFor="passwordConfirmation" className="form-label">Confirme a Senha</label>
              <input type="password" className={`form-control ${error.passwordConfirmation ? 'is-invalid' : ''}`} id="passwordConfirmation" 
                disabled={admin}
                value={user.passwordConfirmation || ''}
                onChange={e => {
                  setUser({ ...user,
                    passwordConfirmation: e.target.value
                  })
                }}/>

              <div id="validationPasswordConfirmation" 
                className="invalid-feedback" 
                style={error.passwordConfirmation ? { display: 'inline' } : { display: 'none' }}>
                {error.passwordConfirmation}
              </div>
            </div>

            <div className="text-center d-grid gap-2">
              <button type="button" 
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={loading}
                      style={admin ? { display: 'none'} : { display : 'inline-block'}}>
                <span className="spinner-border spinner-border-sm mx-1" 
                      role="status" 
                      aria-hidden="true"
                      style={false ? { display: 'inline-block'} : { display : 'none' }}>
                </span>
                Confirmar
              </button>
              <button type="button" 
                      className="btn btn-warning text-white mb-4"
                      onClick={() => {
                        props.history.goBack()
                      }}>
                Voltar
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
}

export default User
