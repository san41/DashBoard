// TODO 
//  Change metre/s en Km/h
//  Check the location to adapted translate (fr, en ,)

module.exports = function($scope, $http,socket, toaster){

  $scope.loadData = true;
  $scope.modal = null;

$scope.weatherCount = 1;
$scope.geolocation = "Location in progress";


  // Var to modal 
  $scope.cityList = null;

// Var longitude and latitude 
var locationLat;
var locationLng; 
var lang = "en";

// Get goelocation 

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.geolocation = "Loading";
      console.log("Get city Name ");
      getGeolocationCityName(position.coords);
      lat = position.coords.latitude; 
      lng = position.coords.longitude;
    });
  }

  // prov 

  function update(){
    console.log("update");
      if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.geolocation = "Loading";
      console.log("Get city Name ");
      getGeolocationCityName(position.coords);
      lat = position.coords.latitude; 
      lng = position.coords.longitude;
    });
  }
  }


  function getGeolocationCityName(position){
    console.log("exc");
    $scope.loadData = true;
    var city; 
    locationLat = position.latitude; 
    locationLng = position.longitude;
    // Load API Google Map with Latitude and Longitude
    var GoogleMap = 'http://maps.google.com/maps/api/geocode/json?latlng='+locationLat+','+locationLng+'&sensor=false';
    // Get Datas
    $http.get(GoogleMap).success(function(response){
      if(response.status == "OK"){
        // Put City name in var
        var city = response.results[1].formatted_address;
        $scope.geolocation = city;
        getWeatherLocation(locationLat, locationLng);
        getWeatherPrediction(locationLat, locationLng);
        return 
      }
    });
  }


  // Get live weather 

  function getWeatherLocation(lat, lng){
    var weatherLive = [];

    // Load open weather map API to load live weather
    var OpenWeahterMap = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&mode=json&units=metric&cnt=8&lang='+lang+'';
    console.log(OpenWeahterMap);
    // Load prediction weather 
    var OpenWeahterMapPrediction = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'&mode=json&units=metric&cnt=8&lang='+lang+'';
    $http.get(OpenWeahterMap).success(function(responseWeatherToday){
      //Load and convert temp data 
      weatherLive['tempT'] = Math.round(responseWeatherToday.main['temp']);
      weatherLive['temp_minT'] = Math.round(responseWeatherToday.main['temp_min']);
      weatherLive['temp_maxT'] = Math.round(responseWeatherToday.main['temp_max']);
      weatherLive['humidityT'] = Math.round(responseWeatherToday.main['humidity']);
      weatherLive['pressureT'] = Math.round(responseWeatherToday.main['pressure']); 
      weatherLive['descriptionT'] = responseWeatherToday.weather[0].description; 
      weatherLive['icon'] = responseWeatherToday.weather[0].icon;
      weatherLive['speedWindT'] = Math.round(responseWeatherToday.wind['speed']*3.6);  
      $scope.weatherGeolocation = weatherLive;
      console.log($scope.weatherGeolocation);
      console.log("--------");
      console.log(weatherLive); 
      $scope.loadData = false;
    });
  }


  function getWeatherPrediction(lat, lng){
    var WeatherPrediction = [];
    var responseList = [];
    // Load open weather map API to load prediction weather
    var OpenWeahterMap = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'&mode=json&units=metric&cnt=8';
      console.log(OpenWeahterMap);
    $http.get(OpenWeahterMap).success(function(responseWeatherPrediction){
      responseList = responseWeatherPrediction.list;
      console.log(responseList);
      for(var i = 0;  i < responseList.length   ; i++){
        responseList[i].pressure = Math.round(responseList[i].pressure);
        responseList[i].temp['day'] = Math.round(responseList[i].temp['day']);
        responseList[i].temp['min'] = Math.round(responseList[i].temp['min']);
        responseList[i].temp['max'] = Math.round(responseList[i].temp['max']);
        responseList[i].speed = Math.round(responseList[i].speed *3.6);
      }
      $scope.weatherGeolocationT = responseList;
    });
  }

  $scope.addWeatherLocation = function(){
    var newLocation = {
      editable : true,
    }
    $scope.modal = newLocation;
  }

setInterval(update, 500000);
//  Auto update

// Passer a select2

// Check and send city data with OpenWeatherMap API. (Name, Country, id, lat, lng)
// When there are ten result returned by the API, the user views a table with the data to add a city.
  $scope.cityName = function(){
    var cityName = $scope.modal.cityName;
    var OpenWeahterMapCityID = 'http://api.openweathermap.org/data/2.5/find?q='+cityName+'&type=like&sort=population&cnt=30&lang=en'
    // To request API, The city name field must be minimum 3 characters.
    if(cityName.length > 2){
    // Get city List to send
      $http.get(OpenWeahterMapCityID).success(function(cityList){
        if(cityList.cod == 200){
          // Show a maximum of five cities
          if(cityList.count <= 10){
            $scope.cityList = cityList.list;
            console.log($scope.cityList)
          }else{
            $scope.cityList = null;
          }
        }else{
          toaster.pop('error','Error',"The database is not avaible, OWM is down ?");
        }
      });
    // reset tab with the reset input
    }else{
      $scope.cityList = null;
    }
  }



  // link to search city data http://api.openweathermap.org/data/2.5/find?callback=?&q=yvoy&type=like&sort=population&cnt=30&lang=en

//   $scope.modalNewFeed = function (){
//     var newFeed = $scope.modal;
//     // Check all information : TODO 
//     // Change et evol information
//   if(newFeed.name ==  null || newFeed.name == "" ){
//     toaster.pop('error', 'Error', 'Title is empty !');
//     return;
//   }
//   if(newFeed.link ==  null || newFeed.link == "" ){
//     toaster.pop('error', 'Error', 'Link is empty or not valid !');
//     return;
//   }
//   if(newFeed.category ==  null || newFeed.category == "" ){
//     // todo add list
//     toaster.pop('error', 'Error', 'Category is empty or not valid !');
//     return;   
//   }

//     // Check
//     socket.emit('feed/addfeed',newFeed, function(err, res){
//       if(err){
//         toaster.pop('error', 'Error', err);
//         return;
//       }
//       toaster.pop('success', 'Success', 'RSS feed has been added');
//       $scope.modal = null;
//       $scope.rssfeedCount = 1;
//       updateData();
//     });
//   }

//   socket.emit('feed/list', function(err, list){
//     if(list > 0){
//       $scope.rssfeedCount = list;
//       updateData();
//     }else{ 
//       $scope.rssfeedCount = 0;
//     }
//   });

//   function updateData(){
//     socket.emit('feed/read', function(result){
//       $scope.rssload = true;
//       $scope.rssfeed = [];
//     });
//   }

//   setInterval(updateData, 100000);

//   socket.on('get/feeds',function(data, callback){
//     $scope.rssfeed = $scope.rssfeed.concat(data);
//     $scope.rssload = false;
//   });
}