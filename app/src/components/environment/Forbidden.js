import React from 'react'
import { useHistory } from "react-router-dom"
import logo from '../../assets/logo.webp'

function Forbidden() {

  let history = useHistory()

  const handleLogin = () => {
    history.push('/login')
  }

  return (
    <div className="container container-login">
      <form>
        <div className="text-center mb-3">
          <img className="mb-3 img-login" src={ logo } alt="Logo" />
          <h5>Sistema de reserva</h5>
          <h3>Você não tem permissão para acessar esta área!</h3>
        </div>

        <div className="text-center d-grid gap-2">
          <button type="button" 
                  className="btn btn-primary"
                  onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Forbidden
