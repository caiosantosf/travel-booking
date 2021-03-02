import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { PencilSquare, ChevronDoubleLeft, ChevronDoubleRight, ChevronRight, ChevronLeft, Whatsapp } from 'react-bootstrap-icons'
import { api } from '../../config/api'
import { errorApi } from '../../config/handleErrors'
import { dateTimeBrazil, translatePaymentStatus } from '../../config/util'

function PaymentList(props) {
  const [passengers, setPassengers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)
  const [message, setMessage] = useState('')
  const [adminData, setAdminData] = useState({})

  let { travel_id } = props.match.params

  let history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/reservations', 
          { headers :{
            'travel_id': travel_id,
            'currentPage': currentPage, 
            'x-access-token' : localStorage.getItem('token'),
            'list': 'payment'
          }})
        if (res.status === 200) {
          setLastPage(res.data.pagination.lastPage)
          setPassengers(res.data.data)
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

      try {
        const res = await api.get(`/admin-data/`, {headers:{'x-access-token' : localStorage.getItem('token')}})

        const { data } = res
        setAdminData(data)
      } catch (error) {
        const errorHandled = errorApi(error)
        if (errorHandled.general) {
          setMessage(errorHandled.error)
        }
      }
    }
    fetchData()

  }, [currentPage, travel_id, history])

  const handleEditStatus = async (id, name) => {
    history.push(`/viagens/${travel_id}/pagamentos/${id}`, {name})
  }

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

          <h5>Lista de Pagamentos</h5>

          <div className='alert text-center alert-danger' role="alert"
               style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>
        
          <div className="table-responsive-sm">
            <table className="table table-responsive-lgcd ap table-sm table-striped table-hover">
              <thead>
                <tr key="0">
                  <th scope="col">Nome</th>
                  <th scope="col">Data Reserva</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map(passenger => {
                  const { id, person, datetime, status, value } = passenger
                  const { name, phone, type } = person

                  const statusToShow = translatePaymentStatus(status)

                  const phoneLen = phone ? phone.length : 0
                  const wpp = 
                    <a className='ms-2' href={`https://api.whatsapp.com/send?phone=55${phone}`} target="_blank" rel="noreferrer">
                      <Whatsapp style={{color:'green'}} />
                    </a>
                    
                    if (person.id !== adminData.user_id && type) {
                      return (
                        <tr key={id}>
                          <td>{name}</td>
                          <td>{dateTimeBrazil(datetime)}</td>
                          <td>
                            {phone ? `(${passenger.person.phone.substr(0, 2)}) ${phone.substr(2, phoneLen === 10 ? 4: 5)}-${phone.substr(phoneLen === 10 ? 6: 7, 4)}` : ''}
                            {phone ? wpp : ''}
                          </td>
                          <td>{`R$ ${value.replace('.', ',')}`}</td>
                          <td><strong className={statusToShow.color}>{statusToShow.translated}</strong></td>
                          <td>{status === '1' || status === '2' ? 
                            <button className="btn btn-link p-0" onClick={() => {handleEditStatus(id, name)}}><PencilSquare /> </button> : ''}
                          </td>
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

export default PaymentList
