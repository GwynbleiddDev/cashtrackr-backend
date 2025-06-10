import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'


declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  
  const bearer = req.headers.authorization
  if(!bearer) {
    const error = new Error('No Autorizado')
    res.status(401).json({error: error.message})
    return
  }

  const [, token] = bearer.split(' ')
  if(!token) {
    const error = new Error('Token no válido')
    res.status(401).json({error: error.message})
    return
  }

  try {
    if(!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(typeof decoded === 'object' && decoded.id) {
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email']
      })
      if (!user) {
        res.status(401).json({ error: 'Usuario no encontrado' })
        return
      }
      req.user = user
      next()
    }
  } catch (error) {
    res.status(500).json({error: 'Token no válido'})
  }
}