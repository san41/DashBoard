var io = require('socket.io-client');
var angular = require('angular');
var angularRoute = require('angular-route');
var angularSocketIo = require('angular-socket-io');

var app = angular.module("dbapp", ['ngRoute', 'btford.socket-io']);

app.config(function($routeProvider){
  $routeProvider.when('/home', {
    templateUrl: "views/home/index.html",
    controller:"HomeController"
  }).when('/mail', {
    templateUrl: "views/mail/index.html",
    controller:"MailController" 
  }).when('/settings/mailbox', {
    templateUrl: 'views/settings/mailbox/index.html',
    controller:'MailBoxSettingsController'
  }).when('/settings/mailbox/create', {
    templateUrl: 'views/settings/mailbox/create.html',
    controller:'CreateMailBoxSettingsController'
  }).when('/settings/mailbox/edit/:id', {
    templateUrl: 'views/settings/mailbox/create.html',
    controller:'CreateMailBoxSettingsController'
  }).when('/profile', {
    templateUrl: 'views/profile/index.html'
  })

  .otherwise({
        redirectTo: '/home'
      });
});

app.factory('socket', function(socketFactory){
  var myIoSocket = io.connect();

  return socketFactory({ioSocket:myIoSocket});
})

app.run(function($rootScope){
  $rootScope.passport = passport;

});

app.controller('MailController', require('./controller/mail'));

app.controller('MainController', function($scope){ $scope.init = true; });
app.controller('HomeController', function(){});
app.controller('MailBoxSettingsController', require('./controller/settings/mailbox.js'));
app.controller('CreateMailBoxSettingsController', require('./controller/settings/createMailbox.js'));


app.directive('gravatar', require('./directive/gravatar.js'));



require('./directive/views.js')(app);

angular.element(document).ready(function() {
      angular.bootstrap(document, ['dbapp']);
    });
console.log("angular loaded"); 