module.exports = function($scope, socket, $rootScope, toaster){

  $scope.widgets = [];

  socket.emit('widget/list', function(err, list){
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
  })



}