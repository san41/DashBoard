module.exports = function($scope, socket, $location, toaster){
  $scope.mailboxes = []

  socket.emit('mailbox/list', function(err, mailboxes){
    if(err){
      toaster.put('error', 'Error', err);
      return; 
    }
    $scope.$apply(function(){
      $scope.mailboxes = mailboxes;      
    });
  });

  $scope.edit = function(id){
    $location.path('/settings/mailbox/edit/'  + id);

  }
  $scope.delete = function(mailbox){
   if(confirm('Are you sure to delete the mailbox "' + mailbox.name + '" ?')){
    socket.emit('mailbox/delete', mailbox, function(err){
      if(err){
        toaster.pop('error', 'Error', 'Error on deleting the mailbox');
        console.error(err);
      }else{
        var index = -1;
        for(var i in $scope.mailboxes){
          if($scope.mailboxes[i]._id == mailbox._id){
            index = i;
          }
        }
        if(index > -1){
          $scope.mailboxes.splice(index);
        }
      }
    });
  } 
}

}