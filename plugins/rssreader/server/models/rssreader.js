var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rssReaderSchema = mongoose.Schema({
  name: String,
  url: String,
  category: String,
  color: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('RssReader', rssReaderSchema);
