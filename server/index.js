var fs  = require('fs');
var express  = require('express');
var app      = express();

var port     = process.env.PORT || 5555;
var host     = process.env.HOST || null;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var domain = require('domain');
var gettext = require('express-gettext')

var server = require('http').Server(app);

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var config = require('../config/config.js');

var MongoStore = require('connect-mongo')(session);


var io = require('socket.io')(server);

var databaseURL = config.database.url;
var mongoOptions = {}; 

if(config.database.user != null && config.database.pass != null){
  mongoOptions.user = config.database.user;
  mongoOptions.pass = config.database.pass;
}

server.listen(port);

// configuration ===============================================================
mongoose.connect(databaseURL, mongoOptions); // connect to our database

var mongoStore = new MongoStore({mongooseConnection: mongoose.connection});

require('../config/passport')(passport); // pass passport for configuration



var passportSocketIo = require("passport.socketio");

var pluginsList = fs.readdirSync('./plugins');
var plugins = [];
for(var i in pluginsList){
  if(fs.lstatSync('./plugins/' + pluginsList[i]).isDirectory())
    plugins.push(pluginsList[i]);
}

//Load plugin passport config
for(var i in plugins){
  var plugin = plugins[i];

  try{
    require('../plugins/' + plugin + '/server/passport')(passport);
  }catch(e){ console.error(e); }

}

fs.writeFileSync('./plugins/plugins.json', JSON.stringify(plugins));

app.set('views', __dirname + '/../client');

// set up our express application
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms



app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
 secret: 'ilovescotchscotfsefeschyscotchscotch', 
 key: 'express.sid',
 store: mongoStore 
 })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//gettext
app.use(gettext(app, {
  directory: __dirname + '/../locales/',
  useAcceptedLanguageHeader: true,
  // fallback: function(text){ return text }
}))


app.use('/static', express.static('./client/static/'));
app.use('/views', express.static('./client/views/'));
app.use('/locales', express.static('./locales'));


for(var i in plugins){
    var pluginName = plugins[i];

    //Client & settings js scripts
    app.use('/plugins/'+pluginName + '/client', express.static('./plugins/' + pluginName + '/client/public'));
    //Client views
    app.use('/plugins/'+pluginName + '/client/views', express.static('./plugins/' + pluginName + '/client/views'));
    //Settings views
    app.use('/plugins/'+pluginName + '/client/settings/views', express.static('./plugins/' + pluginName + '/client/settings/views'));
}


// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
//Load plugin routes
for(var i in plugins){
  var plugin = plugins[i];

  try{
    require('../plugins/' + plugin + '/server/routes')(app, passport);
  }catch(e){
    console.error(e);
  }

}


// Socket.io ==================
//With Socket.io >= 1.0
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  secret: 'ilovescotchscotfsefeschyscotchscotch',
  key: 'express.sid',
  passport: passport,
  store:        mongoStore,        // we NEED to use a sessionstore. no memorystore please
  fail: function(data, message, error, accept){ 
    console.log('fail', message, error);
    accept(null, false);
  },
  sucess: function(){ 
    accept();
  }
}));

var d = domain.create();
d.run(function(){
  require('./sockets.js')(io, plugins, d); 
});


// launch ======================================================================
console.log('The magic happens on port ' + port);


function endApp(){
  console.log();
  console.log("=========== Close app ===========")
  console.log();
  server.close();
  process.exit()
}


process.once('SIGUSR1', endApp);
process.once('SIGUSR2', endApp);

process.once('SIGHUP', endApp);

process.once('SIGINT', endApp);
process.once('SIGTERM', endApp);

// process.on('uncaughtException', function(err) {
//   console.log('Caught exception: ' + err);
//   endApp();
// });
