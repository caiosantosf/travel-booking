const validation = (fields) => {
  return (req, res, next) => {
    const { id, description, destination, bus_id, installments, controlsSeats } = req.body
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

    if (fields.includes('description')) {
      if ( (typeof description !== 'undefined') && (description.trim() !== '') ) {
        if (description.length > 255) {
          messages.description = 'A Descrição não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.description = 'A Descrição é obrigatória'
      }
    }

    if (fields.includes('destination')) {
      if ( (typeof destination !== 'undefined') && (destination.trim() !== '') ) {
        if (destination.length > 255) {
          messages.destination = 'O Destino não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.destination = 'O Destino é obrigatório'
      }
    }

    if (fields.includes('bus_id')) {
      if (typeof bus_id !== 'undefined') {
        if (isNaN(bus_id) || (!bus_id)) {
          messages.bus_id = 'O Ônibus não é valido'
        }
      } else {
        messages.bus_id = 'O Ônibus é obrigatório'
      }
    }

    if (fields.includes('installments')) {
      if (typeof installments !== 'undefined') {
        if (isNaN(installments) || (!installments)) {
          messages.installments = 'As parcelas não são validas'
        }
      } else {
        messages.installments = 'As parcelas são obrigatórias'
      }
    }

    if (fields.includes('controlsSeats')) {
      if ( (typeof controlsSeats === 'undefined') || (controlsSeats === '') ) {
        messages.controlsSeats = 'É obrigatório informar se irá controlar poltronas'
      }
    }
    
    if (Object.keys(messages).length > 0) {
      return res.status(400).json(messages)
    }

    next()
  }
}

module.exports = validation
