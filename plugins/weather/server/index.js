var Weather = require('./models/weather.js');

module.exports = function(socket){

  // Add location on the database
  socket.on('weather/addCity', function(data, callback){
    // check if the city id is already on the database 
  	Weather.findOne({'user': socket.request.user, 'cityid' : data.id}, 'name', function(err, dataFind){
      // if data is not avaible on the database
  		if(dataFind == null){
  			var weather = new Weather({cityid : data.id, name : data.name});
  			weather.user = socket.request.user;
  			weather.save(callback);
  		}else{
  			callback('Location is already in database');
  		}
  	});
  });

  // Send data on the client side 
  socket.on('weather/getList', function(callback){
    Weather.find({user:socket.request.user}, function(err, data){
      // send data
      callback(data);
    });
  });



// 
//    Settings 
// 

// Delete 

  socket.on('weather/settings/delete', function(weatherRemove, callback){
    Weather.findOneAndRemove({_id:weatherRemove._id, user:socket.request.user}, callback);
  });

}
