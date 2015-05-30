module.exports = function($scope, socket, $location){
  $scope.mailboxes = []

  socket.emit('mailbox/list', function(err, mailboxes){
    if(!err){
      $scope.$apply(function(){
        console.log(mailboxes);
        $scope.mailboxes = mailboxes;      
      });
    }
  });

  $scope.edit = function(id){
    $location.path('/settings/mailbox/edit/'  + id);

  }

}