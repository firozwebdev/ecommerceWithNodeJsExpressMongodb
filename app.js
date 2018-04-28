var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser')
var session = require('express-session')
var expressValidator = require('express-validator');

//connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to MongoDB');
});

//init app
var app = express();

//view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//Set global errors variable
app.locals.errors = null;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }

}));

//Express message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//set routes
var pages = require('./routes/pages.js');
var adminpages = require('./routes/adminpages.js');

app.use('/admin/pages',adminpages);
app.use('/',pages);

//start server
var port = 3000;
app.listen(port,function(){
    console.log("Server starting " +port );
});