var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weatherSchema = mongoose.Schema({
  name: String,
  cityid: String,
  position : Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Weather', weatherSchema);
