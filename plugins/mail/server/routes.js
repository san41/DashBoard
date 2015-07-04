var MailBox = require('./models/mailbox.js');


module.exports = function(app, passport){
  app.get('/mailbox/auth/google',
            passport.authorize('gmail-login', { scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'http://mail.google.com'], accessType: 'offline', approvalPrompt: 'force' }));

    app.get('/mailbox/auth/google/callback', 
      passport.authorize('gmail-login', { failureRedirect: '#/settings/mailbox' }),
      function(req, res) {
        MailBox.findById(req.account._id, function(err, mailbox){
          if(err) return;
          mailbox.user = req.user;
          mailbox.save(function(err, saved){});
        });
        res.redirect('#/settings/mailbox');
    });

}