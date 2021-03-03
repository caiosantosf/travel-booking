const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html, bcc) => {
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
      bcc,
      subject,
      html
    })

    return true
  } catch (error) {
    return false
  }

}

module.exports = sendMail