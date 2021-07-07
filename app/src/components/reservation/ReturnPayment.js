import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'
import { api } from '../../config/api'
import { errorApi } from '../../config/handleErrors'

function ReturnPayment(props) {
  const [message, setMessage] = useState('')

  const { status, id } = props.match.params

  useEffect(() => {
    if (status !== 'failure') {
      put(id)
    }
  }, [status, id])

  let history = useHistory()

  const put = async (id) => {
    const config = { headers :{
      'x-access-token' : localStorage.getItem('token')
    }}

    try {
      const res = await api.get(`/reservations/${id}`, config)

      const { data } = res

      await api.post('/reservations-email', {}, { headers :{
        'x-access-token': localStorage.getItem('token'),
        'email': true,
        'user_id': data.user_id,
        'datetime': data.datetime
      }})
    } catch (error) {
      const errorHandled = errorApi(error)
      if (errorHandled.general) {
        setMessage(errorHandled.error)
      } else {
        let msg = ''
        Object.entries(error.response.data).forEach(([key, value]) => {
          msg += `${value} | `
        })
        msg = msg.substr(0, msg.length - 3)
        setMessage(msg)
      }
    }
  }

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid mb-4">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <div className='alert text-center alert-dismissible alert-danger fade show' role="alert"
              style={message ? { display: 'block'} : { display : 'none' }}>
            {message}
          </div>

          <h5>Reserva</h5>

          <br />

          {status === 'success' ? <h6>Pagamento efetuado com sucesso!</h6> : ''}
          {status === 'failure' ? <h6>O pagamento pagamento falhou, se desejar faça outra reserva e tente novamente!</h6> : ''}
          {status === 'pending' ? <h6>O pagamento está pendente, você deverá receber um email quando for aprovado!</h6> : ''}

          <br />

          <button type="button" 
                  className="btn btn-warning text-white"
                  onClick={() => {
                    history.push('/')
                  }}>
            Voltar
          </button>

        </div>
      </div>
    </React.Fragment>
  )
}

export default ReturnPayment
