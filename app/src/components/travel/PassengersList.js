import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { PencilSquare, ChevronDoubleLeft, ChevronDoubleRight, ChevronRight, ChevronLeft, Whatsapp } from 'react-bootstrap-icons'
import { api } from '../../config/api'
import PassengersListPDF  from './PassengersListPDF'
import { PDFDownloadLink } from '@react-pdf/renderer'

function PassengersList(props) {
  const [passengers, setPassengers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)

  let { travel_id } = props.match.params

  let history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/reservations', 
          { headers :{
            'travel_id': travel_id,
            'currentPage': currentPage, 
            'x-access-token' : localStorage.getItem('token')
          }})
        if (res.status === 200) {
          setLastPage(res.data.pagination.lastPage)
          setPassengers(res.data.data)
        } else {
          setLastPage(1)
        }
      } catch (error) {
        //history.push('/')
      }
    }
    fetchData()

  }, [currentPage, travel_id])

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

          <h5>Lista de Passageiros</h5>
        
          <div className="table-responsive-sm">
            <table className="table table-responsive-lgcd ap table-sm table-striped table-hover">
              <thead>
                <tr key="0">
                  <th scope="col">P. Ida</th>
                  <th scope="col">P. Volta</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Colo</th>
                  <th scope="col">Responsável</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map(passenger => {
                  const { id, person, departureSeat, returnSeat, lapChild } = passenger
                  const { name, phone, responsible } = person

                  const phoneLen = phone ? phone.length : 0
                  const wpp = 
                    <a className='ms-2' href={`https://api.whatsapp.com/send?phone=55${phone}`} target="_blank" rel="noreferrer">
                      <Whatsapp style={{color:'green'}} />
                    </a>

                  if ((departureSeat || returnSeat) || lapChild) {
                    return (
                      <tr key={id}>
                        <td>{departureSeat}</td>
                        <td>{returnSeat}</td>
                        <td>{name}</td>
                        <td>{lapChild ? 'Sim' : 'Não'}</td>
                        <td>{responsible ? responsible : ''}</td>
                        <td>
                          {phone ? `(${passenger.person.phone.substr(0, 2)}) ${phone.substr(2, phoneLen === 10 ? 4: 5)}-${phone.substr(phoneLen === 10 ? 6: 7, 4)}` : ''}
                          {phone ? wpp : ''}
                        </td>
                        <td><Link to={`/viagens/${travel_id}/reservas/${id}`}><PencilSquare /> </Link></td>
                      </tr>
                    )
                  } else {
                    return ''
                  }
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
            <PDFDownloadLink className="btn btn-primary" 
                             document={<PassengersListPDF 
                               passengers={passengers} 
                               travel_id={travel_id} 
                             />} 
                             fileName={`lista_viagem_${travel_id}.pdf`}>
              {({ blob, url, loading, error }) => (loading ? 'Carregando PDF...' : 'Exportar PDF')}
            </PDFDownloadLink>

            <button type="button" 
                    className="btn btn-warning text-white"
                    onClick={() => {
                      history.push(`/viagens/${travel_id}`)
                    }}>
              Voltar
            </button>
          </div>
        </div>
      </div>

    </React.Fragment>
  )
}

export default PassengersList
