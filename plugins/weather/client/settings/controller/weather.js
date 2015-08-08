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