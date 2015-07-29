var plugin = getPlugin('weather');

plugin.registerController('WeatherController', require('./controller/weather.js'));

plugin.registerRoute('/weather', {
  controller: 'WeatherController',
  templateUrl: 'index.html'
});

plugin.registerMenuItem('Weather', '/weather', 'fa-sun-o');