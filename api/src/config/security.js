const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
  routeSecurity (type) {  
    return (req, res, next) => {

      const token = req.headers['x-access-token'] || req.query.token
      if (!token) {
        return res.status(401).json({ auth: false, message: 'Você não está logado, por favor faça login novamente' })
      }

      jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
          return res.status(500).json({ auth: false, message: 'Sua sessão expirou, por favor faça login novamente' })
        } 

        if ((req.params.id) && (req.url.search('users') > -1)) {
          if ((req.params.id != decoded.id) && (decoded.type === 'regular')) {
            return res.status(401).json({ auth: false, message: 'Usuário não tem permissão nesse registro' })
          }
        }

        if (req.url.search('reservations') > -1) {
          if (req.body.user_id) {
            if ((req.body.user_id != decoded.id) && (decoded.type === 'regular')) {
              return res.status(401).json({ auth: false, message: 'Usuário não tem permissão nesse registro' })
            }
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

  async getUserType(req) {
    const token = req.headers['x-access-token'] || req.query.token
    if (token) {
      const decoded = await jwt.verify(token, process.env.SECRET)
      return decoded.type
    }
    return false
  },

  token(id, type) {
    return jwt.sign({ id, type }, process.env.SECRET)
  },

  async encrypt (value){
    return await bcrypt.hash(value, 5)
  },

  async compareCrypt (plain, hash) {
    const res = await bcrypt.compare(plain, hash)
    return res
  }
}