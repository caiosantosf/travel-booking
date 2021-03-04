const { getUserType } = require('../../config/security')

const validation = (fields) => {
  return async (req, res, next) => {
    const { id, name, cpf, phone, email, password, documentType, document, cep, homeAddress, 
            addressNumber, complement, neighborhood, city, state, birth } = req.body
    const messages = {}
    const regExpNumbers = /^[0-9]+$/
    const regExpEmail = /\S+@\S+\.\S+/

    const userType = await getUserType(req)

    if (fields.includes('id')) {
      if ( (typeof id !== 'undefined') && (id != 0) ) {
        if (!regExpNumbers.test(id)) {
          messages.id = 'Id deve numérico'
        }
      } else {
        messages.id = 'O Id é obrigatório'
      }
    }

    if (fields.includes('name')) {
      if ( (typeof name !== 'undefined') && (name.trim() !== '') ) {
        if (name.length > 255) {
          messages.userName = 'O Nome não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.userName = 'O Nome é obrigatório'
      }
    }

    if (fields.includes('cpf')) {
      if ( (typeof cpf !== 'undefined') && (cpf != 0) ) {
        if (cpf.length !== 11) {
          messages.cpf = 'O CPF deve ter 11 caracteres'
        }

        if (!regExpNumbers.test(cpf)) {
          messages.cpf = 'O CPF deve ser numérico'
        }
      } else {
        messages.cpf = 'O CPF é obrigatório'
      }
    }

    if (fields.includes('phone')) {
      if ( (typeof phone !== 'undefined') && (phone.trim() !== '') ) {
        if ((phone.length < 10) || (phone.length > 11)) {
          messages.phone = 'O Telefone (WhatsApp) não pode ter mais do que 11 caracteres e menos que 10'
        }

        if (!regExpNumbers.test(phone)) {
          messages.phone = 'O Telefone (WhatsApp) deve ser numérico'
        }
      } else {
        messages.phone = 'O Telefone (WhatsApp) é obrigatório'
      }
    }

    if (fields.includes('email')) {
      if ( (typeof email !== 'undefined') && (email.trim() !== '') ) {
        if (!regExpEmail.test(email)) {
          messages.email = 'O Email é inválido'
        }
      } else {
        messages.email = 'O Email é obrigatório'
      }
    }
    
    if (fields.includes('password')) {
      if ( (typeof password !== 'undefined') && (password.trim() !== '') ) {
        if (password.length > 8) {
          messages.password = 'A senha não pode ter mais do que 8 caracteres'
        }
      } else {
        messages.password = 'A senha é obrigatória'
      }
    }

    if (fields.includes('documentType') && userType !== 'admin') {
      if ( (typeof documentType !== 'undefined') && (documentType.trim() !== '') ) {
        if (!['CNH', 'RG'].includes(documentType)) {
          messages.documentType = 'O Tipo de Documento só pode ser CNH ou RG'
        }
      } else {
        messages.documentType = 'O Tipo de Documento é obrigatório'
      }
    }

    if (fields.includes('document')) {
      if ( (typeof document !== 'undefined') && (document.trim() !== '') ) {
        if (document.length > 14) {
          messages.document = 'O Documento não pode ter mais do que 14 caracteres'
        }
      } else {
        messages.document = 'O Documento é obrigatório'
      }
    }

    if (fields.includes('cep') && userType !== 'admin') {
      if ( (typeof cep !== 'undefined') && (cep.trim() !== '') ) {
        if (cep.length !== 8) {
          messages.cep = 'O CEP deve ter 8 caracteres'
        }

        if (!regExpNumbers.test(cep)) {
          messages.cep = 'O CEP deve ser numérico'
        }
      } else {
        messages.cep = 'O CEP é obrigatória'
      }
    }

    if (fields.includes('homeAddress') && userType !== 'admin') {
      if ( (typeof homeAddress !== 'undefined') && (homeAddress.trim() !== '') ) {
        if (homeAddress.length > 255) {
          messages.homeAddress = 'O Endereço não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.homeAddress = 'O Endereço é obrigatória'
      }
    }

    if (fields.includes('addressNumber') && userType !== 'admin') {
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

    if (fields.includes('complement') && userType !== 'admin') {
      if ( (typeof complement !== 'undefined') && (complement.trim() !== '') ) {
        if (complement.length > 255) {
          messages.complement = 'O Complemento não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.complement = 'O Complemento é obrigatório'
      }
    }

    if (fields.includes('neighborhood') && userType !== 'admin') {
      if ( (typeof neighborhood !== 'undefined') && (neighborhood.trim() !== '') ) {
        if (neighborhood.length > 255) {
          messages.neighborhood = 'O Bairro não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.neighborhood = 'O Bairro é obrigatório'
      }
    }

    if (fields.includes('city') && userType !== 'admin') {
      if ( (typeof city !== 'undefined') && (city.trim() !== '') ) {
        if (city.length > 255) {
          messages.city = 'A Cidade não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.city = 'A Cidade é obrigatória'
      }
    }

    if (fields.includes('state') && userType !== 'admin') {
      if ( (typeof state !== 'undefined') && (state.trim() !== '') ) {
        if (state.length !== 2) {
          messages.state = 'O Estado deve ter 2 caracteres'
        }
      } else {
        messages.state = 'O Estado é obrigatório'
      }
    }

    if (fields.includes('birth') && userType !== 'admin') {
      if ( (typeof birth !== 'undefined') && (birth.trim() !== '') ) {
        if (new Date(birth) === 'Invalid Date') {
          messages.birth = 'A Data de nascimento não é valida'
        }
        
        const today = new Date()
        const birthDate = new Date(birth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1
        }

        if (age < 17) {
          messages.birth = 'Somente podem se cadastrar maiores de 16 anos'
        }

      } else {
        messages.birth = 'A Data de nascimento é obrigatória'
      }
    }

    if (Object.keys(messages).length > 0) {
      return res.status(400).json(messages)
    }

    next()
  }
}

module.exports = validation
