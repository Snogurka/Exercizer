const express = require('express');
const router = express.Router();
const entryModel = require('../models/entry');

//helper function that loads index page and recorded dates
function loadInitialIndexPage(res, msgTxt) {

  //pull all entry dates (select * return dates only, not the _id)
  const query = {};
  const pr_set = {_id:0, entryDate:1};

  entryModel.find(query, pr_set, (err, contents) => {
    
    if (err) throw err;
    res.render('index', {
      entryDates: contents, 
      msg: msgTxt
    });
  });
  
}

//render initial page
router.get('/', async (req, res) => {
  try {
    loadInitialIndexPage(res);
  } catch {
    console.log(err);
  }
})

//submit new entry, remain on the same page
router.post('/', async (req, res) => {
  console.log(req.body.entryDate);
  let newEntry = new entryModel ({
    entryDate: req.body.entryDate,
    muscleGroup: req.body.muscleGroup,
    activity: req.body.activity,
    weight: req.body.weight,
    sets: req.body.sets,
    reps: req.body.reps,
    comments: req.body.comments,
    sleepHours: req.body.sleepHours,
    breakfast: req.body.breakfast,
    lunch: req.body.lunch,
    dinner: req.body.dinner
  });
  try {
    await newEntry.save();
    //todo: try redirect and session storage to avoid resubmitting
    const msgIB = "Entry successfully saved 😅";
    // res.redirect(`/:${msgIB}`);
    loadInitialIndexPage(res, msgIB);
  } catch (err) {
    // res.redirect('/'); 
    loadInitialIndexPage(res, "Error saving an entry 🤔");
  }
})

module.exports = router;