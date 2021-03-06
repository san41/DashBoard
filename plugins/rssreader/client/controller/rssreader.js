module.exports = function($scope, socket, toaster){

  $scope.rssfeed = null;
  $scope.modal = null;
  $scope.rssload = true;

// Start form to added the feed link
  $scope.addRSSFeed = function(){
    var newFeed = {
      editable : true, 
      categorysList : ["World", "Actuality", "Politics", "Business", "Techology","Science","Health","Sports","Arts","Style","Food","Traval","People","Work","Development" ],
    }
    $scope.modal = newFeed;
  }

  $scope.modalNewFeed = function (){
    var newFeed = $scope.modal;
    // Check all information : TODO 
    // Change et evol information
  if(newFeed.name ==  null || newFeed.name == "" ){
    toaster.pop('error', 'Error', 'Title is empty !');
    return;
  }
  if(newFeed.link ==  null || newFeed.link == "" ){
    toaster.pop('error', 'Error', 'Link is empty or not valid !');
    return;
  }
  if(newFeed.category ==  null || newFeed.category == "" ){
    // todo add list
    toaster.pop('error', 'Error', 'Category is empty or not valid !');
    return;   
  }

    // Check
    socket.emit('feed/addfeed',newFeed, function(err, res){
      if(err){
        toaster.pop('error', 'Error', err);
        return;
      }
      toaster.pop('success', 'Success', 'RSS feed has been added');
      $scope.modal = null;
      $scope.rssfeedCount = 1;
      updateData();
    });
  }

  socket.emit('feed/list', function(err, list){
    if(list > 0){
      $scope.rssfeedCount = list;
      updateData();
    }else{ 
      $scope.rssfeedCount = 0;
    }
  });

  function updateData(){
    socket.emit('feed/read', function(result){
      $scope.rssload = true;
      $scope.rssfeed = [];
    });
  }

  setInterval(updateData, 100000);

  socket.on('get/feeds',function(data, callback){
    $scope.rssfeed = $scope.rssfeed.concat(data);
    $scope.rssload = false;
  });
}