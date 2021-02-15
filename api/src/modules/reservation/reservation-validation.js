const validation = (fields) => {
  return (req, res, next) => {
    const { travel_id, user_id, dependent_id, departureSeat, returnSeat } = req.body
    const messages = {}
    
    if (fields.includes('id')) {
      if ( (typeof id !== 'undefined') && (id != 0) ) {
        if (!regExpNumbers.test(id)) {
          messages.id = 'Id deve numérico'
        }
      } else {
        messages.id = 'O Id é obrigatório'
      }
    }

    if (fields.includes('travel_id')) {
      if (typeof travel_id !== 'undefined') {
        if (isNaN(travel_id) || (!travel_id)) {
          messages.travel_id = 'A Viagem não é valida'
        }
      } else {
        messages.travel_id = 'A Viagem é obrigatória'
      }
    }

    if (fields.includes('dependent_id')) {
      if (typeof dependent_id !== 'undefined') {
        if (isNaN(dependent_id) || (!dependent_id)) {
          messages.dependent_id = 'O Dependente não é valido'
        }
      }
    }

    if (fields.includes('user_id')) {
      if (typeof user_id !== 'undefined') {
        if (isNaN(user_id) || (!user_id)) {
          messages.user_id = 'O Usuário não é valido'
        }
      } else {
        messages.user_id = 'O Usuário é obrigatório'
      }
    }

    if (fields.includes('departureSeat')) {
      if (typeof departureSeat !== 'undefined') {
        if (isNaN(departureSeat)) {
          messages.departureSeat = 'O Número da Poltrona de Ida não é valido'
        }

        if (departureSeat > 99) {
          messages.departureSeat = 'O Número da Poltrona de Ida não pode ser maior que 99'
        }
      }
    }

    if (fields.includes('returnSeat')) {
      if (typeof returnSeat !== 'undefined') {
        if (isNaN(returnSeat)) {
          messages.returnSeat = 'O Número da Poltrona de Volta não é valido'
        }

        if (returnSeat > 99) {
          messages.returnSeat = 'O Número da Poltrona de Volta não pode ser maior que 99'
        }
      }
    }

    if ( (fields.includes('departureSeat')) && (fields.includes('returnSeat')) ) {
      if ( (!departureSeat) && (!returnSeat) ) {
        messages.departureSeat = 'Não é possível fazer a reserva sem nenhuma poltrona'
        messages.returnSeat = 'Não é possível fazer a reserva sem nenhuma poltrona'
      }
    }

    if (Object.keys(messages).length > 0) {
      return res.status(400).json(messages)
    }

    next()
  }
}

module.exports = validation
