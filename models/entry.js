const mongoose = require("mongoose");

const histSchema = new mongoose.Schema({
entryDate: { 
    type: Date, 
    required: true
    ,unique: true
  },
  muscleGroup: {
    type: Array, 
    required: true
  },
  activity: {
    type: Array, 
    required: true
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