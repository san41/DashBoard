var plugin = getPlugin('mail');

plugin.registerController('MailController', require('./controller/mail'));
plugin.registerController('MailReadController', require('./controller/readMail'));
plugin.registerController('MailSendController', require('./controller/sendMail'));

plugin.registerRoute('/mail', {
    templateUrl: "index.html",
    controller:"MailController" 
});
plugin.registerRoute('/mail/read', {
    templateUrl: "read.html",
    controller:"MailReadController" 
});
plugin.registerRoute('/mail/send', {
    templateUrl: "send.html",
    controller:"MailSendController" 
});

plugin.registerMenuItem('Mail', '/mail', 'fa-envelope');