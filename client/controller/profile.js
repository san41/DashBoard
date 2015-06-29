module.exports = function(socket, $scope, toaster){
  $scope.user = passport.user;
  socket.emit('getUserData', passport.user, function(err, userData){
    if(err) return;
    console.log(userData);
    $scope.user = userData;
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

}