var MailBox = require('./models/mailbox.js');

module.exports = function(passport){

  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var GOOGLE_CLIENT_ID = config.google.auth.clientID;
  var GOOGLE_CLIENT_SECRET = config.google.auth.clientSecret;
  if(GOOGLE_CLIENT_ID != null && GOOGLE_CLIENT_ID.length > 1 && GOOGLE_CLIENT_SECRET != null && GOOGLE_CLIENT_SECRET.length > 1){
    MailBox.googleLoginEnable = true;
    passport.use('gmail-login', new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:5555/mailbox/auth/google/callback"
    }, function(accessToken, refreshToken, profile, done) {
      MailBox.find({googleId: profile.id}, function(err, mailbox){
        if(err == null && mailbox.length == 0){
          var email = profile.emails[0].value;
          var mb = new MailBox({
            type: 'google',
            name: email,
            email: email,
            googleId: profile.id,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            accessToken: accessToken,
            refreshToken: refreshToken,
            color: "#f22626"
          });
          mb.save(function(err, mbSaved){
            console.log(err, mbSaved);
            done(err, mbSaved);
          });    
        }else{
          done(err, mailbox);
        }
      })
    }
    ));
  }
}