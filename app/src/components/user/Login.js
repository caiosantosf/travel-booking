import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import { api } from '../../config/api'
import logo from '../../assets/logo.webp'
import { getUserType } from '../../config/security'
import { errorApi } from '../../config/handleErrors'

function Login(props) {
  const [auth, setAuth] = useState({})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const admin = props.match.url === '/admin' ? true : false
  const exit = props.match.url === '/sair' ? true : false
  const token = localStorage.getItem('token')
  const returnTo = localStorage.getItem('to')
    
  let history = useHistory()

  useEffect(() => {
    if (exit) {
      localStorage.removeItem('token')  
      history.push('/')
    }
  }, [exit, history])

  useEffect(() => {
    if (token) {
      if (returnTo) {
        localStorage.setItem('to', '')
        history.push(returnTo)
      } else {
        const type = getUserType()

        if (type === 'admin') {
          history.push('/admin-inicial')
        } else {
          if (type === 'regular') {
            history.push('/')
          }
        }
      }
    }
  }, [token, history, returnTo])

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError({})
      const res = await api.post(`/users/login/${admin ? 'admin' : ''}`, auth)
      const { token, companyName, companyPhone } = res.data
      finishLogin(token, companyName, companyPhone)
    } catch (error) {
      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      } else {
        setError(errorHandled.error)
      }

      setLoading(false)
    }
  }

  const finishLogin = (token, companyName, companyPhone) => {
    localStorage.setItem('token', token)
    localStorage.setItem('companyName', companyName)
    localStorage.setItem('companyPhone', companyPhone)
    setLoading(false)
  }

  return (
    <div className="container container-login">
      <form>
        <div className="text-center mb-3">
          <img className="mb-3 img-login" src={ logo } alt="Logo" />
          <h5>Sistema de reserva</h5>
        </div>

        <div className="mb-2">

          <div className='alert text-center alert-danger' role="alert"
               style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

          <label htmlFor="cpf" className="form-label">CPF</label>

          <input type="text" 
                 className={`form-control ${error.cpf ? 'is-invalid' : ''}`}
                 id="cpf" 
                 maxLength="11" 
                 value={auth.cpf || ''} 
                 onChange={e => {
                  const re = /^[0-9\b]+$/
                  const key = e.target.value
      
                  if (key === '' || re.test(key)) {
                    setAuth({ ...auth, cpf: key })
                  }
                 }}
          />

          <div id="validationCpf" 
               className="invalid-feedback" 
               style={error.cpf ? { display: 'inline' } : { display: 'none' }}>
               {error.cpf}
          </div>
        </div>
        
        <div className="mb-2">
          <label htmlFor="password" className="form-label">Senha</label>

          <input type="password" 
                 className={`form-control ${error.password ? 'is-invalid' : ''}`}
                 id="password" 
                 maxLength="8" 
                 onChange={e => {
                  setAuth({ ...auth,
                    password: e.target.value
                  })
                 }}
          />

          <div id="validationPassword" 
               className="invalid-feedback" 
               style={error.password ? { display: 'inline' } : { display: 'none' }}>
            {error.password}
          </div>
        </div>

        <div className="mb-3">
          <Link to="/email-redefine-senha">Esqueci minha senha</Link>
        </div>

        <div className="text-center d-grid gap-2">
          <button type="button" 
                  className="btn btn-primary"
                  onClick={handleLogin}
                  disabled={loading}>
            <span className="spinner-border spinner-border-sm mx-1" 
                  role="status" 
                  aria-hidden="true" 
                  style={loading ? { display: 'inline-block'} : { display : 'none' }}>
            </span>
            Entrar
          </button>

          <button type="button" 
                  className="btn btn-warning text-white" 
                  style={admin ? { display: 'none' } : { display: 'inline-block' }}
                  onClick={() => {
                    history.push('/registro')
                  }}>
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
