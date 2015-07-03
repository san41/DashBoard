var User = require('../models/user.js');
var Widget = require('../models/widget.js');

module.exports = function(io, plugins, domain){

  io.on('connect', function(socket){

    var globalSettings = {};
    for(var i in plugins){
      var plugin = plugins[i];
      var module = require('../plugins/' + plugin + '/server');
      var serverPlugin = module(socket);
      if(module.getSettings != null){
        var pluginSettings = module.getSettings();
        globalSettings[plugin] = pluginSettings;
      }
    }
    
    socket.emit("globalSettings", globalSettings);


    //Profile
    socket.on('getUserData', function(passportUser, callback){
      User.findById(passportUser.id, function(err, user){
        if(err){ callback(err); return; }
        callback(null, user.local);
      });
    });

    socket.on('editProfile', function(userId, userLocal, callback){
      User.findById(userId, function(err, user){
        if(err){ callback(err); return}
        //Merge new data
        var keys = Object.keys(userLocal);
        for(var i in keys){
          var key = keys[i];
          user.local[key] = userLocal[key];
        }
        user.save(callback);
      })
    })

    //Widget 

    socket.on('widget/list', function(callback){
      Widget.find({user:socket.request.user},callback);
    });

    socket.on('widget/save', function(widget, callback){
      widget.user = socket.request.user;
      if(widget._id != null){
        Widget.findById(widget._id, function(err, w){
          w.settings = widget.settings;
          w.colWidth = widget.colWidth;
          w.save(callback);
        });
      }else{
        var w = new Widget(widget);
        w.save(callback);
      }
    })

    //Erreur
    domain.on('error', function(err){
      socket.emit('server-error', err.message, err); 
    });
    process.on('uncaughtException', function(err){
      socket.emit('server-error', err.message, err); 
    });
  });


};