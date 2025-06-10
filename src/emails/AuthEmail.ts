import { transport } from "../config/nodemailer"

type EmailType = {
  name: string
  email: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: 'CashTrackr <admin@cashtrackr.com>',
      to: user.email,
      subject: 'CashTrackr - Confirma tu cuenta',
      html: `
        <p>Hola: ${user.name}, has creado tu cuenta en CashTraackr, ya esta casi lista</p>
        <p>Visita el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
        <p>e ingresa el código: <b>${user.token}</b></p>
      `
    })
  }
  
  
  static sendPasswordResetToken = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: 'CashTrackr <admin@cashtrackr.com>',
      to: user.email,
      subject: 'CashTrackr - Reestablece tu password',
      html: `
        <p>Hola: ${user.name}, has solicitado reestablecer tu password</p>
        <p>Visita el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
        <p>e ingresa el código: <b>${user.token}</b></p>
      `
    })
  }
}