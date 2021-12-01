const express = require('express');
const router = express.Router();
const histEntryModel = require('../models/entry');
const mongoose = require("mongoose");

var start_date, end_date;

//get history for a day
router.get('/', async (req, res) => {
  //if dateTo is specified in query request (URL), then pull a range, otherwise pull just the date, specified in dateFrom
  const searchOptions = req.query.dateTo?
  {$and : 
    [ {entryDate:{"$lte":req.query.dateTo}},
      {entryDate:{"$gte":req.query.dateFrom}}]
  }:{entryDate:req.query.dateFrom};

  //set the global start and end dates, to be used for reloading the screen after delete or update(put)
  start_date = req.query.dateFrom;
  end_date = req.query.dateTo;

  try {
    //pull the data based on searchOptions and sort it by date
    const entries = await histEntryModel.find(searchOptions).sort({"entryDate":1});
    
    res.render('history', {
      outputSet: entries,
      startDate: req.query.dateFrom,
      endDate: req.query.dateTo || end_date
    });

  } catch (err){
    console.log("get history caught an error: " + err);
    res.redirect('/')
  }
})

//edit an entry using id
router.put('/:id', async(req, res) => {

  try {
    await histEntryModel.updateOne({_id: req.params.id}, {
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
    })
  } catch (error) {
    console.log(error);
  }

  //resupply start and end dates to the url of the reloaded history
  const queryString = end_date?`dateFrom=${start_date}&dateTo=${end_date}`:`dateFrom=${start_date}`;
  res.redirect(`/history?${queryString}`);
})

//delete an entry using id parameter
router.delete('/:id', async (req, res) => {

  try {
    await histEntryModel.deleteOne({_id: req.params.id}); 
  } catch (error) {
    console.error(error);
  }
  // ---------------------------------
  //resupply start and end dates to the url of the reloaded history
  const queryString = end_date?`dateFrom=${start_date}&dateTo=${end_date}`:`dateFrom=${start_date}`;
  res.redirect(`/history?${queryString}`);

})


module.exports = router;