if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')

//new bodyParser syntax
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.use(expressLayouts);
app.use(express.static('styles'));
app.use(express.static('scripts'));
app.use(express.urlencoded({extended:false}));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', error => console.log(error, 'error connecting via mongoose'));
db.once('open', () => console.log('connected via mongoose'));

const indexRouter = require('./routes/index');
const historyRouter = require('./routes/histories');

app.use('/', indexRouter);
app.use('/history', historyRouter);

app.listen(process.env.PORT || 3002);