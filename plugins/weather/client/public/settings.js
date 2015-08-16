(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($scope, socket, $location, $routeParams, toaster){
  $scope.weatherList = [];

  // Request weather list added in database by user 
  socket.emit('weather/getList', function(list){
    if(list.length < 1){
      toaster.pop('error', 'Error', 'No city added to the database.');
    }
    $scope.weatherList  =  list;
  });

  // Delete weather location

  $scope.delete =  function(weather){
    if(!confirm('Are you sure to delete the '+ weather.name+' city ?')){
      return;
    }
    socket.emit('weather/settings/delete', weather, function(err){
      if(err){
        toaster.pop('error','Error','Cannot delete this weather');
        return;
      }
      var index = -1; 
      for(var i in $scope.weatherList){
        var scopeweatherList = $scope.weatherList[i];
        if(scopeweatherList._id == weather._id){
          index = i;
        }
      }
      if(index > -1){
        $scope.weatherList.splice(index,1);
      }
    });
  }
}
},{}],2:[function(require,module,exports){
var settings = getPlugin("weather").settings;


settings.registerController("WeatherSettingController", require('./controller/weather'));


settings.registerRoute('/weather',{
  controller :  'WeatherSettingController',
  templateUrl :  'index.html'
});

settings.registerSettingsItem('Weather', '/weather', 'fa-sun-o');
},{"./controller/weather":1}]},{},[2])