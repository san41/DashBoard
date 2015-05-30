module.exports = function($scope, socket, sharedData, $location,$sce){
  $scope.mailboxes = [];

  socket.emit('mailbox/list', function(err, mailboxes){
    if(!err){
      $scope.$apply(function(){
        $scope.mailboxes = mailboxes;      
      });
    }
  });


  $scope.send = function(){
    var mailbox = $scope.mailbox;
    var subject = $scope.subject;
    var body = $scope.content;
    var to = $scope.to;
    var mail = {
      subject: subject,
      body: body,
      to: to,
      from: mailbox.name
    };
    socket.emit('mailbox/send', mailbox, mail, function(err, data){
      console.log(err, data);
    });
    $location.path('/mail');
  }

}