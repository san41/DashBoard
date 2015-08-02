// TODO 
//  Change metre/s en Km/h
//  Check the location to adapted translate (fr, en ,)

module.exports = function($scope, $http, socket, toaster){

  $scope.loadData = true;
  $scope.modal = null;

$scope.weatherCount = 1;
$scope.geolocation = "Location in progress";

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
    });
  }// faire else pour navig non compatible

  function getGeolocationCityName(position){
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
      weatherLive['speedWindT'] = responseWeatherToday.wind['speed']*3.6;  
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
        console.log(responseList[i]);
      }
      $scope.weatherGeolocationT = responseList;
      console.log($scope.weatherGeolocationT);
    });
  }

  $scope.addWeatherLocation = function (){
    var newLocation = {
      editable : true
    }
    console.log("add ok");
    $scope.modal = newLocation;
  }

  $scope.modalNewWeatherLocation = function(){  

  }




// // Start form to added the feed link
//   $scope.addRSSFeed = function(){
//     var newFeed = {
//       editable : true, 
//       categorysList : ["World", "Actuality", "Politics", "Business", "Techology","Science","Health","Sports","Arts","Style","Food","Traval","People","Work","Development" ],
//     }
//     $scope.modal = newFeed;
//   }

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