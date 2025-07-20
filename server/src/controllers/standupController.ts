import { Request, Response } from 'express';
import Standup from '../models/Standup';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// Create or update today's standup
export const createOrUpdateStandup = async (req: AuthRequest, res: Response) => {
  try {
    const { yesterday, today, blockers } = req.body;
    const userId = req.user._id;

    // Get today's date at midnight for comparison
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    // Check if standup already exists for today
    let standup = await Standup.findOne({
      user: userId,
      date: {
        $gte: todayDate,
        $lt: tomorrowDate
      }
    });

    if (standup) {
      // Update existing standup
      standup.yesterday = yesterday;
      standup.today = today;
      standup.blockers = blockers;
      await standup.save();
      res.json(standup);
    } else {
      // Create new standup
      standup = await Standup.create({
        user: userId,
        yesterday,
        today,
        blockers,
        date: new Date()
      });
      res.status(201).json(standup);
    }
  } catch (error) {
    console.error('Error creating/updating standup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get today's standup for the current user
export const getTodayStandup = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const standup = await Standup.findOne({
      user: userId,
      date: {
        $gte: todayDate,
        $lt: tomorrowDate
      }
    });

    res.json(standup || null);
  } catch (error) {
    console.error('Error fetching today\'s standup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get team view - most recent standup from each team member
export const getTeamStandups = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    
    let queryDate = new Date();
    if (date) {
      queryDate = new Date(date as string);
    }
    queryDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(queryDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Get all users and their most recent standup for the specified date
    const users = await User.find({}, 'username email');
    const teamStandups = [];

    for (const user of users) {
      const standup = await Standup.findOne({
        user: user._id,
        date: {
          $gte: queryDate,
          $lt: nextDate
        }
      }).populate('user', 'username email');

      teamStandups.push({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        },
        standup: standup || null
      });
    }

    res.json(teamStandups);
  } catch (error) {
    console.error('Error fetching team standups:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's standup history
export const getUserHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        }
      };
    }

    const standups = await Standup.find({
      user: userId,
      ...dateFilter
    })
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'username email');

    const total = await Standup.countDocuments({
      user: userId,
      ...dateFilter
    });

    res.json({
      standups,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all standups for a specific date (admin/team view)
export const getStandupsByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.params;
    
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(queryDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const standups = await Standup.find({
      date: {
        $gte: queryDate,
        $lt: nextDate
      }
    }).populate('user', 'username email');

    res.json(standups);
  } catch (error) {
    console.error('Error fetching standups by date:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
