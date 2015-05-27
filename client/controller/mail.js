module.exports = function($scope, socket){
 
  $scope.mails = [];
  $scope.unReadMailCount = 0;
  $scope.mailCount = 0;
  $scope.mailboxes = [];
  $scope.currentMailbox = undefined;

  var updateData = function(){
    var unReadMailCount = 0;
    for(var i in $scope.mails){
      var mail = $scope.mails[i];
      var style = {};
      if(mail.flags.indexOf('\\Seen') == -1){
        style['font-weight'] ="bold";
        unReadMailCount++;
      }
      mail.style = style;

    }
    $scope.mailCount = $scope.mails.length;
    $scope.unReadMailCount = unReadMailCount;
  }

  $scope.changeCurrentMailBox = function(mailbox){
    if(mailbox != null){
      $scope.currentMailbox = mailbox;
    }else{
      $scope.currentMailbox = undefined;
    }
  };

  socket.emit('mailbox/list', function(err, mailboxes){
    $scope.mailboxes = mailboxes;
    for(var i in mailboxes){
      var _mailbox = mailboxes[i];
      (function(mailbox){
              socket.emit('mails/request', mailbox, function(err, mails){
                for(var i in mails){
                  var mail = mails[i];
                  mail.mailbox = {
                    name: mailbox.name, 
                    id: mailbox.id,
                    color: mailbox.color,
                  };
                  $scope.mails.push(mail);
                }
                updateData();
              })
            })(_mailbox);
      console.log(_mailbox);
    }
  });

};