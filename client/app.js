var io = require('socket.io-client');
var angular = require('angular');
require('angular-route');
require('angular-sanitize');
require('angular-socket-io');
require('angular-animate');
require('angularjs-toaster');

var xhrPlugins = new XMLHttpRequest();
xhrPlugins.open('GET', '/plugins.json', false);
xhrPlugins.send(null);
if(xhrPlugins.status != 200 && xhrPlugins.status != 304){
  throw new Error('plugins.json not found');
}

var app = angular.module("dbapp", ['ngRoute', 'btford.socket-io', 'ngSanitize', 'toaster', 'ngAnimate']);

var countNeedLoad = 0;
var loaded = 0;

var menuItems = [];

var pluginsList = JSON.parse(xhrPlugins.responseText);
for(var i in pluginsList){
  var pluginName = pluginsList[i];
  var script = document.createElement('script');
  script.src = '/plugins/'+ pluginName +'/client/index.js'
  document.body.appendChild(script);
  countNeedLoad++;
  script.addEventListener('load', function(){

    var plugin = pluginsByName[pluginName];
    
    for(var controllerName in plugin.controllers){
      angular.module('dbapp').controller(controllerName, plugin.controllers[controllerName]);
    }
    for(var i in plugin.menuItems){
        menuItems.push(plugin.menuItems[i]);
    }
    app.config(function($routeProvider){
      for(var routeName in plugin.routes){
        var routeData = plugin.routes[routeName];

        $routeProvider.when(routeName, {
          controller: routeData.controller,
          templateUrl: "/plugins/" + pluginName + "/client/views/" + routeData.templateUrl,

        })

      }
    });
    loaded++;
  });
}


app.config(function($routeProvider){
  app.routeProvider = $routeProvider;
  $routeProvider.when('/home', {
    templateUrl: "views/home/index.html",
    controller:"HomeController"
  });
  $routeProvider.otherwise({
    redirectTo: '/home'
  });

});


app.factory('socket', function(socketFactory, $rootScope, toaster){

  var myIoSocket = io.connect();
  myIoSocket.on('globalSettings', function(globalSettings){
    $rootScope.globalSettings = globalSettings;
  });
  myIoSocket.on('server-error', function(msg, error){
    console.log(error, typeof(error), msg);
    toaster.pop('error', 'Erreur', msg);
  });
  myIoSocket.on('disconnect', function(){
    toaster.pop("warning", "Perte de connexion", "Le serveur socket.io n'est plus joignable");
    $rootScope.$apply();
  });
  myIoSocket.on('reconnect', function(){
    toaster.pop("info", "Reconnexion", "Le serveur socket.io est de nouveau joignable");
    $rootScope.$apply();
  });
  return socketFactory({ioSocket:myIoSocket});
});

app.service('sharedData', require('./service/sharedData.js'));

app.run(function($rootScope){
  $rootScope.passport = passport;

});


app.controller('MainController', function($scope){ $scope.init = true; });
app.controller('HomeController', require('./controller/home'));

app.directive('gravatar', require('./directive/gravatar.js'));






require('./directive/views.js')(app);

var tId = setTimeout(function(){
  if(countNeedLoad < loaded) return;
  clearTimeout(tId);

  app.run(function($rootScope){
    $rootScope.menuItems = menuItems;
  })

  angular.element(document).ready(function() {
    setTimeout(function(){
      while(angular.element(document.body).scope() == null){
        angular.bootstrap(document.body, ['dbapp']);
        console.log('retry start angular module')
      }
    },0);
  });
}, 5);

