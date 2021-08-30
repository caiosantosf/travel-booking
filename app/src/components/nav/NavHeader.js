import React from 'react'
import logo from '../../assets/logo.webp'
import WhatsAppWidget from 'react-whatsapp-widget'
import 'react-whatsapp-widget/dist/index.css'
import { getUserType } from '../../config/security'

function Hamburger() {
  return (
    <button className="navbar-toggler position-absolute d-md-none collapsed mt-4" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
  )
}

function Nav({ hamburger }) {
  
  const wpp = <WhatsAppWidget phoneNumber={localStorage.getItem('companyPhone')} 
                              textReplyTime='Responderemos assim que possível'
                              message='Olá! O que podemos fazer por você?'
                              companyName={localStorage.getItem('companyName')}
                              sendButton='Enviar'
                              placeholder='Digite sua mensagem'/>

  return (
    <React.Fragment>
      <header className="navbar navbar-light sticky-top bg-white p-0 shadow">
        <div className="container text-center">
          <img className="my-3 img-menu" src={ logo } alt="Logo" />
          { hamburger !== 'none' ? <Hamburger /> : '' }
        </div>
      </header>

      {getUserType() !== 'admin' ? wpp : ''}
    </React.Fragment>
  )
}

export default Nav
