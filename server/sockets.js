module.exports = function(io, plugins, domain){

  io.on('connect', function(socket){

    var globalSettings = {};
    for(var i in plugins){
      var plugin = plugins[i];
      var serverPlugin = require('../plugins/' + plugin + '/server')(socket);
      var pluginSettings = require('../plugins/' + plugin + '/server').getSettings();
      globalSettings[plugin] = pluginSettings;
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