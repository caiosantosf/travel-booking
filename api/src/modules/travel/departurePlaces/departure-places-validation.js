const validation = (fields) => {
  return (req, res, next) => {
    const { travel_id, cep, homeAddress, addressNumber, neighborhood, city, state, departureDate, returnDate } = req.body
    const regExpNumbers = /^[0-9]+$/
    const messages = {}
    
    if (fields.includes('travel_id')) {
      if ( (typeof travel_id !== 'undefined') && (id != 0) ) {
        if (!regExpNumbers.test(travel_id)) {
          messages.travel_id = 'Id da viagem deve numérico'
        }
      } else {
        messages.travel_id = 'O Id da viagem é obrigatório'
      }
    }

    if (fields.includes('cep')) {
      if ( (typeof cep !== 'undefined') && (cep.trim() !== '') ) {
        if (cep.length !== 8) {
          messages.cep = 'O CEP deve ter 8 caracteres'
        }

        if (!regExpNumbers.test(cep)) {
          messages.cep = 'O CEP deve ser numérico'
        }
      } else {
        messages.cep = 'O CEP é obrigatório'
      }
    }

    if (fields.includes('homeAddress')) {
      if ( (typeof homeAddress !== 'undefined') && (homeAddress.trim() !== '') ) {
        if (homeAddress.length > 255) {
          messages.homeAddress = 'O Endereço não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.homeAddress = 'O Endereço é obrigatória'
      }
    }

    if (fields.includes('addressNumber')) {
      if ( (typeof addressNumber !== 'undefined') && (addressNumber !== 0) ) {
        if (addressNumber.length > 8) {
          messages.addressNumber = 'A senha não pode ter mais do que 8 caracteres'
        }

        if (!regExpNumbers.test(addressNumber)) {
          messages.addressNumber = 'O Número deve ser numérico'
        }
      } else {
        messages.addressNumber = 'O Número é obrigatório'
      }
    }

    if (fields.includes('complement')) {
      if ( (typeof complement !== 'undefined') && (complement.trim() !== '') ) {
        if (complement.length > 255) {
          messages.complement = 'O Complemento não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.complement = 'O Complemento é obrigatório'
      }
    }

    if (fields.includes('neighborhood')) {
      if ( (typeof neighborhood !== 'undefined') && (neighborhood.trim() !== '') ) {
        if (neighborhood.length > 255) {
          messages.neighborhood = 'O Bairro não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.neighborhood = 'O Bairro é obrigatório'
      }
    }

    if (fields.includes('city')) {
      if ( (typeof city !== 'undefined') && (city.trim() !== '') ) {
        if (city.length > 255) {
          messages.city = 'A Cidade não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.city = 'A Cidade é obrigatória'
      }
    }

    if (fields.includes('state')) {
      if ( (typeof state !== 'undefined') && (state.trim() !== '') ) {
        if (state.length !== 2) {
          messages.state = 'O Estado deve ter 2 caracteres'
        }
      } else {
        messages.state = 'O Estado é obrigatório'
      }
    }

    if (fields.includes('departureDate')) {
      if ( (typeof departureDate !== 'undefined') && (departureDate.trim() !== '') ) {
        if (new Date(departureDate) === 'Invalid Date') {
          messages.departureDate = 'A Data de saída não é valida'
        }
      } else {
        messages.departureDate = 'A Data de saída é obrigatória'
      }
    }

    if (fields.includes('returnDate')) {
      if ( (typeof returnDate !== 'undefined') && (returnDate.trim() !== '') ) {
        if (new Date(returnDate) === 'Invalid Date') {
          messages.returnDate = 'A Data de retorno não é valida'
        }
      } else {
        messages.returnDate = 'A Data de retorno é obrigatória'
      }
    }

    if (Object.keys(messages).length > 0) {
      return res.status(400).json(messages)
    }

    next()
  }
}

module.exports = validation
