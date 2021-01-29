const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
  routeSecurity (type) {  
    return (req, res, next) => {

      const token = req.headers['x-access-token'] || req.query.token
      if (!token) {
        return res.status(401).json({ auth: false, message: 'Requisição sem Token de autenticação' })
      }

      jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
          return res.status(500).json({ auth: false, message: 'Não foi possível validar o Token de autenticação' })
        } 

        if ((req.params.id) && (req.url.search('user') > -1)) {
          if ((req.params.id != decoded.id) && (decoded.type === 'regular')) {
            return res.status(401).json({ auth: false, message: 'Usuário não tem permissão nesse registro' })
          }
        }

        if (!type.includes(decoded.type)) {
          return res.status(401).json({ auth: false, message: 'Usuário não tem permissão para essa ação' })
        }

        req.userId = decoded.id
        req.userType = decoded.type
        
        next()
      })
    }
  },

  token(id, type) {
    return jwt.sign({ id, type }, process.env.SECRET, { expiresIn: 86400 })
  },

  async encrypt (value){
    return await bcrypt.hash(value, 5)
  },

  async compareCrypt (plain, hash) {
    const res = await bcrypt.compare(plain, hash)
    return res
  }
}