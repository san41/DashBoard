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


}, function($scope, socket){
  if($scope.widget.colWidth == null)
    $scope.widget.colWidth = 3;
  if($scope.widget.settings == null)
    $scope.widget.settings = {};

  $scope.mailboxes = [];  
  socket.emit('mailbox/list', function(err, list){
    if(err) return;
    $scope.mailboxes = list;
  })

  $scope.save = function(){
    socket.emit('widget/add', $scope.widget);
  }

})