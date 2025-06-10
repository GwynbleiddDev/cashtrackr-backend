import { Request, Response, NextFunction } from "express"
import { param, validationResult, body } from "express-validator"
import Budget from "../models/Budget"


declare global {
  namespace Express {
    interface Request {
      budget?: Budget
    }
  }
}


export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {

  await param('budgetId').isInt().withMessage('ID no válido').bail().custom(value => value > 0).withMessage('ID no válido').bail().run(req)

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  next()
}


export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { budgetId } = req.params
    const budget = await Budget.findByPk(budgetId)

    if(!budget) {
      const error = new Error('Presupuesto no encontrado')
      res.status(404).json({error: error.message})
      return
    }
    req.budget = budget

    next()

  } catch (error) {
    res.status(500).json({error: 'Hubo un error'})
    return
  }
}


export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
  
  await body('name').notEmpty().withMessage('El nombre del presupuesto es obligatorio').run(req)
  await body('amount').notEmpty().withMessage('La cantidad del presupuesto es obligatoria').isNumeric().withMessage('Cantidad no Válida').custom(value => value > 0 ).withMessage('El Presupuesto debe ser mayor a 0').run(req)
  
  next()
}


export const hasAccess = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.budget) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  if (req.budget.userId !== req.user.id) {
    return res.status(401).json({ error: 'Acción no válida' });
  }
  next();
}
