import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { PencilSquare, ChevronDoubleLeft, ChevronDoubleRight, ChevronRight, ChevronLeft } from 'react-bootstrap-icons'
import { api } from '../../config/api'

function Buses() {
  const [buses, setBuses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)

  let history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/buses', 
          { headers :{
            'currentPage': currentPage, 
            'x-access-token' : localStorage.getItem('token')
          }})
        if (res.status === 200) {
          setLastPage(res.data.pagination.lastPage)
          setBuses(res.data.data)
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

  const handleNew = async () => {
    history.push('/onibus/novo')
  }

  const countSeats = seats => {
    return seats.filter(seat => seat).length
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <Sidebar />

          <h5>Cadastro de ônibus</h5>
        
          <div className="table-responsive-sm">
            <table className="table table-sm table-striped table-hover">
              <thead>
                <tr key="0">
                  <th scope="col">Descrição</th>
                  <th scope="col">Assentos</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {buses.map(bus => {
                  return (
                    <tr key={bus.id}>
                      <td>{bus.description}</td>
                      <td>{countSeats(bus.layout.seats)}</td>
                      <td><Link className="me-2" to={`/onibus/${bus.id}`}><PencilSquare /></Link></td>
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

          <div className="text-center d-grid gap-2">
            <button type="button" 
                    className="btn btn-primary"
                    onClick={handleNew}>
              Novo
            </button>

          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Buses
