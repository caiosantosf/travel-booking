const validation = (fields) => {
  return (req, res, next) => {
    const { travel_id, value, onlyReturnValue, onlyDepartureValue, initialAge, finalAge } = req.body
    const messages = {}
    
    if (fields.includes('travel_id')) {
      if ( (typeof travel_id !== 'undefined') && (id != 0) ) {
        if (!regExpNumbers.test(id)) {
          messages.travel_id = 'Id da viagem deve numérico'
        }
      } else {
        messages.travel_id = 'O Id da viagem é obrigatório'
      }
    }

    if (fields.includes('value')) {
      if (typeof value !== 'undefined') {
        if (isNaN(value) || (!value)) {
          messages.value = 'O valor não é valido'
        }
      } else {
        messages.value = 'O valor é obrigatório'
      }
    }

    if (fields.includes('onlyReturnValue')) {
      if (typeof onlyReturnValue !== 'undefined') {
        if (isNaN(onlyReturnValue) || (!onlyReturnValue)) {
          messages.onlyReturnValue = 'O valor de retorno não é valido'
        }
      } else {
        messages.onlyReturnValue = 'O valor de retorno é obrigatório'
      }
    }

    if (fields.includes('onlyDepartureValue')) {
      if (typeof onlyDepartureValue !== 'undefined') {
        if (isNaN(onlyDepartureValue) || (!onlyDepartureValue)) {
          messages.onlyDepartureValue = 'O valor de ida não é valido'
        }
      } else {
        messages.onlyDepartureValue = 'O valor de ida é obrigatório'
      }
    }

    if (fields.includes('initialAge')) {
      if (typeof initialAge !== 'undefined') {
        if (isNaN(initialAge) || (!initialAge)) {
          messages.initialAge = 'A idade inicial não é valida'
        }
      } else {
        messages.initialAge = 'A idade inicial é obrigatória'
      }
    }

    if (fields.includes('finalAge')) {
      if (typeof finalAge !== 'undefined') {
        if (isNaN(finalAge) || (!finalAge)) {
          messages.finalAge = 'O valor de ida não é valido'
        }
      } else {
        messages.finalAge = 'O valor de ida é obrigatório'
      }
    }
    
    if (Object.keys(messages).length > 0) {
      return res.status(400).json(messages)
    }

    next()
  }
}

module.exports = validation
