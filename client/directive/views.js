module.exports = function(app){
  app.directive("topBar", function(){
    return {
      restrict: "E",
      templateUrl: "views/topbar/index.html"
    };
  });
  app.directive("sideBar", function(){
    return {
      restrict: "E",
      templateUrl: "views/sidebar/index.html"
    };
  });

  var controlSideBarLoaded = false;

  app.directive("controlSideBar", function(){
    return {
      restrict: "E",
      templateUrl: "views/control-sidebar/index.html",
      link: function(){
        controlSideBarLoaded = true;
      }
    };
  });
  
  app.directive("appScript", function(){
    return {
      restrict: "E",
      templateUrl: "views/scripts.html",
      link: function(){
        if(!controlSideBarLoaded){
          var intervalID = setInterval(function(){
            if(controlSideBarLoaded){
              clearInterval(intervalID);
              $.AdminLTE.controlSidebar.activate();
            }
          }, 250);

        }
      }
    };
  });  

}

