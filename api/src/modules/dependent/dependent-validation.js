const validation = (fields) => {
  return (req, res, next) => {
    const { name, documentType, document, birth } = req.body
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

    if (fields.includes('name')) {
      if ( (typeof name !== 'undefined') && (name.trim() !== '') ) {
        if (name.length > 255) {
          messages.name = 'O Nome não pode ter mais do que 255 caracteres'
        }
      } else {
        messages.name = 'O Nome é obrigatório'
      }
    }

    if (fields.includes('documentType')) {
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

    if (fields.includes('birth')) {
      if ( (typeof birth !== 'undefined') && (birth.trim() !== '') ) {
        if (new Date(birth) === 'Invalid Date') {
          messages.birth = 'A Data de nascimento não é valida'
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
