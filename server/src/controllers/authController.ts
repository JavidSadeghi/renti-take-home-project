import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email }) as IUser;
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) as IUser;
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};