var settings = getPlugin("weather").settings;


settings.registerController("WeatherSettingController", require('./controller/weather'));


settings.registerRoute('/weather',{
  controller :  'WeatherSettingController',
  templateUrl :  'index.html'
});

settings.registerSettingsItem('Weather', '/weather', 'fa-sun-o');