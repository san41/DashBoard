(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($scope, socket, sharedData, $location, $filter, $timeout, toaster, $rootScope){

  var mailsByUID = {};
  $scope.mails = [];
  $scope.mailsMarked = {};
  $scope.unReadMailCount = 0;
  $scope.mailCount = 0;
  $scope.mailboxes = [];
  $scope.mailboxUnReadMailCount = {};
  $scope.messageFilterData = {read:false};


  var updateData = function(){
    var unReadMailCount = 0;
    for(var i in $scope.mailboxUnReadMailCount){
      $scope.mailboxUnReadMailCount[i] = 0;
    }
    for(var i in $scope.mails){
      var mail = $scope.mails[i];
      var style = {};
      mail.read = true;
      if(mail.flags.indexOf('\\Seen') == -1){
        mail.read = false;
        style['font-weight'] ="bold";
        unReadMailCount++;
        if($scope.mailboxUnReadMailCount[mail.mailbox.id] == null){
          $scope.mailboxUnReadMailCount[mail.mailbox.id] = 1;
        }else{
          $scope.mailboxUnReadMailCount[mail.mailbox.id] += 1;
        }
      }
      mail.style = style;
      $scope.mails[i] = mail;
    }
    $scope.mailCount = $scope.mails.length;
    $scope.unReadMailCount = unReadMailCount;
  }

  $scope.readMail = function(mail){
    sharedData.set('mail-read', mail);
    $location.path('/mail/read')
  }

  $scope.changeCurrentMailBox = function(mailbox){
    if(mailbox != null){
      $scope.messageFilterData.mailbox.name = mailbox.name;
    }else{
      $scope.messageFilterData.mailbox.name = null;
    }
  };

  $scope.selectAll = function(){
    var mails = $filter('filter')($scope.mails, $scope.messageFilterData)
    var tmpMailsMarked = {};
    if(Object.keys($scope.mailsMarked).length != mails.length){
      for(var i in mails){
        tmpMailsMarked[mails[i].UID] = true;
      }
    }
    $scope.mailsMarked = tmpMailsMarked;
  }

  socket.emit('mailbox/list', function(err, mailboxes){
    if(err){
      toaster.put('error', 'Erreur', err);
      return; 
    }
    $scope.mailboxes = mailboxes;
    for(var i in mailboxes){
      var _mailbox = mailboxes[i];
      (function(mailbox){
        socket.emit('mails/request', mailbox, function(err, mails){
          if(err){
            toaster.pop('error', 'Erreur', err);
            $rootScope.$apply();
            return;
          }
          for(var i in mails){
            var mail = mails[i];
            mail.mailbox = {
              name: mailbox.name, 
              id: mailbox._id,
              color: mailbox.color,
            };
            mailsByUID[mail.UID] = mail;
            $scope.mails.push(mail);
          }
          updateData();
        })
      })(_mailbox);
    }
  });

  $scope.messageFilter =function(type){
    $scope.messageFilterData = type;
  }


  $scope.markRead = function(){
    var mailsMarked = [];
    for(var uid in $scope.mailsMarked){
      if($scope.mailsMarked[uid]){
        mailsMarked.push(mailsByUID[uid]);
      }
    }
    toaster.pop('info', "Request to mark as read", 'Request to mark as read '+ Object.keys(mailsMarked).length + " mails");
    socket.emit('mailbox/markRead', mailsMarked, function(errors, mailsFlags){
      if(errors.length > 0){
        for(var i in errors){
          var err = errors[i];
          toaster.pop('error', 'Erreur', err);
          $rootScope.$apply();

        }
        return; 
      }
      for(var uid in mailsFlags){
        mailsByUID[uid].flags = mailsFlags[uid];
      }
      toaster.pop('info', "Marked as read", Object.keys(mailsFlags).length + " mails marked as read");

      $scope.mails = Object.keys(mailsByUID).map(function(k){return mailsByUID[k]});
      updateData();
    });
  }
  $scope.delete = function(){
    var mailsMarked = [];
    for(var uid in $scope.mailsMarked){
      if($scope.mailsMarked[uid]){
        mailsMarked.push(mailsByUID[uid]);
      }
    }
    toaster.pop('info', "Request deletion", 'Request deletion of '+ Object.keys(mailsMarked).length + " mails");
    socket.emit('mailbox/deleteMail', mailsMarked, function(errors, UIDDeleted){
      console.log(errors, UIDDeleted);
      if(errors.length > 0){
        for(var i in errors){
          var err = errors[i];
          toaster.pop('error', 'Erreur', err);
          $rootScope.$apply();

        }
        return; 
      }
      for(var i in UIDDeleted){
        delete mailsByUID[UIDDeleted[i]];
      }
      toaster.pop('info', "Deleted", UIDDeleted.length + " mails deleted");

      $scope.mails = Object.keys(mailsByUID).map(function(k){return mailsByUID[k]});
      updateData();
    });
  }

};
},{}],2:[function(require,module,exports){
module.exports = function($scope, socket, sharedData, $location,$sce, toaster, $rootScope){

  $scope.mail = sharedData.get('mail-read');  
  $scope.content = "<center>Loading....</center>";
  if($scope.mail == null){ $location.path('/mail'); return; }
  socket.emit('mailbox/getMailContent', $scope.mail, function(err, data){
    if(err){
      toaster.pop('error', 'Erreur', err);
      $rootScope.$apply();
      return; 
    }
    $scope.content = $sce.trustAsHtml(data);
  });

  $scope.mailbox = null;
  socket.emit('mailbox/get', {_id: $scope.mail.mailbox.id}, function(err, data){
    if(err){
      toaster.pop('error', 'Erreur', err);
      $rootScope.$apply();

      return; 
    }
    $scope.mailbox = data;
  });

  $scope.reply = function(){
    var newSubject = "RE: " + $scope.mail.title;
    var to = $scope.mail.from.address;
    var mailbox = $scope.mailbox != null ? $scope.mailbox :  $scope.mail.mailbox;
    var replyMail = {
      subject: newSubject,
      from: mailbox,
      to: to
    };
    sharedData.set('mail-reply', replyMail);
    $location.path('/mail/send');
  }

  $scope.forward = function(){
    var newSubject = "Fwd: " + $scope.mail.title;
    var to = $scope.mail.from.address;
    var mailbox = $scope.mailbox != null ? $scope.mailbox :  $scope.mail.mailbox;
    var fowardHeader = '---------- Forwarded message --------- \n From: '+ $scope.mail.from.name +' <'+ $scope.mail.from.address +'> \n Date: '+ $scope.mail.date +' \nSubject: '+ $scope.mail.title +' \n';

    var replyMail = {
      subject: newSubject,
      from: mailbox,
      to: '',
      content: fowardHeader + "\n" + $scope.content
    };
    sharedData.set('mail-reply', replyMail);
    $location.path('/mail/send');
  }

  $scope.delete = function(){
    toaster.pop('info', "Request to delete", 'request to mail delete');
    socket.emit('mailbox/deleteMail', [$scope.mail], function(errors, UIDDeleted){
      console.log(errors, UIDDeleted);
      if(errors.length > 0){
        for(var i in errors){
          var err = errors[i];
          toaster.pop('error', 'Erreur', err);
          $rootScope.$apply();

        }
        return; 
      }
      if(UIDDeleted.length == 1)
        toaster.pop('info', "Mail deleted");
      $location.path('/mail');
    });
  }

}
},{}],3:[function(require,module,exports){
module.exports = function($scope, socket, sharedData, $location,$sce, toaster, $rootScope){
  $scope.mailboxes = [];
  var mailData = null;
  if(sharedData.get('mail-reply')){
    mailData = sharedData.get('mail-reply');
    $scope.subject = mailData.subject;
    $scope.to = mailData.to;
    if(mailData.content != null){
      $scope.content = mailData.content;
    }
    sharedData.set('mail-reply',null);
  }

  socket.emit('mailbox/list', function(err, mailboxes){
    if(err){
      toaster.pop('error', 'Erreur', err);
      $rootScope.$apply();

      return;
    }
    $scope.$apply(function(){
      $scope.mailboxes = mailboxes;
      $scope.mailbox = mailboxes[0];
      if(mailData){
        $scope.mailbox = mailData.from;
        $scope.$digest();
      }
    });
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
      from: mailbox.email
    };
    socket.emit('mailbox/send', mailbox, mail, function(err, data){
      if(err){
        console.log(err, data);
        toaster.pop('error', 'Erreur', err, 5000);
        $rootScope.$apply();
        return;
      };
      toaster.pop('info', null, 'Email envoyer');
      $rootScope.$apply();
      $location.path('/mail');
    });
  }

}

},{}],4:[function(require,module,exports){
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
    socket.emit('widget/save', $scope.widget);
  }

  $scope.delete = function(){
    if($scope.widget._id == null){
      $element.remove();
      return
    }
   socket.emit('widget/delete', $scope.widget, function(err){
    if(err) return;
    $element.remove();
   }); 
  }

})
},{"./controller/mail":1,"./controller/readMail":2,"./controller/sendMail":3}]},{},[4])