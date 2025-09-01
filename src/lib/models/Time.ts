import mongoose, { Types } from 'mongoose';

const timeSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  
});

export const Time = mongoose.models.Time || mongoose.model('Time', timeSchema);