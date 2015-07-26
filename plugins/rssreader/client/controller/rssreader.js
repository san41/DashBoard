module.exports = function($scope, socket, toaster){




  $scope.rssfeed = null;

  $scope.modal = null;


// function 

  function modalAddFeed(){

  }


// Add rss feed
  $scope.addRSSFeed = function(){

    var newFeed = {
      editable : true, 
    }
    $scope.modal = newFeed;
    }

    $scope.modalNewFeed = function (){
      var newFeed = $scope.modal;
      // Debug 
      console.log(newFeed);

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
    if(newFeed.color ==  null || newFeed.color == "" ){
      toaster.pop('error', 'Error', 'Color is empty or not valid !');
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
    });
    }

  socket.emit('feed/list', function(err, list){
    // if(err){
    //   console.error(err);
    //   toaster.pop('error', 'Error', '')
    //   return
    // }
    console.log(list); 
       if(list > 0){
      $scope.rssfeedCount = list;
    }else{
      $scope.rssfeedCount = 0;
    }

  });





}