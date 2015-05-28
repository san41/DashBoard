module.exports = function($scope, socket, sharedData, $location,$sce){

  $scope.mail = sharedData.get('mail-read');  
  $scope.content = "<center>Loading....</center>";
  if($scope.mail == null){ $location.path('/mail'); return; }
  socket.emit('mailbox/getMailContent', $scope.mail, function(err, data){
    $scope.content = $sce.trustAsHtml(data);
  });

}