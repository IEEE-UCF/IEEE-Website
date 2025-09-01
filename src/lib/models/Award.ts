import mongoose, { Types } from 'mongoose';

const awardSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
    required: false,
  },
  category: {
    type: String,
    required: false, 
  },
  event: {
    type: String,
    required: false, 
  },
  place: {
    type: String,
    required: false,
  },
  team: {
    type: Object,
    required: false, 
    properties: {
      person: {
        type: String,
        required: false,
      },
    },
  },
});

export const Award = mongoose.models.Award || mongoose.model('Award', awardSchema);