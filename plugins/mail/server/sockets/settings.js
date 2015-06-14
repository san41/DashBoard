var MailBox = require('../models/mailbox.js')


module.exports = function(socket){

  socket.on('mailbox/save', function(data, callback){
    if(data._id == null){
      data.user = socket.request.user;
      MailBox.create(data, callback);
    }else{
      var id = data._id
      delete data._id;
      MailBox.update({_id:id}, data, {}, callback);
    }
  });

  socket.on('mailbox/delete', function(data, callback){
    MailBox.findOneAndRemove({_id: data._id, user:socket.request.user}, callback);
  });

}