import mongoose, { Types } from 'mongoose';

const projectSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photos: {
    type: [String], // Array of strings (e.g., URLs or file paths)
    required: false,
  },
});

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);