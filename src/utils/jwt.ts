import jwt, { JwtPayload } from "jsonwebtoken";


export const generateJWT = (id: JwtPayload): string => {
  if(!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
  return token
}