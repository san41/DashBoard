(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// TODO 
//  Vérifier la présence d'un ID lors de l'ajout dans la base de donnée des villes. si pas d'id tu retry et si le retry echoue tu n'accepte pas
// Car on avait vu qu'une il avait pas charger direct
//  Check the location to adapted translate (fr, en ,)
// verifier le bug de la météo qui change 

module.exports = function($scope,$http, socket, toaster){
  $scope.weatherCount = null;
  // view location div 
  $scope.geolocation = false;
  $scope.weatherList =null;

// Modal variable
  $scope.modal = null;
  $scope.cityList = null;

// Var longitude and latitude 
    var locationLat = "";
    var locationLng = ""; 

// Check the lang. 
  if(currentLanguage == ""){
    var lang = "en";
  }else{
    var lang = currentLanguage;
  }


setInterval(update, 5000);

// update count weather to delete alert message : Add city. 
  updateCount();
  function updateCount(){
    socket.emit('weather/count', function(err, count){
      if(count > 0){
        $scope.weatherCount = count;
      }
      return;
    });
  }

// Get current location and call function to get ciy name
  getCurrentLocation();
  function getCurrentLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        locationLat = position.coords.latitude; 
        locationLng = position.coords.longitude;
        if(locationLat != "" && locationLng !=""){
            // S'il n'y a pas de data dans la base mais la localisation est présente, supression du message d'alerte
            $scope.weatherCount = 0;
            $scope.geolocation = true;
            getWeatherLocation(locationLat, locationLng);
        }
      });
    }else{
       console.log("Location error");
    }
  }

  function update(){     
    if(locationLat != "" && locationLng !=""){
      // S'il n'y a pas de data dans la base mais la localisation est présente, supression du message d'alerte
      $scope.weatherCount = 0;
      $scope.geolocation = true;
      getWeatherLocation(locationLat, locationLng);
    }
  }

   // Get geolocation weather
  function getWeatherLocation(lat, lng){      
      var OpenWeatherMap = {live : 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&mode=json&units=metric&cnt=8&lang='+lang, later: 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'&mode=json&units=metric&cnt=8&lang='+lang };
      var weather = { live:'', later:''}
      $http.get(OpenWeatherMap.live).success(function(responseWeather){
        if(responseWeather.cod == 200){
            responseWeather.weather[0].id = responseWeather.weather[0].id + "-" +responseWeather.weather[0].icon.substr(2,2);
            responseWeather.main['temp'] = Math.round(responseWeather.main['temp']);
            responseWeather.main['temp_min'] = Math.round(responseWeather.main['temp_min']);
            responseWeather.main['temp_max'] = Math.round(responseWeather.main['temp_max']);
            responseWeather.main['humidity'] = Math.round(responseWeather.main['humidity']);
            responseWeather.main['pressure'] = Math.round(responseWeather.main['pressure']); 
            responseWeather.wind['speed'] = Math.round(responseWeather.wind['speed']*3.6);  
            weather.live = responseWeather;   
        }else{
            toaster.pop('error','Erreur',"Impossible de charger la méteo du jour géolocalisé");
        }
      });
      $http.get(OpenWeatherMap.later).success(function(responseWeather){
        if(responseWeather.cod == 200){
            var responseList = responseWeather.list;
            for(var i = 0;  i < responseList.length   ; i++){
                responseList[i].weather[0].id = responseList[i].weather[0].id + "-" +responseList[i].weather[0].icon.substr(2,2);
                responseList[i].pressure = Math.round(responseList[i].pressure);
                responseList[i].temp['day'] = Math.round(responseList[i].temp['day']);
                responseList[i].temp['min'] = Math.round(responseList[i].temp['min']);
                responseList[i].temp['max'] = Math.round(responseList[i].temp['max']);
                responseList[i].speed = Math.round(responseList[i].speed *3.6);
            }
            weather.later = responseList;
            $scope.weatherGeolocation = weather ;
        }else{
            toaster.pop('error','Erreur',"Impossible de charger la méteo géolocalisé");
        }
      });
  }

  // Get weather with location in database  

  function getWeather(){
    var weather = {};
    var incre = 0;
    var incre1 = 0;
    socket.emit('weather/getList', function(data){
      for(i = 0; i < data.length; i++){
        var OpenWeatherMap = {live : 'http://api.openweathermap.org/data/2.5/weather?id='+data[i].cityid+'&mode=json&units=metric&cnt=8&lang='+lang, later: 'http://api.openweathermap.org/data/2.5/forecast/daily?id='+data[i].cityid+'&mode=json&units=metric&cnt=8&lang='+lang };
        $http.get(OpenWeatherMap.live).success(function(responseWeather){
          if(responseWeather.cod  == 200){
            responseWeather.weather[0].id = responseWeather.weather[0].id + "-" +responseWeather.weather[0].icon.substr(2,2);
            responseWeather.wind['speed'] = Math.round(responseWeather.wind['speed'] *3.6);
            responseWeather.main.pressure = Math.round(responseWeather.main.pressure);
            responseWeather.main.temp = Math.round(responseWeather.main.temp);
            responseWeather.main.temp_min = Math.round(responseWeather.main.temp_min);
            responseWeather.main.temp_max = Math.round(responseWeather.main.temp_max);
            data[incre].weatherLive = responseWeather;
          }  
          incre++;       
        });
      }
      for(i = 0; i < data.length; i++){
        var OpenWeatherMap = {live : 'http://api.openweathermap.org/data/2.5/weather?id='+data[i].cityid+'&mode=json&units=metric&cnt=8&lang='+lang, later: 'http://api.openweathermap.org/data/2.5/forecast/daily?id='+data[i].cityid+'&mode=json&units=metric&cnt=8&lang='+lang };
        $http.get(OpenWeatherMap.later).success(function(responseList){
          if(responseList.cod  == 200){
            for(var i = 0;  i < responseList.length   ; i++){
              responseList[i].weather[0].id = responseList[i].weather[0].id + "-" +responseList[i].weather[0].icon.substr(2,2);
              responseList[i].pressure = Math.round(responseList[i].pressure);
              responseList[i].temp['day'] = Math.round(responseList[i].temp['day']);
              responseList[i].temp['min'] = Math.round(responseList[i].temp['min']);
              responseList[i].temp['max'] = Math.round(responseList[i].temp['max']);
              responseList[i].speed = Math.round(responseList[i].speed *3.6);
            }
            data[incre1].weatherLater = responseList; 
          }  
          incre1++;
        });
      }
      $scope.weatherList = data;
      console.log($scope.weatherList)
    });
  }


  setInterval(getWeather, 5000);

//####################################################################
//  Function to add city with the form modal
//####################################################################
  $scope.addWeatherLocation = function(){
    var newLocation = {
      editable : true,
    }
    $scope.modal = newLocation;
  }

// Check and send city data with OpenWeatherMap API. (Name, Country, id, lat, lng)
// When there are ten result returned by the API, the user views a table with the data to add a city.
  $scope.cityName = function(){
    var cityName = $scope.modal.cityName;
    var OpenWeatherMapCityID = 'http://api.openweathermap.org/data/2.5/find?q='+cityName+'&type=like&sort=population&cnt=30&lang=en'
    // To request API, The city name field must be minimum 3 characters.
    if(cityName.length > 2){
      $http.get(OpenWeatherMapCityID).success(function(cityList){
        if(cityList.cod == 200){
          // Show ten cities
          if(cityList.count <= 10){
            $scope.cityList = cityList.list;
          }else{
            $scope.cityList = null;
          }
        }else{
          toaster.pop('error','Error',"API does not sem available, OpenWeatherMap it would be off or call limit ?");
        }
      });
    }else{
      $scope.cityList = null;
    }
  }

// Function to add city id and name in the database :  Check
  $scope.addCity = function(newCityData){
    newCityData.position =  $scope.weatherCount +1;
    socket.emit('weather/addCity', newCityData, function(err, res){
      if(err){
        toaster.pop('error', 'Error', err);
        return;
      }
      toaster.pop('success','Success', 'Location has been added');
      updateCount();
    });
  }

  setInterval(update, 500000);

}
},{}],2:[function(require,module,exports){
var plugin = getPlugin('weather');

plugin.registerController('WeatherController', require('./controller/weather.js'));

plugin.registerRoute('/weather', {
  controller: 'WeatherController',
  templateUrl: 'index.html'
});

plugin.registerMenuItem('Weather', '/weather', 'fa-sun-o');
},{"./controller/weather.js":1}]},{},[2])