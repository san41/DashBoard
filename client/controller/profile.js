var _ = require('underscore');
module.exports = function(socket, $scope, $rootScope, toaster){
  $scope.user = passport.user;

  $scope.widgets = [];
  socket.emit('getUserData', passport.user, function(err, userData){
    if(err) return;
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
    $scope.widgets = _.sortBy($scope.widgets, 'order');  
  });

  $scope.editProfile = function(){
    socket.emit('editProfile', passport.user.id, $scope.user, function(err){
      if(err){
        console.error(err);
        toaster.pop('error',"Can not change profile");
      }
      toaster.pop('info',"Your profile has been updated. Refresh page");
    })
  }

  $scope.addWidget = function(){
      var widget = $scope.newWidgets;
      if(widget == undefined) return;
      $scope.widgets.push(widget);
  }

  $scope.sortableOptions = {
    "ui-floating" : 'auto',
    
    stop: function(e, ui){
      for(var i in $scope.widgets){
        var widget = $scope.widgets[i];
        widget.order = i;
        if(widget._id != null)
          socket.emit('widget/save', widget, function(){});
      }
    }
  }
}