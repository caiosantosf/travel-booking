import React from 'react'
import logo from '../../assets/logo.png'

function Hamburger() {
  return (
    <button className="navbar-toggler position-absolute d-md-none collapsed mt-4" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
  )
}

function Nav({ hamburger }) {
  return (
    <header className="navbar navbar-light sticky-top bg-white p-0 shadow">
      <div className="container text-center">
        <img className="my-3 img-menu" src={ logo } alt="Logo" />
        { hamburger !== 'none' ? <Hamburger /> : '' }
      </div>
    </header>
  )
}

export default Nav
