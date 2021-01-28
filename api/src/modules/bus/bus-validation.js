const validation = (fields) => {
  return (req, res, next) => {
    const { id, description, layout } = req.body
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

    if (fields.includes('layout')) {
      if ( (typeof layout !== 'undefined') ) {
        if (!Array.isArray(layout.seats)) {
          messages.layout = 'Há algo errado no Layout, por favor comece a configuração novamente'
        }
      } else {
        messages.layout = 'O Layout é obrigatório'
      }
    }
    
    if (Object.keys(messages).length > 0) {
      return res.status(400).json(messages)
    }

    next()
  }
}

module.exports = validation
