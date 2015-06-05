var settings = getPlugin('mail').settings;

settings.registerController('MailBoxController', require('./controller/mailbox.js'));
settings.registerController('CreateMailBoxController', require('./controller/createMailbox.js'));

settings.registerRoute('/mailbox', {
  controller : 'MailBoxController',
  templateUrl : 'index.html'
});

settings.registerRoute('/mailbox/create', {
  controller : 'CreateMailBoxController',
  templateUrl : 'create.html'
});

settings.registerSettingsItem('MailBox', '/mailbox', 'fa-envelope');