var MailBox = require('./models/mailbox.js')
var inbox = require('inbox');
var simplesmtp = require('simplesmtp');
var MailParser = require("mailparser").MailParser;
var MailComposer = require("mailcomposer").MailComposer;



module.exports = function(socket){

  socket.on('mailbox/list', function(callback){
    MailBox.find({user:socket.request.user},callback);
  });

  

  socket.on('mailbox/get', function(data, callback){
    data.user = socket.request.user;
    MailBox.find(data, function(err, mailboxes){
      callback(err, mailboxes[0]);
    })
  });

  require('./sockets/imap.js')(socket);
  require('./sockets/smtp.js')(socket);
  require('./sockets/settings.js')(socket);
  



}
module.exports.getSettings = function(){
  return {
    "MailBox": {
      "googleLoginEnable" : MailBox.googleLoginEnable
    }
  }
}
