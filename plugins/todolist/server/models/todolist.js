var mongoose = require('mongoose');

var todoListSchema = mongoose.Schema({
  name: String,
  items: [ {name: String, checked:Boolean} ]
});

module.exports = mongoose.model('TodoList', todoListSchema);
