module.exports = function($scope, socket, $location, $routeParams, toaster){

  $scope.rssfeeds = [];
  $scope.editmodal = null;

  socket.emit('rssreader/list', function(err, list){
    if(err) return;
    $scope.rssfeeds = list; 
  });

  $scope.delete = function(feed){
    if(!confirm('Are you sure to delete the rss feed ' + feed.name +' ?')){
      return;
    }
    socket.emit('rssreader/delete', feed, function(err){
      if(err){
        toaster.pop('error', 'Error', 'Cannot delete this rss feed'); 
        return;
      }

      var index = -1;
      for(var i in $scope.rssfeeds){
        var scopeRssfeeds = $scope.rssfeeds[i];
        if(scopeRssfeeds._id == feed._id){
          index = i;
        }
      }
      if(index > -1){
        $scope.rssfeeds.splice(index, 1);
      }
    });
  }

  $scope.edit = function(feed){
    console.log(feed);
    $scope.editmodal = true;
    toaster.pop('error', 'Error', 'Edit is not avaible');
  }
}