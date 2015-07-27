(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var settings = getPlugin("rssreader").settings;


settings.registerController("FeedListController", require('./controller/feedList'));


settings.registerRoute('/rssreader',{
  controller :  'FeedListController',
  templateUrl :  'index.html'
});

settings.registerSettingsItem('RssReader', '/rssreader', 'fa-rss-square');
},{"./controller/feedList":1}]},{},[2])