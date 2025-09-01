import mongoose, { Types } from 'mongoose';

const eventSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
  },
  committee: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false, 
  },
  time: {
    type: Date,
    required: false, 
  },
  address: {
    type: String,
    required: false, 
  },
  description: {
    type: String,
    required: false,
  },
  flyer: {
    type: String,
    required: false,
  },
  rsvp: {
    type: String,
    required: false,
  },
  photos: {
    type: Object,
    required: false,
    properties: {
      type: {
        type: String,
        required: false,
      },
    },
  },
});

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);