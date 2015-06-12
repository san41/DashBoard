(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($scope, socket, $location, $routeParams){
  $scope.submitValue = "Create";
  if($routeParams.id != null){
    $scope.submitValue = "Edit";
    socket.emit('mailbox/get', {'_id': $routeParams.id}, function(err, mailbox){
      if(err) return;
      $scope.data = mailbox;
    })
  }

  $scope.create = function(){
    console.log($scope.data);
    $scope.data.color = document.querySelector('.colorpicker').value;
    $scope.data.secure = document.querySelector('#secure').checked;
    $scope.data.smtpAuth = document.querySelector('#auth').checked;
    socket.emit('mailbox/save', $scope.data, function(err, data){
      if(!err)
        $location.path('/settings/mailbox')
      else
        console.log(err);
    });
  }

  $scope.switchPassword = function(){
    var passwdInput = document.querySelector('#password');
    if(passwdInput.type =='password'){
      passwdInput.type = 'text';
    }else{
      passwdInput.type = 'password';
    }
  }

}

},{}],2:[function(require,module,exports){
module.exports = function($scope, socket, $location, toaster){
  $scope.mailboxes = []

  socket.emit('mailbox/list', function(err, mailboxes){
    if(err){
      toaster.put('error', 'Erreur', err);
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
},{}],3:[function(require,module,exports){
var settings = getPlugin('mail').settings;

settings.registerController('MailBoxController', require('./controller/mailbox.js'));
settings.registerController('CreateMailBoxController', require('./controller/createMailbox.js'));

settings.registerRoute('/mailbox', {
  controller : 'MailBoxController',
  templateUrl : 'index.html'
});

settings.registerRoute('/mailbox/create', {
  controller : 'CreateMailBoxController',
  templateUrl : 'create.html'
});
settings.registerRoute('/mailbox/edit/:id', {
  controller : 'CreateMailBoxController',
  templateUrl : 'create.html'
});

settings.registerSettingsItem('MailBox', '/mailbox', 'fa-envelope');
},{"./controller/createMailbox.js":1,"./controller/mailbox.js":2}]},{},[3])