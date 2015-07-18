var io = require('socket.io-client');
var angular = require('angular');
require('angular-route');
require('angular-sanitize');
require('angular-socket-io');
require('angular-animate');
require('angularjs-toaster');

var xhrPlugins = new XMLHttpRequest();
xhrPlugins.open('GET', './plugins.json', false);
xhrPlugins.send(null);
if(xhrPlugins.status != 200 && xhrPlugins.status != 304){
  throw new Error('plugins.json not found');
}

var app = angular.module("dbapp", ['ngRoute', 'btford.socket-io', 'ngSanitize', 'toaster', 'ngAnimate']);

var countNeedLoad = 0;
var loaded = 0;

var menuItems = [];
var settingsItems = [];

var widgets = [];

var pluginsList = JSON.parse(xhrPlugins.responseText);
for(var i in pluginsList){
  var pluginName = pluginsList[i];
  (function(pluginName){
  countNeedLoad+=2; //Client + settings
  
  //Load client script
  var script = document.createElement('script');
  script.src = './plugins/'+ pluginName +'/client/index.js';
  document.body.appendChild(script);
  
  script.addEventListener('load', function(){

    var plugin = pluginsByName[pluginName];
    
    for(var controllerName in plugin.controllers){
      angular.module('dbapp').controller(controllerName, plugin.controllers[controllerName]);
    }
    
    for(var i in plugin.menuItems){
        menuItems.push(plugin.menuItems[i]);
    }
    for(var i in plugin.widgets){
      var w =  plugin.widgets[i];
      w.plugin = pluginName;
      w.templateURLConfig= "./plugins/" + pluginName + "/client/views/widget/" + w.templateURL.replace('.html','-config.html'),
      w.templateURL= "./plugins/" + pluginName + "/client/views/widget/" + w.templateURL,
      widgets.push(w);
    }

    app.config(function($routeProvider){
      for(var routeName in plugin.routes){
        var routeData = plugin.routes[routeName];

        $routeProvider.when(routeName, {
          controller: routeData.controller,
          templateUrl: "./plugins/" + pluginName + "/client/views/" + routeData.templateUrl,
        });
      }
    });
    loaded++;
  });
  script.addEventListener('error', function(){
    loaded++;
  });
  //Load client settings script
  var settingsScript =  document.createElement('script');
  settingsScript.src = './plugins/'+ pluginName +'/client/settings.js';
  document.body.appendChild(settingsScript);

  settingsScript.addEventListener('load', function(){

    var plugin = pluginsByName[pluginName];
    
    for(var controllerName in plugin.settings.controllers){
      angular.module('dbapp').controller(controllerName, plugin.settings.controllers[controllerName]);
    }
    for(var i in plugin.settings.settingsItems){
        settingsItems.push(plugin.settings.settingsItems[i]);
    }
    app.config(function($routeProvider){
      for(var routeName in plugin.settings.routes){
        var routeData = plugin.settings.routes[routeName];
        $routeProvider.when(routeName, {
          controller: routeData.controller,
          templateUrl: "./plugins/" + pluginName + "/client/settings/views/" + routeData.templateUrl,

        });

      }
    });
    loaded++;
  });
  settingsScript.addEventListener('error', function(){
    loaded++;
  });
})(pluginName);
}


app.config(function($routeProvider){
  app.routeProvider = $routeProvider;
  $routeProvider.when('/home', {
    templateUrl: "views/home/index.html",
    controller:"HomeController"
  });
  $routeProvider.when('/profile', {
    templateUrl: "views/profile/index.html",
    controller:"ProfileController"
  });
  $routeProvider.otherwise({
    redirectTo: '/home'
  });

});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

app.factory('socket', function(socketFactory, $rootScope, toaster){

  var myIoSocket = io.connect();
  myIoSocket.on('globalSettings', function(globalSettings){
    $rootScope.globalSettings = globalSettings;
  });
  myIoSocket.on('server-error', function(msg, error){
    console.error(error, typeof(error), msg);
    toaster.pop('error', 'Error', msg);
  });
  myIoSocket.on('disconnect', function(){
    toaster.pop("warning", "Connexion lost", "The server is no longer reachable");
    $rootScope.$apply();
  });
  myIoSocket.on('reconnect', function(){
    toaster.pop("info", "Reconnected", "The server is reachable again");
    $rootScope.$apply();
  });
  return socketFactory({ioSocket:myIoSocket});
});

app.service('sharedData', require('./service/sharedData.js'));

app.run(function($rootScope){
  $rootScope.range = function(n) {
    var l = [];
    for(var i = 0; i < n; i++){
      l.push(i);
    }
    return l;
  };
  $rootScope.passport = passport;
});


app.run(function($location, $rootScope){
    $rootScope.currentPath = $location.path();
    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
        $rootScope.currentPath = $location.path();

        $('aside.control-sidebar').removeClass('control-sidebar-open');
        $('body').removeClass('sidebar-open');

    });
})


app.controller('MainController', function($scope){ $scope.init = true; });
app.controller('HomeController', require('./controller/home'));
app.controller('ProfileController', require('./controller/profile'));

app.directive('gravatar', require('./directive/gravatar.js'));






require('./directive/views.js')(app);
require('./directive/widget.js')(app);

var tId = setInterval(function(){
  if(countNeedLoad > loaded){ return; }
  clearInterval(tId);

  app.run(function($rootScope){
    $rootScope.menuItems = menuItems;
    $rootScope.settingsItems = settingsItems;
    $rootScope.pluginsWidgets = widgets;
  })

  angular.element(document).ready(function() {
    setTimeout(function(){
      while(angular.element(document.body).scope() == null){
        angular.bootstrap(document.body, ['dbapp']);
        console.warn('retry start angular module')
      }
    },0);
  });
}, 5);

