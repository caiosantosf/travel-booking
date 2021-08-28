import React from 'react'
import { Link } from "react-router-dom"
import { getUserId, getUserType } from '../../config/security'

function Sidebar() {
  let links = []

  const type = getUserType()

  if (!type) {
    links = [
              { key: 3, name: 'Início', to: '/' },
              { key: 1, name: 'Login', to: '/login' },
              { key: 2, name: 'Cadastrar', to: '/registro' }
            ]
  }

  if (type === 'admin') {
    links = [
              { key: 1, name: 'Página Inicial', to: '/admin-inicial' },
              { key: 2, name: 'Dados Admin', to: `/usuarios/${getUserId()}`},
              { key: 3, name: 'Reservas', to: '/reservas'},
              { key: 4, name: 'Visualização de Usuários', to: '/usuarios' },
              { key: 5, name: 'Cadastro de Viagens', to: '/viagens' },
              { key: 6, name: 'Cadastro de Ônibus', to: '/onibus' },
              { key: 7, name: 'Sair', to: '/sair' }
            ]
  }

  if (type === 'regular') {
    links = [
              { key: 1, name: 'Página Inicial', to: '/' },
              { key: 2, name: 'Meus Dados', to: `/usuarios/${getUserId()}` },
              { key: 3, name: 'Minhas Reservas', to: '/minhas-reservas' },
              { key: 4, name: 'Sair', to: '/sair' }
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
