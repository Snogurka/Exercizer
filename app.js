if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')

//new bodyParser syntax
//instead of 
// const bodyParser = require('body-parser')
//use
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.use(expressLayouts);
app.use(express.static('styles'));
app.use(express.static('scripts'));

app.use(express.urlencoded({extended:false}));

app.use(methodOverride('_method'));

const mongoose = require('mongoose');
//added autoIndex: false on 11/22/21, per mongoose recommendations: Mongoose will call createIndex for each index sequentially, and emit an 'index' event on the model when all the createIndex calls succeeded or when there was an error. While nice for development, it is recommended this behavior be disabled in production since index creation can cause a significant performance impact.
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false});
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('connected via mongoose'));

const indexRouter = require('./routes/index');
const historyRouter = require('./routes/histories');

app.use('/', indexRouter);
app.use('/history', historyRouter);

app.listen(process.env.PORT || 3002);