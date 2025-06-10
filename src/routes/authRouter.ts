import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";


const router = Router()

router.use(limiter)


router.post('/create-account',
  body('name').notEmpty().withMessage('El nombre no puede ir vacio'), 
  body('password').isLength({min: 8}).withMessage('El Password debe tener minimo 8 caracteres'), 
  body('email').isEmail().withMessage('Email no válido'),
  handleInputErrors, 
  AuthController.createAccount
)

router.post('/confirm-account',
  body('token').isLength({min: 6, max: 6}).withMessage('Token no válido'),
  handleInputErrors,
  AuthController.confirmAccount
)

router.post('/login',
  body('email').isEmail().withMessage('Email no válido'),
  body('password').isLength({min: 8}).withMessage('El password es obligatorio'),
  handleInputErrors,
  AuthController.login
)

router.post('/forgot-password',
  body('email').isEmail().withMessage('Email no válido'),
  handleInputErrors,
  AuthController.forgotPassword
)

router.post('validate-token',
  body('token').notEmpty().isLength({min:6, max:6}).withMessage('Token no valido'),
  handleInputErrors,
  AuthController.validateToken
)

router.post('/reset-password/:token',
  param('token').notEmpty().isLength({min:6, max:6}).withMessage('Token no valido'),
  body('password').isLength({min: 8}).withMessage('El password es obligatorio'),
  handleInputErrors,
  AuthController.resetPasswordWithToken
)

router.get('/user', 
  authenticate,
  AuthController.user
)

router.put('/user',
  authenticate,
  body('name').notEmpty().withMessage('El nombre de usuario no puede ir vacio'),
  body('email').isEmail().withMessage('Email no válido'),
  handleInputErrors,
  AuthController.updateUser
)

router.post('/update-password',
  authenticate,
  body('current_password').notEmpty().withMessage('El password actual es obligatorio'),
  body('password').isLength({min: 8}).withMessage('El nuevo password debe contener minimo 8 caracteres'),
  handleInputErrors,
  AuthController.updateCurrentPassword
)

router.post('/check-password',
  authenticate,
  body('password').notEmpty().withMessage('El password actual es obligatorio'),
  handleInputErrors,
  AuthController.checkPassword
)


export default router