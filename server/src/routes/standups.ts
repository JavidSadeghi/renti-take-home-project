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

/**
 * @swagger
 * /standups:
 *   post:
 *     summary: Create or update today's standup
 *     tags: [Standups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - yesterday
 *               - today
 *             properties:
 *               yesterday:
 *                 type: string
 *                 maxLength: 1000
 *                 description: What you accomplished yesterday
 *               today:
 *                 type: string
 *                 maxLength: 1000
 *                 description: What you plan to do today
 *               blockers:
 *                 type: string
 *                 maxLength: 500
 *                 description: Any blockers or challenges (optional)
 *     responses:
 *       200:
 *         description: Standup updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Standup'
 *       201:
 *         description: Standup created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Standup'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', validateStandup, createOrUpdateStandup);

/**
 * @swagger
 * /standups/today:
 *   get:
 *     summary: Get today's standup for the current user
 *     tags: [Standups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's standup retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Standup'
 *                 - type: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/today', getTodayStandup);

/**
 * @swagger
 * /standups/team:
 *   get:
 *     summary: Get team standups for a specific date
 *     tags: [Standups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         description: Date to filter standups (YYYY-MM-DD format)
 *     responses:
 *       200:
 *         description: Team standups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamStandup'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/team', validateTeamQuery, getTeamStandups);

/**
 * @swagger
 * /standups/history:
 *   get:
 *     summary: Get user's standup history with pagination
 *     tags: [Standups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Start date for filtering (YYYY-MM-DD format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: End date for filtering (YYYY-MM-DD format)
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 standups:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Standup'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/history', validateHistoryQuery, getUserHistory);

/**
 * @swagger
 * /standups/date/{date}:
 *   get:
 *     summary: Get all standups for a specific date
 *     tags: [Standups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         description: Date to get standups for (YYYY-MM-DD format)
 *     responses:
 *       200:
 *         description: Standups for the date retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Standup'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/date/:date', validateDateParam, getStandupsByDate);

export default router;
