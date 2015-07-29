var Forecast = require('forecast');

module.exports = function($scope, $http, socket, toaster){

$scope.weatherCount = 1;
$scope.geolocation = "Location in progress";

// Var longitude and latitude 
var lat;
var lng; 

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
    lat = position.latitude; 
    lng = position.longitude;
    // Load API Goole Map with Latitude and Longitude
    var GoogleMap = 'http://maps.google.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false';
    // Get Datas
    $http.get(GoogleMap).success(function(response){
      if(response.status == "OK"){
        // Put City name in var
        var city = response.results[1].formatted_address;
        $scope.geolocation = city;
        return 
      }
    });
  }

  // Error: Invalid protocol: https: xw

//   // Load the weather on the location
//   function getWeatherLocation(lat, lng){
//       console.log(lat, lng);
//   }

// // Initialize 
// var forecast = new Forecast({
//   service: 'forecast.io',
//   key: 'd1921039942bac6535c22900a562a602',
//   units: 'celcius', // Only the first letter is parsed 
//   cache: true,      // Cache API requests? 
//   ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
//     minutes: 27,
//     seconds: 45
//     }
// });
 
// // Retrieve weather information from coordinates (Sydney, Australia) 
// forecast.get([-33.8683, 151.2086], function(err, weather) {
//   if(err) return console.log(err);
//   console.log(weather);
// });



  // app.factory('ZipCodeLookupSvc', [
  //   '$q', '$http', 'GeolocationSvc',
  //   function($q, $http, GeolocationSvc) {
  //     var MAPS_ENDPOINT = 'http://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false';

  //     return {
  //       urlForLatLng: function(lat, lng) {
  //         return MAPS_ENDPOINT.replace('{POSITION}', lat + ',' + lng);
  //       },

  //       lookupByLatLng: function(lat, lng) {
  //         var deferred = $q.defer();
  //         var url = this.urlForLatLng(lat, lng);

  //         $http.get(url).success(function(response) {
  //           // hacky
  //           var zipCode;
  //           angular.forEach(response.results, function(result) {
  //             if(result.types[0] === 'postal_code') {
  //               zipCode = result.address_components[0].short_name;
  //               console.log(zipCode);
  //             }
  //           });
  //           deferred.resolve(zipCode);
  //         }).error(deferred.reject);

  //         return deferred.promise;
  //       },

  //       lookup: function() {
  //         var deferred = $q.defer();
  //         var self = this;

  //         GeolocationSvc().then(function(position) {
  //           deferred.resolve(self.lookupByLatLng(position.lat, position.lng));
  //         }, deferred.reject);

  //         return deferred.promise;
  //       }
  //     };
  //   }
  // ]);

  // app.controller('MainCtrl', ['$scope', 'ZipCodeLookupSvc',
  //   function($scope, ZipCodeLookupSvc) {
  //     $scope.zipCode = null;
  //     $scope.message = 'Finding zip code...';

  //     ZipCodeLookupSvc.lookup().then(function(zipCode) {
  //       $scope.zipCode = zipCode;
  //     }, function(err) {
  //       $scope.message = err;
  //     });
  // }]);

// })(angular);
// get localtion 


  // function getCityName(lat, lng){
  //   var latlng = new google.maps.LatLng(lat,lng);

  //   geocoder.geocode({'latLng': latlng}, function(results, status) {
  //     if(status == google.maps.GeocoderStatus.OK){
  //       console.log(results);
  //     }
  //   });

  // }


//   $scope.rssfeed = null;
//   $scope.modal = null;
//   $scope.rssload = true;

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