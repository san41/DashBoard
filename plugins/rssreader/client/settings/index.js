var settings = getPlugin("rssreader").settings;


settings.registerController("FeedListController", require('./controller/feedList'));


settings.registerRoute('/rssreader',{
  controller :  'FeedListController',
  templateUrl :  'index.html'
});


settings.registerSettingsItem('RssReader', '/rssreader', 'fa-rss-square');