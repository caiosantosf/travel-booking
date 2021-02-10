import React from 'react'
import { useHistory } from "react-router-dom"
import logo from '../../assets/logo.png'

function Forbidden(props) {

  let history = useHistory()

  return (
    <div className="container container-login">
      <form>
        <div className="text-center mb-3">
          <img className="mb-3 img-login" src={ logo } alt="Logo" />
          <h5>Sistema de reserva</h5>
          <h3>Você precisa fazer o login ou se cadastrar para continuar!</h3>
        </div>

        <div className="text-center d-grid gap-2">
          <button type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    localStorage.setItem('to', props.match.url)
                    history.push(`/login`)
                  }}>
            Entrar
          </button>

          <button type="button" 
                  className="btn btn-warning text-white" 
                  onClick={() => {
                    localStorage.setItem('to', props.match.url)
                    history.push(`/registro`)
                  }}>
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Forbidden
