import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { api, apiCep } from '../../config/api'
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { getUserType, getUserId } from '../../config/security'
import { errorApi } from '../../config/handleErrors'
import InputMask from 'react-input-mask';

function User(props) {
  const [user, setUser] = useState({documentType: 'RG', state: 'AC'})
  const [admin, setAdmin] = useState({infinitePay: false, companyPayment: false, mercadoPago: false})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  let history = useHistory()

  const returnTo = localStorage.getItem('to')

  const id = parseInt(props.match.params.id)

  let adminData = false
  let adminViewUser = false

  if (getUserType() === 'admin') {
    if (parseInt(getUserId()) === id) {
      adminData = true
    } else {
      adminViewUser = true
    }
  }
  
  if (!adminData && !adminViewUser && id && id !== parseInt(getUserId())) {
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

        if (adminData) {
          const res = await api.get('/admin-data/', 
            { headers :{
              'x-access-token' : localStorage.getItem('token')
            }})
          const { data } = res
          setAdmin(data)
        }
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
    if (id) {
      fetchData()
    }
  }, [id, history, adminData])

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

        if (userData.birth) {
          const dateParts = userData.birth.split('/')
          userData.birth = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        }
console.log(userData.birth)
        const config = { headers :{
          'x-access-token' : localStorage.getItem('token'),
        }}

        const res = id ? await api.put(`/users/${id}`, userData, config)
                       : await api.post('/users/', userData)

        const { type, token } = res.data

        if (adminData) {
          await api.put(`/admin-data/${id}`, admin, config)
        }

        finish(type, token)
      }
    } catch (error) {
      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      } else {
        setError(errorHandled.error)
      }

      window.scrollTo({top: 0, behavior: 'smooth'});

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
      <div className="container-fluid mb-4">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h5>{id ? "Dados do usuário" : "Informe seus dados para o cadastro"}</h5>

          <form className="row g-3 mt-1">
            <div className='alert text-center alert-primary' role="alert"
                style={message ? { display: 'block'} : { display : 'none' }}>
              {message}
            </div>

            <div className="col-lg-6">
              <label htmlFor="name" className="form-label">{`Nome ${adminData ? 'da Empresa' : ''}`}</label>
              <input type="text" className={`form-control ${error.userName ? 'is-invalid' : ''}`} id="name" maxLength="255" 
                disabled={adminViewUser}
                value={user.name || ''}
                onChange={e => {
                  setUser({ ...user,
                    name: e.target.value
                  })
                }}/>

              <div id="validationName" 
                className="invalid-feedback" 
                style={error.userName ? { display: 'inline' } : { display: 'none' }}>
                {error.userName}
              </div>
            </div>
            
            <div className="col-lg-3">
              <label htmlFor="cpf" className="form-label">{`CPF ${adminData ? 'do Responsável' : ''}`}</label>
              <input type="text" className={`form-control ${error.cpf ? 'is-invalid' : ''}`} id="cpf" maxLength="11" 
                disabled={adminViewUser}
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
            
            <div className="col-lg-3" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="birth" className="form-label">Nascimento</label>

              <InputMask 
                mask="99/99/9999" 
                className={`form-control ${error.birth ? 'is-invalid' : ''}`} 
                id="birth" 
                disabled={adminViewUser} value={user.birth || ''} 
                onChange={e => {
                  setUser({ ...user,
                    birth: e.target.value
                  })
                }}
              >
                {inputProps => <input {...inputProps} type="tel" />}
              </InputMask>

              <div id="validationBirth" 
                className="invalid-feedback" 
                style={error.birth ? { display: 'inline' } : { display: 'none' }}>
                {error.birth}
              </div>
            </div>
            
            <div className="col-lg-2" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
            <label htmlFor="documentType" className="form-label">Tipo de Documento</label>
              <select className={`form-select ${error.documentType ? 'is-invalid' : ''}`} id="documentType" 
                disabled={adminViewUser}
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
              <label htmlFor="document" className="form-label">{`${adminData ? 'CNPJ' : 'Documento'}`}</label>
              <input type="text" className={`form-control ${error.document ? 'is-invalid' : ''}`} id="document" maxLength="14"
                disabled={adminViewUser}
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
                disabled={adminViewUser}
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
                disabled={adminViewUser}
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

            <div className="col-lg-2" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="cep" className="form-label">CEP</label>
              <input type="text" className={`form-control ${error.cep ? 'is-invalid' : ''}`} id="cep" maxLength="8"
                disabled={adminViewUser}
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

            <div className="col-lg-6" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="homeAddress" className="form-label">Endereço</label>
              <input type="text" className={`form-control ${error.homeAddress ? 'is-invalid' : ''}`} id="homeAddress" maxLength="255"
                disabled={adminViewUser}
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

            <div className="col-lg-1" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="addressNumber" className="form-label">Número</label>
              <input type="text" className={`form-control ${error.addressNumber ? 'is-invalid' : ''}`} id="addressNumber" maxLength="5"
                disabled={adminViewUser}
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

            <div className="col-lg-3" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="complement" className="form-label">Complemento</label>
              <input type="text" className={`form-control ${error.complement ? 'is-invalid' : ''}`} id="complement" maxLength="255"
                disabled={adminViewUser}
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

            <div className="col-lg-6" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="neighborhood" className="form-label">Bairro</label>
              <input type="text" className={`form-control ${error.neighborhood ? 'is-invalid' : ''}`} id="neighborhood" maxLength="255"
                disabled={adminViewUser}
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

            <div className="col-lg-3" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="state" className="form-label">Estado</label>
              <select className={`form-select ${error.state ? 'is-invalid' : ''}`} id="state"
                disabled={adminViewUser}
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

            <div className="col-lg-3" style={adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="city" className="form-label">Cidade</label>
              <input type="text" className={`form-control ${error.city ? 'is-invalid' : ''}`} id="city" maxLength="255"
                disabled={adminViewUser}
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
                disabled={adminViewUser}
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
                disabled={adminViewUser}
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
                disabled={adminViewUser}
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

            <div className="col-lg-3" style={!adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="infinitePay" className="form-label">InfinitePay</label>
              <select className={`form-select ${error.infinitePay ? 'is-invalid' : ''}`} id="infinitePay"
                value={admin.infinitePay.toString() || 'false'}
                onChange={e => {
                  setAdmin({ ...admin,
                    infinitePay: e.target.value === 'true' ? true : false
                  })
                }}>
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>

              <div id="validationInfinitePay" 
                className="invalid-feedback" 
                style={error.infinitePay ? { display: 'inline' } : { display: 'none' }}>
                {error.infinitePay}
              </div>
            </div>

            <div className="col-lg-3" style={!adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="infinitePayUser" className="form-label">Usuário InfinitePay</label>
              <input type="text" className={`form-control ${error.infinitePayUser ? 'is-invalid' : ''}`} id="infinitePayUser" maxLength="255"
                value={admin.infinitePayUser || ''}
                onChange={e => {
                  setAdmin({ ...admin,
                    infinitePayUser: e.target.value
                  })
                }}/>

              <div id="validationInfinitePayUser" 
                className="invalid-feedback" 
                style={error.infinitePayUser ? { display: 'inline' } : { display: 'none' }}>
                {error.infinitePayUser}
              </div>
            </div>

            <div className="col-lg-3" style={!adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="companyPayment" className="form-label">Pagamento Direto</label>
              <select className={`form-select ${error.companyPayment ? 'is-invalid' : ''}`} id="companyPayment"
                value={admin.companyPayment.toString() || 'false'}
                onChange={e => {
                  setAdmin({ ...admin,
                    companyPayment: e.target.value === 'true' ? true : false
                  })
                }}>
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>

              <div id="validationCompanyPayment" 
                className="invalid-feedback" 
                style={error.companyPayment ? { display: 'inline' } : { display: 'none' }}>
                {error.companyPayment}
              </div>
            </div>

            <div className="col-lg-6" style={!adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="companyPaymentLink" className="form-label">Pagamento Direto Link</label>
              <input type="text" className={`form-control ${error.companyPaymentLink ? 'is-invalid' : ''}`} id="companyPaymentLink" maxLength="255"
                value={admin.companyPaymentLink || ''}
                onChange={e => {
                  setAdmin({ ...admin,
                    companyPaymentLink: e.target.value
                  })
                }}/>

              <div id="validationCompanyPaymentLink" 
                className="invalid-feedback" 
                style={error.companyPaymentLink ? { display: 'inline' } : { display: 'none' }}>
                {error.companyPaymentLink}
              </div>
            </div>
            



            <div className="col-lg-3" style={!adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="companyPayment" className="form-label">Mercado Pago</label>
              <select className={`form-select ${error.mercadoPago ? 'is-invalid' : ''}`} id="mercadoPago"
                value={admin.mercadoPago.toString() || 'false'}
                onChange={e => {
                  setAdmin({ ...admin,
                    mercadoPago: e.target.value === 'true' ? true : false
                  })
                }}>
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>

              <div id="validationMercadoPago" 
                className="invalid-feedback" 
                style={error.mercadoPago ? { display: 'inline' } : { display: 'none' }}>
                {error.mercadoPago}
              </div>
            </div>

            <div className="col-lg-6" style={!adminData ? { display: 'none'} : { display : 'inline-block'}}>
              <label htmlFor="mercadoPagoToken" className="form-label">Mercado Pago Token</label>
              <input type="text" className={`form-control ${error.mercadoPagoToken ? 'is-invalid' : ''}`} id="mercadoPagoToken" maxLength="255"
                value={admin.mercadoPagoToken || ''}
                onChange={e => {
                  setAdmin({ ...admin,
                    mercadoPagoToken: e.target.value
                  })
                }}/>

              <div id="validationMercadoPagoToken" 
                className="invalid-feedback" 
                style={error.mercadoPagoToken ? { display: 'inline' } : { display: 'none' }}>
                {error.mercadoPagoToken}
              </div>
            </div>

            <div className="text-center d-grid gap-2">
              <button type="button" 
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={loading}
                      style={adminViewUser ? { display: 'none'} : { display : 'inline-block'}}>
                <span className="spinner-border spinner-border-sm mx-1" 
                      role="status" 
                      aria-hidden="true"
                      style={loading ? { display: 'inline-block'} : { display : 'none' }}>
                </span>
                Confirmar
              </button>
              <button type="button" 
                      className="btn btn-warning text-white"
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
