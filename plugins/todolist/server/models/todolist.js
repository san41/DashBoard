var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoListSchema = mongoose.Schema({
  name: String,
  items: [ {name: String, checked:Boolean} ],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('TodoList', todoListSchema);
