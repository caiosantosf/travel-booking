const validation = (fields) => {
  return (req, res, next) => {
    const { id, description, destination, departure, value, bus_id, days } = req.body
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

    if (fields.includes('departure')) {
      if ( (typeof departure !== 'undefined') && (departure.trim() !== '') ) {
        if (new Date(departure) === 'Invalid Date') {
          messages.departure = 'A Data de saída não é valida'
        }
      } else {
        messages.departure = 'A Data de de saída é obrigatória'
      }
    }

    if (fields.includes('value')) {
      if ( (typeof value !== 'undefined') && (value.trim() !== '') ) {
        if (isNaN(value) || (!value)) {
          messages.value = 'O Valor não é valido'
        }
      } else {
        messages.value = 'O Valor é obrigatório'
      }
    }

    if (fields.includes('bus_id')) {
      if ( (typeof bus_id !== 'undefined') && (bus_id.trim() !== '') ) {
        if (isNaN(bus_id) || (!bus_id)) {
          messages.bus_id = 'O Ônibus não é valido'
        }
      } else {
        messages.bus_id = 'O Ônibus é obrigatório'
      }
    }

    if (fields.includes('days')) {
      if ( (typeof days !== 'undefined') && (days.trim() !== '') ) {
        if (isNaN(days) || (!days)) {
          messages.days = 'Os dias não são validos'
        }
      } else {
        messages.days = 'Os dias são obrigatório'
      }
    }
    
    if (Object.keys(messages).length > 0) {
      return res.status(400).json(messages)
    }

    next()
  }
}

module.exports = validation
