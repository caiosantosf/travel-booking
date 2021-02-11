import React from 'react'
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'

function AdminHome() {
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="row">
          <NavHeader />
          
          <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Sidebar />

            <h1>Area do administrador</h1>
            <h5>Acesse a funcionalidade desejada pelo menu</h5>

          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default AdminHome
