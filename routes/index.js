const express = require('express');
const router = express.Router();
// const Categories = require('../models/category');
const entryModel = require('../models/entry');

//helper function that loads index page and recorded dates
function loadInitialIndexPage(res, msgTxt) {

  //pull all entry dates (select * return dates only)
  const query = {};
  const pr_set = {_id:0,entryDate:1};

  entryModel.find(query,pr_set, (err, contents) => {
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
    res.redirect('/');
    // loadInitialIndexPage(res, "Entry successfully saved 😅");
  } catch (err) {
    // res.redirect('/'); 
    loadInitialIndexPage(res, "Error saving an entry 🤔");
  }
})

//delete an entry
// router.delete('/history/delete', (req, res) => {
//   console.log("hist/delete")
// })

// router.delete('/delete', async(req, res) => {
//   const o_id =  new mongo.ObjectId(req.body.id);
//   const query = {"_id":o_id};
//   console.log("query: ", query)
//   entryModel.deleteOne(query, (err, res) => {
//     if (err) throw err;
//     console.log(res);
//     res.redirect('/');
//   })
// })

module.exports = router;