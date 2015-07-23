// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var widgetSchema = mongoose.Schema({
  plugin: String,
  name: String,
  colWidth: Number,
  order: Number,
  settings: Object,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Widget', widgetSchema);