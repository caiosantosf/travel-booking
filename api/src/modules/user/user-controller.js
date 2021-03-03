const db = require('../../database/connection')
const { encrypt, compareCrypt, token, getUserType } = require('../../config/security')
const sendMail = require('../../config/email')

const dbErrors = error => {
  let message = { message : 'Ocorreu um erro não identificado', error}
  
  if (error.hasOwnProperty('constraint')) {
    if (error.constraint === 'users_cpf_unique') {
      message = { cpf : 'CPF já cadastrado!' }
    }
    if (error.constraint === 'users_phone_unique') {
      message = { phone : 'Telefone já cadastrado!' }
    }
    if (error.constraint === 'users_email_unique') {
      message = { email : 'Email já cadastrado!' }
    }
  }
  return message
}

module.exports = {

  async auth (req, res) {
    const { cpf , password : reqPassword } = req.body
    const user = await db('users').where({ cpf })

    if (user.length) {
      const { id , password: dbPassword, type } = user[0]

      if (await compareCrypt(reqPassword, dbPassword)) {

        const userAdmin = await db('users').where({ type: 'admin' })
        const { phone: companyPhone, name: companyName } = userAdmin[0]

        return res.status(200).json({ auth: true, token: token(id, type), id, type, companyName, companyPhone })
      }
      return res.status(400).json({ password: 'Senha inválida' })
    }

    if (req.originalUrl.search('admin')) {
      const user = await db('users').where({ type : 'admin' })

      if (!user.length) {
        const password = await encrypt(reqPassword)
        const type = 'admin'
        try {
          const id = await db('users').insert({
            name : '',
            cpf,
            password,
            type
          }).returning('id')

          await db('adminData').insert({
            user_id : id[0],
            infinitePay: true,
            companyPayment: false,
            companyPaymentLink: ''
          })
    
          return res.status(201).json({ id: id[0], type, token: token(id, type) })
        } catch (error) {
          const message = dbErrors(error)
          return res.status(500).json(message)
        }
      }
    }

    return res.status(404).json({ cpf: 'CPF não cadastrado' })
  },

  async getMany (req, res) {
    const { currentPage } = req.headers
    const users = await db('users')
                          .whereNot({ 'type' : 'admin'})
                          .orderBy('name')
                          .paginate({ perPage: 10, currentPage, isLengthAware: true  })

    if (users.hasOwnProperty('data')) {
      if (users.data.length) {
        return res.status(200).json(users)
      }
    }
    return res.status(204).json({ message: 'Não existem usuários cadastrados' })
  },

  async getOne (req, res) {
    const { id } = req.params
    const user = await db('users').where({ id })

    if (user.length) {
      return res.status(200).json(user[0])
    }
    return res.status(404).json({ message: 'Usuário não encontrado'})
  },

  async getAdminData (req, res) {
    const admin = await db('adminData').select('*')

    if (admin.length) {
      return res.status(200).json(admin[0])
    }
    return res.status(404).json({ message: 'Dados não encontrados'})
  },

  async post (req, res) {
    const data = req.body
    data.type = 'regular'
    data.password = await encrypt(data.password)
    try {
      const id = await db('users').insert(data).returning('id')
      return res.status(201).json({ id: id[0], token: token(id, 'regular'), type: 'regular' })
    } catch (error) {
      const message = dbErrors(error)
      return res.status(400).json(message)
    }
  },

  async putAdminData (req, res) {
    const { id } = req.params
    let data = req.body

    try {
      const result = await db('adminData').where({ user_id: id }).update({ ...data })

      if (result) {
        return res.status(200).json({ message : 'Dados do administrador alterados'})
      }
    } catch (error) {
      const message = dbErrors(error)
      return res.status(500).json(message)   
    }
  },

  async put (req, res) {
    const { id } = req.params
    let data = req.body
    const { password : reqPassword, newPassword } = data

    try {

      const user = await db('users').where({ id })

      if (user.length) {
        const { password: dbPassword } = user[0]

        if (await compareCrypt(reqPassword, dbPassword)) {

          if (newPassword) {
            data.password = await encrypt(data.newPassword)
          } else {
            data.password = await encrypt(data.password)
          }

          delete data.newPassword

          const result = await db('users').where({ id }).update({ id, ...data })

          if (result) {
            return res.status(200).json({ message : 'Usuário alterado'})
          }
        } else {
          return res.status(404).json({ password: 'Senha atual está incorreta'})
        }
      }

      return res.status(404).json({ message: 'Usuário não encontrado'})
    } catch (error) {
      const message = dbErrors(error)
      return res.status(500).json(message)     
    }
  },

  async emailResetPassword (req, res) {
    const { email } = req.body
    const user = await db('users').where({ email })
    
    if (user.length) {
      const { id } = user[0]
      const domain = process.env.APP_LOCATION
      const link = `${domain}redefine-senha/${id}?token=${token(id)}`
      const emailContent = `Acesse o link a seguir para cadastrar uma nova senha: <a href="${link}">Clique Aqui</a>`

      if (await sendMail(email, 'Recuperação de Senha', emailContent, '')) {
        return res.status(200).json({ email: 'Enviamos um link de recuperação de senha para o seu email. Verifique se não foi para o Spam ou lixo eletrônico'})
      }
      return res.status(400).json({ email: 'Houve um problema ao enviar o email de recuperação de senha. Contate a empresa.'})
    }
    return res.status(404).json({ email: 'Não foi encontrado nenhum Usuário com esse email'})
    
  },

  async destroy (req, res) {
    const { id } = req.params
    const result = await db('users').where({ id }).del()

    if (result) {
      return res.status(200).json({ message: 'Usuário excluído'})
    }
    return res.status(404).json({ message: 'Usuário não encontrado'})
  }
}
