import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { api } from '../../config/api'

function ResetPassword(props) {
  const [password, setPassword] = useState({})
  const [message, setMessage] = useState({})
  const [loading, setLoading] = useState(false)

  let history = useHistory()

  const handleResetPassword = async () => {
    try {
      if (password.password === password.passwordConfirmation) {
        setLoading(true)
        const id = props.match.params.id
        const token = props.location.search.replace('?token=', '')
        const res = await api.patch(`/users/login/resetpassword/${id}`, { 'password' : password.password }, 
          { headers :{
            'x-access-token' : token
          }})
        setMessage({ ...res.data, error : false })
        setLoading(false)
      } else {
        setMessage({
          message : "A Senha não bate com a confirmação",
          error : true
        })
      }
      setPassword({})
    } catch (err) {
      setMessage({ ...err.response.data, error : true })
      setLoading(false)
    }
  }

  return (
    <div className="container container-login">

      <div className={`alert text-center ${message.error ? 'alert-danger' : 'alert-warning'}`}
           role="alert"
           style={message.message ? { display: 'block'} : { display : 'none' }}>
        {message.message || message.password}
      </div>

      <div className="text-center mb-3">
        <h5>
          Cadastre sua nova senha
        </h5>
      </div>

      <form>
        <div className="mb-2" >
          <label htmlFor="password" 
                 className="form-label">
            Senha
          </label>
          <input  type="password" 
                  className='form-control'
                  id="password" 
                  maxLength="8"
                  value={password.password || ''}
                  onChange={(e) => {
                    const key = e.target.value
                    setPassword({
                      ...password,
                      password: key
                    })
                  }}
          />
        </div>

        <div className="mb-2" >
          <label htmlFor="passwordConfirmation" 
                 className="form-label">
            Confirme a Senha
          </label>
          <input  type="password" 
                  className='form-control'
                  id="passwordConfirmation" 
                  maxLength="8"
                  value={password.passwordConfirmation || ''}
                  onChange={(e) => {
                    const key = e.target.value
                    setPassword({
                      ...password,
                      passwordConfirmation: key
                    })
                  }}
          />
        </div>

        <div className="text-center d-grid gap-2">
          <button type="button" 
                  className="btn btn-primary" 
                  onClick={handleResetPassword}
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

export default ResetPassword
