var MailBox = require('../models/mailbox.js')
var simplesmtp = require('simplesmtp');
var MailComposer = require("mailcomposer").MailComposer;

module.exports = function(socket) {

  socket.on('mailbox/send', function(mailbox, mail, callback){
    var smtpOptions = {};
    var host = null;
    var port = 25;
    if(mailbox.type == 'google'){
      smtpOptions.auth = {
        XOAuth2:{
          user: mailbox.email,
          clientId: mailbox.clientId,
          clientSecret: mailbox.clientSecret,
          refreshToken: mailbox.refreshToken,
          accessToken: mailbox.accessToken,
          timeout: 3600
        }
      }
      host = 'smtp.gmail.com';
    }else{
      smtpOptions.secureConnection = mailbox.secure;
      smtpOptions.auth = {
        user : mailbox.username,
        pass: mailbox.password
      };
      port = mailbox.smtpPort;
      host = mailbox.smtp;
    }
    var smtpPool = simplesmtp.createClientPool(port, host, smtpOptions);
    var poolMail = new MailComposer();
    poolMail.setMessageOption(mail);
    smtpPool.sendMail(poolMail, callback);
  });

}