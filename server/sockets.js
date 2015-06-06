module.exports = function(io, plugins, domain){

  io.on('connect', function(socket){

    var globalSettings = {};
    for(var i in plugins){
      var plugin = plugins[i];
      var module = require('../plugins/' + plugin + '/server')
      var serverPlugin = module(socket);
      if(module.getSettings != null){
        var pluginSettings = module.getSettings();
        globalSettings[plugin] = pluginSettings;
      }
    }
    
    socket.emit("globalSettings", globalSettings);


    domain.on('error', function(err){
      socket.emit('server-error', err.message, err); 
    });
    process.on('uncaughtException', function(err){
      socket.emit('server-error', err.message, err); 
    });
  });


}