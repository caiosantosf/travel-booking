import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { api } from '../../config/api'

function EmailResetPassword() {
  const [email, setEmail] = useState({})
  const [message, setMessage] = useState({})
  const [loading, setLoading] = useState(false)

  let history = useHistory()

  const handleEmailResetPassword = async () => {
    try {
      setLoading(true)
      const domain = window.location.hostname
      const res = await api.post(`/users/login/emailresetpassword?domain=${domain}`, email)
      setMessage({
        email : res.data.email,
        error : false
      })
      setLoading(false)
    } catch (err) {
      setMessage({
        email : err.response.data.email,
        error : true
      })
      setLoading(false)
    }
  }

  return (
    <div className="container container-login">
      <form>
        <div className={`alert text-center ${message.error ? 'alert-danger' : 'alert-warning'}`}
            role="alert"
            style={message.email ? { display: 'block'} : { display : 'none' }}>
          {message.email}
        </div>

        <div className="text-center mb-3">
          <h5>
            Enviaremos para o seu email um link para cadastro de nova senha
          </h5>
        </div>
        
        <div className="mb-2" >
          <label htmlFor="email" 
                 className="form-label">
            Email
          </label>
          <input  type="email" 
                  className='form-control'
                  id="email" 
                  maxLength="255"
                  value={email.email || ''}
                  onChange={(e) => {
                    const key = e.target.value
                    setEmail({
                      email: key
                    })
                  }}
          />
        </div>

        <div className="text-center d-grid gap-2">
          <button type="button" 
                  className="btn btn-primary" 
                  onClick={handleEmailResetPassword}
                  disabled={loading}>
            <span className="spinner-border spinner-border-sm mx-1" 
                  role="status" 
                  aria-hidden="true"
                  style={loading ? { display: 'inline-block'} : { display : 'none' }}>
            </span>
            Enviar
          </button>
          <button type="button" 
                  className="btn btn-warning text-white"
                  onClick={() => {
                    history.push('/')
                  }}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmailResetPassword
