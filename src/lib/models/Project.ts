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
  lead: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  hardware: {
    type: [String],
    required: true,
  },
  software: {
    type: [String],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  photo: {
    type: String, // Array of strings (e.g., URLs or file paths)
    required: false,
  },
});

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);