var TodoList = require('./models/todolist.js');
module.exports = function(socket){


  socket.on('todolist/list', function(callback){
    TodoList.find({user:socket.request.user}, callback);
  })

  socket.on('todolist/create', function(name, callback){
    var todoList = new TodoList({name: name, items: []});
    todoList.user = socket.request.user;
    todoList.save(callback);
  });

  socket.on('todolist/newItem', function(list, name, callback){
    TodoList.findById(list._id, function(err, todoList){
      if(err){
        callback(err);
        return;
      }
      todoList.items.push({name:name, checked:false});
      todoList.save(callback);
    });
  });

  socket.on('todolist/toggleCheck', function(list, item, callback){
    TodoList.findById(list._id, function(err, todoList){
      if(err){
        callback(err);
        return;
      }
      for(var i in todoList.items){
        var it = todoList.items[i];
        if(it._id == item._id){
          it.checked = !it.checked;
          todoList.items[i] = it; 
        }
      }
      console.log(todoList.items);
      todoList.save(callback);
    });
  });

  socket.on('todolist/deleteList', function(list, callback){
    TodoList.findById(list._id, function(err, todoList){
      todoList.remove(callback);
    });
  });
  socket.on('todolist/deleteItem', function(list, item, callback){
    console.log(item);
    TodoList.findById(list._id, function(err, todoList){
      var index = -1;
      for(var i in todoList.items){
        var it = todoList.items[i];
        if(it._id == item._id){
          index = i;
        }
      }
      if(index >= 0){
        todoList.items.splice(index, 1);
      }
      todoList.save(callback);
    });
  });

}