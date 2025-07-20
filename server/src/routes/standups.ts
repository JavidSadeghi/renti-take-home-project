import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { 
  validateStandup, 
  validateTeamQuery, 
  validateHistoryQuery, 
  validateDateParam,
  validateToken 
} from '../middlewares/validationMiddleware';
import {
  createOrUpdateStandup,
  getTodayStandup,
  getTeamStandups,
  getUserHistory,
  getStandupsByDate
} from '../controllers/standupController';

const router = express.Router();

// All routes require authentication and token validation
router.use(validateToken);
router.use(protect);

// Routes with comprehensive validation
router.post('/', validateStandup, createOrUpdateStandup);
router.get('/today', getTodayStandup);
router.get('/team', validateTeamQuery, getTeamStandups);
router.get('/history', validateHistoryQuery, getUserHistory);
router.get('/date/:date', validateDateParam, getStandupsByDate);

export default router;
