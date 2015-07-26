var plugin = getPlugin('rssreader');

plugin.registerController('RssReaderController', require('./controller/rssreader.js'));

plugin.registerRoute('/rssreader', {
  controller: 'RssReaderController',
  templateUrl: 'index.html'
});

plugin.registerMenuItem('RssReader', '/rssreader', 'fa-rss-square');