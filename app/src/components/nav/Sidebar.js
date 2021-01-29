import React from 'react'
import { Link } from "react-router-dom"

function Sidebar(props) {

  let links = []

  if (props.pageType === 'register') {
    links = [
              { key: 1, name: 'Login', to: '/' },
            ]
  }

  if (props.pageType === 'admin') {
    links = [
              { key: 1, name: 'Página Inicial', to: '/admin-inicial' },
              { key: 2, name: 'Visualização de Usuários', to: '/usuarios' },
              { key: 3, name: 'Cadastro de Viagens', to: '/viagens' },
              { key: 4, name: 'Cadastro de Ônibus', to: '/onibus' },
              { key: 5, name: 'Sair', to: '/' }
            ]
  }

  if (props.pageType === 'user') {
    links = [
              { key: 1, name: 'Página Inicial', to: '/inicial' },
              { key: 2, name: 'Meus Dados', to: '/usuario' },
              { key: 3, name: 'Minhas Viagens', to: '/minhas-viagens' },
              { key: 4, name: 'Sair', to: '/' }
            ]
  }

  return (
    <div className="row">
      <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div className="position-sticky pt-3">
          <ul className="nav flex-column">
            {links.map((linkItem) => {
              return (
                <li key={linkItem.key} className="nav-item" >
                  <Link className="nav-link" aria-current="page" to={linkItem.to}>
                    {linkItem.name}
                  </Link>
                </li>
                )
            })}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
