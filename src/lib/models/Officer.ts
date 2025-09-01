import mongoose, { Types } from 'mongoose';

const officerSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
  },

  name: {
    type: String, required:false 
  },
  type: {
    type: String, required:false 
  },
  role: {
    type: String, required:false 
  },
  major: {
    type: String, required:false 
  },
  year: {
    type: String, required:false 
  },
  linkedin: {
    type: String, required:false 
  },
  bio: {
    type: String, required:false 
  },
  photo: {
    type: String, required:false 
  },

}

);

export const Officer = mongoose.models.Officer || mongoose.model('Officer', officerSchema); 