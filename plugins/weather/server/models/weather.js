var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weatherSchema = mongoose.Schema({
  name: String,
  lat: String,
  lng: String,
  cityId : String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Weather', weatherSchema);
