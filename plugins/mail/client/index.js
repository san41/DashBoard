var plugin = getPlugin('mail');

plugin.registerController('MailController', require('./controller/mail'));
plugin.registerController('MailReadController', require('./controller/readMail'));
plugin.registerController('MailSendController', require('./controller/sendMail'));

plugin.registerRoute('/mail', {
  templateUrl: "index.html",
  controller:"MailController" 
});
plugin.registerRoute('/mail/read', {
  templateUrl: "read.html",
  controller:"MailReadController" 
});
plugin.registerRoute('/mail/send', {
  templateUrl: "send.html",
  controller:"MailSendController" 
});

plugin.registerMenuItem('Mail', '/mail', 'fa-envelope');

plugin.registerWidget("mailbox", "mailbox.html", function($scope, socket){
  $scope.mailbox = null;
  socket.emit('mailbox/get', {_id:$scope.widget.settings.mailbox}, function(err, mailbox){
    if(err) return;
    mailbox.unreadCount = -1;
    $scope.mailbox = mailbox;
    
    socket.emit('mails/request', mailbox, function(err, mails){
      if(err) return;
      var unreadCount = 0;
      for(var j in mails){
        var mail = mails[j];
        if(mail.flags && mail.flags.indexOf("\\Seen") == -1)
          unreadCount++;
      }
      $scope.mailbox.unreadCount = unreadCount;

    })
  })


}, function($scope, socket, $element){
  if($scope.widget.colWidth == null)
    $scope.widget.colWidth = 3;
  if($scope.widget.settings == null)
    $scope.widget.settings = {};

  $scope.mailboxes = [];  
  var mailboxesById = {};  
  socket.emit('mailbox/list', function(err, list){
    if(err) return;
    for(var i in list){
      mailboxesById[list[i]._id] = list[i];
    }
    $scope.mailboxes = list;
  });

  $scope.getBoxById = function(id){
    return mailboxesById[id];
  }

  $scope.save = function(){
    socket.emit('widget/save', $scope.widget, function(err){
      if(err){
        toaster.pop('error', 'Error', 'Error on saving the widget');
        console.error(err);
      }else{
        toaster.pop('Info', 'Widget', 'Widget saved');
      }
    });
  }

  $scope.delete = function(){
    if($scope.widget._id == null){
      $element.remove();
      return
    }
    socket.emit('widget/delete', $scope.widget, function(err){
      if(err) {
        toaster.pop('error', 'Error', 'Error on deleting the widget');
        console.error(err);
        return;
      }
      $element.remove();
    }); 
  }

})