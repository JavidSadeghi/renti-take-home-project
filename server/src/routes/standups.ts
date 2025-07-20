import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/authMiddleware';
import {
  createOrUpdateStandup,
  getTodayStandup,
  getTeamStandups,
  getUserHistory,
  getStandupsByDate
} from '../controllers/standupController';

const router = express.Router();

// Validation middleware
const validateStandup = [
  body('yesterday')
    .trim()
    .notEmpty()
    .withMessage('Yesterday field is required'),
  body('today')
    .trim()
    .notEmpty()
    .withMessage('Today field is required'),
  body('blockers')
    .optional()
    .trim()
];

// All routes require authentication
router.use(protect);

// Routes
router.post('/', validateStandup, createOrUpdateStandup);
router.get('/today', getTodayStandup);
router.get('/team', getTeamStandups);
router.get('/history', getUserHistory);
router.get('/date/:date', getStandupsByDate);

export default router;
