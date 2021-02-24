import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { PencilSquare, ChevronDoubleLeft, ChevronDoubleRight, ChevronRight, ChevronLeft, Whatsapp } from 'react-bootstrap-icons'
import { api } from '../../config/api'
import { errorApi } from '../../config/handleErrors'

function Users() {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)
  const [message, setMessage] = useState('')

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
        const errorHandled = errorApi(error)
        if (errorHandled.forbidden) {
          history.push('/')
        } else {
          if (errorHandled.general) {
            setMessage(errorHandled.error)
          }
        }
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
      <NavHeader />
      <div className="container-fluid mb-4">      
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h5>Visualização de Usuários</h5>

          <div className='alert text-center alert-danger' role="alert"
               style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>
        
          <div className="table-responsive-sm">
            <table className="table table-responsive-sm table-sm table-striped table-hover">
              <thead>
                <tr key="0">
                  <th scope="col">Nome</th>
                  <th scope="col">CPF</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const phoneLen = user.phone.length
                  return (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.cpf}</td>
                      <td>
                        {`(${user.phone.substr(0, 2)}) ${user.phone.substr(2, phoneLen === 10 ? 4: 5)}-${user.phone.substr(phoneLen === 10 ? 6: 7, 4)}`}
                        <a className='ms-2' href={`https://api.whatsapp.com/send?phone=55${user.phone}`} target="_blank" rel="noreferrer">
                          <Whatsapp style={{color:'green'}} />
                        </a>
                      </td>
                      <td><Link to={`/usuarios/${user.id}`}><PencilSquare /> </Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

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
    </React.Fragment>
  )
}

export default Users
