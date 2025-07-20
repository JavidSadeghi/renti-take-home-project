import { Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult } from 'express-validator';

// Custom error response interface
interface ValidationError {
  field: string;
  message: string;
}

// Middleware to handle validation results
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors
    });
  }
  
  next();
};

// Authentication validation rules
export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .escape(),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .escape(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .escape(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Standup validation rules
export const validateStandup = [
  body('yesterday')
    .trim()
    .notEmpty()
    .withMessage('Yesterday field is required')
    .isLength({ max: 1000 })
    .withMessage('Yesterday field cannot exceed 1000 characters'),
  
  body('today')
    .trim()
    .notEmpty()
    .withMessage('Today field is required')
    .isLength({ max: 1000 })
    .withMessage('Today field cannot exceed 1000 characters'),
  
  body('blockers')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Blockers field cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Query parameter validation for team standups
export const validateTeamQuery = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  
  handleValidationErrors
];

// Query parameter validation for history
export const validateHistoryQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt(),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format (YYYY-MM-DD)'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in ISO 8601 format (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const startDate = req.query?.startDate;
      if (startDate && new Date(value) <= new Date(startDate as string)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Parameter validation for date-specific endpoints
export const validateDateParam = [
  param('date')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  
  handleValidationErrors
];

// JWT token validation middleware
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required',
      errors: [{ field: 'authorization', message: 'Authorization header is missing' }]
    });
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token format',
      errors: [{ field: 'authorization', message: 'Token must be in Bearer format' }]
    });
  }
  
  const token = authHeader.substring(7);
  
  if (!token || token.trim().length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Token is empty',
      errors: [{ field: 'authorization', message: 'Token cannot be empty' }]
    });
  }
  
  next();
}; 