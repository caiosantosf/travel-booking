import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { PencilSquare, ChevronDoubleLeft, ChevronDoubleRight, ChevronRight, ChevronLeft } from 'react-bootstrap-icons'
import { api } from '../../config/api'

function Users() {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)

  let history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/users', 
          { headers :{
            'currentPage': currentPage, 
            'x-access-token' : localStorage.getItem('token')
          }})
        if (res.status === 200) {
          setLastPage(res.data.pagination.lastPage)
          setUsers(res.data.data)
        } else {
          setLastPage(1)
        }
      } catch (error) {
        history.push('/')
      }
    }
    fetchData()

  }, [currentPage, history])

  const handleFirst = async () => {
    setCurrentPage(1)
  }

  const handlePrevious = async () => {
    setCurrentPage(currentPage - 1)
  }

  const handleNext = async () => {
    setCurrentPage(currentPage + 1)
  }

  const handleLast = async () => {
    setCurrentPage(lastPage)
  }

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="row">
          <NavHeader />
          
          <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Sidebar pageType="admin"/>

            <h5>Visualização de Usuários</h5>
          
            <table className="table table-sm table-striped table-hover">
              <thead>
                <tr key="0">
                  <th scope="col">Descrição</th>
                  <th scope="col">Assentos</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  return (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td><Link className="me-2" to={`/usuarios/${user.id}`}><PencilSquare /></Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <button type="button" className="btn btn-outline-primary m-1" 
                    disabled={currentPage === 1 ? true : false}
                    onClick={handleFirst}><ChevronDoubleLeft />
                  </button>
                </li>

                <li className="page-item">
                  <button type="button" className="btn btn-outline-primary m-1" 
                    disabled={currentPage === 1 ? true : false}
                    onClick={handlePrevious}><ChevronLeft />
                  </button>
                </li>

                <li className="page-item">
                  <button type="button" className="btn btn-outline-primary m-1" 
                    disabled={currentPage === lastPage ? true : false}
                    onClick={handleNext}><ChevronRight />
                  </button>
                </li>

                <li className="page-item">
                  <button type="button" className="btn btn-outline-primary m-1" 
                    disabled={currentPage === lastPage ? true : false}
                    onClick={handleLast}><ChevronDoubleRight />
                  </button>
                </li>

              </ul>
            </nav>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Users
