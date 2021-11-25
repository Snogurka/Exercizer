const mongoose = require("mongoose");

const histSchema = new mongoose.Schema({
  athleteName: {
    type: String, 
    required: true,
    default: 'the_athlete'
  },
  entryDate: { 
    type: Date, 
    required: true, 
    unique: true
  },
  muscleGroup: {
    type: Array, 
    required: true,
    trim: true
  },
  activity: {
    type: Array, 
    required: true,
    trim: true
  },
  weight: {
    type: Array, 
    required: false
  },
  sets: {
    type: Array, 
    required: true
  },
  reps: {
    type: Array, 
    required: true
  },
  comments: {
    type: Array, 
    required: false,
    trim: true
  },
  sleepHours: {
    type: Number, 
    required: false
  },
  breakfast: {
    type: String, 
    required: false
  },
  lunch: {
    type: String, 
    required: false
  },
  dinner: {
    type: String, 
    required: false
  }
});

//The name below, History, is used as a table (collection) name in lower case and plural
module.exports = mongoose.model('History', histSchema);