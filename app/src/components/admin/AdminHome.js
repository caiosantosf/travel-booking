import React from 'react'
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'

function AdminHome() {
  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">         
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h1>Área do administrador</h1>
          <h5>Acesse a funcionalidade desejada pelo menu</h5>

        </div>
      </div>
    </React.Fragment>
  )
}

export default AdminHome
