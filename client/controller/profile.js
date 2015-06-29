module.exports = function(socket, $scope, $rootScope, toaster){
  $scope.user = passport.user;
  $scope.widgets = [];
  socket.emit('getUserData', passport.user, function(err, userData){
    if(err) return;
    console.log(userData);
    $scope.user = userData;
  });

  socket.emit('widget/list',  function(err, list){
    if(err) return;
    for(var i in list){
      for(var j in $rootScope.pluginsWidgets){
        var widget = $rootScope.pluginsWidgets[j];
        var lw = list[i];
        if(lw.plugin != widget.plugin || lw.name != widget.name) continue;
        var w = {};
        for(var a in widget){
          w[a] = widget[a];
        }
        for(var a in lw){
          w[a] = lw[a];
        }
        $scope.widgets.push(w);
      }      
    }
  });

  $scope.editProfile = function(){
    socket.emit('editProfile', passport.user.id, $scope.user, function(err){
      if(err){
        console.error(err);
        toaster.pop('error',"Impossible de changer le profile");
      }
      toaster.pop('info',"Votre profile a était mis a jour. Rafraichiser la page");
    })
  }

  $scope.addWidget = function(){
    console.log($scope.newWidgets);
    var plugin = $scope.newWidgets.split('/')[0];
    var name = $scope.newWidgets.split('/')[1];
    for(var i in $rootScope.pluginsWidgets){
      var widget = $rootScope.pluginsWidgets[i];
      if(plugin != widget.plugin || name != widget.name) continue;
      $scope.widgets.push(widget);
    }
  }

}