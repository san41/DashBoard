var MailBox = require('./models/mailbox.js');


module.exports = function(app, passport){
  app.get('/mailbox/auth/google',
    passport.authorize('gmail-login', { scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'http://mail.google.com'], accessType: 'offline', approvalPrompt: 'force' }));

  app.get('/mailbox/auth/google/callback', 
    passport.authorize('gmail-login', { failureRedirect: '#/settings/mailbox' }),
    function(req, res) {
      res.redirect('save/' + req.account._id);
    });

  app.get('/mailbox/auth/google/save/:id', function(req, res){
    MailBox.findById(req.param('id'), function(err, mailbox){
      if(err){
        res.redirect('../../../../#/settings/mailbox');
      }else{
        mailbox.user = req.user;
        mailbox.save(function(err, saved){
          res.redirect('../../../../#/settings/mailbox');    
        });
      }
      
    });
  })

}