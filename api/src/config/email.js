const nodemailer = require("nodemailer");

const sendMail = async (to, link) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASS, 
    }
  })

  try {
    await transporter.sendMail({
      from: `Sistema de Reserva de Passagens <${ process.env.EMAIL }>`, 
      to,
      subject: "Recuperação de Senha",
      html: `Acesse o link a seguir para cadastrar uma nova senha: <a href="${link}">Clique Aqui</a>`
    })

    return true
  } catch (error) {
    return false
  }

}

module.exports = sendMail