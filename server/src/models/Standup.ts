import mongoose from 'mongoose';

const standupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  yesterday: { type: String, required: true },
  today: { type: String, required: true },
  blockers: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Standup', standupSchema);