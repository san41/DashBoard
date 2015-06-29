// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        username     : String,
        email        : String,
        password     : String,
    },
    password     : String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    if(this.password != undefined){
          return bcrypt.compareSync(password, this.password);
    }else if(this.local.password != undefined){
      this.password = this.local.password;
      this.local.password = null;
      this.save();
      return bcrypt.compareSync(password, this.password);
    }else
      return false;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);