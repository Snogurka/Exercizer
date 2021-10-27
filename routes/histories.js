const express = require('express');
const router = express.Router();
const histEntryModel = require('../models/entry');

//get all history (range) - response to a change in DateTo field

//get history for a day
router.get('/', async (req, res) => {

  //if dateTo is specified in query request (URL), then pull a range, otherwise pull just the date, specified in dateFrom
  const searchOptions = req.query.dateTo?
  {$and : 
    [ {entryDate:{"$lte":req.query.dateTo}},
      {entryDate:{"$gte":req.query.dateFrom}}]
  }:
  {entryDate:req.query.dateFrom};

  //the dateFormat options below are to be used with .toLocaleDateString('en-US', dateFormat, that keeps returning previous day; needs work;
  //const dateFormat = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  try {
    
    const entries = await histEntryModel.find(searchOptions).sort({"entryDate":1});
    
    res.render('history', {
      outputSet: entries,
      startDate: req.query.dateFrom,
      endDate: req.query.dateTo

      //, displayDate:new Date(new Date(searchOptions.entryDate).toUTCString()).toLocaleDateString('en-US', dateFormat) 

      //, displayDate: new Date(searchOptions.entryDate).toUTCString().split(/ \d\d:/g)[0]
    });
    
  } catch {
    console.log("get history for a day, caught an error");
    res.redirect('/')
  }
})

//edit a historical entry

module.exports = router;