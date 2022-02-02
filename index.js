const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env'});

const app = express();

// Set Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Validating fields
// app.use(expressValidator());

// Set Handlebars as Template Engine
app.engine('handlebars',
    exphbs.engine({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars');

// Static files
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE })
}));

// Alerts & flash messages
app.use(flash());
// Init passport
app.use(passport.initialize());
app.use(passport.session());


// A short middleware to flash messages
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
})

// Router
app.use('/', router());

app.listen(process.env.PORT);