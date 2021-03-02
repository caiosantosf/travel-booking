import React from 'react'
import { useHistory } from "react-router-dom"
import NavHeader from '../nav/NavHeader'
import Sidebar from '../nav/Sidebar'

function ReturnPayment(props) {
  
  const { status } = props.match.params

  let history = useHistory()

  return (
    <React.Fragment>
      <NavHeader />
      <div className="container-fluid mb-4">
        <div className="mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2">
          <Sidebar />

          <h5>Reserva</h5>

          <br />

          {status === 'success' ? <h6>Pagamento efetuado com sucesso!</h6> : ''}
          {status === 'failure' ? <h6>O pagamento pagamento falhou, se desejar faça outra reserva e tenta novamente!</h6> : ''}
          {status === 'pending' ? <h6>O pagamento está pendente, você deverá receber um email do Mercado Pago quando for aprovado!</h6> : ''}

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
