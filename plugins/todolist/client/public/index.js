(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($scope, socket, toaster){

  $scope.todolist = []
  $scope.newItemName = "";
  var todolistByName = {};

  socket.emit('todolist/list', function(err,data){
    if(err){
      toaster.pop('error', 'Error', 'Error on getting totolist');
      console.err(err);
      return;
    }
    $scope.todolist = data;
    for(var i in data){
      var list = data[i];
      todolistByName[list.name] = list;
    }

  });

  $scope.createList = function(){
    var totoListName = $scope.newTodoName;
    socket.emit('todolist/create', totoListName, function(err, list){
      if(err){
        toaster.pop('error', 'Error', 'Error on creating totolist');
        console.err(err);
        return;
      }
      $scope.todolist.push(list);
      $scope.newTodoName = "";
      todolistByName[list.name] = list;
    })
  }

  $scope.createItem = function(list, itemName){
    socket.emit('todolist/newItem', list, itemName, function(err, list){
      if(err){
        toaster.pop('error', 'Error', 'Error on creating item');
        console.error(err);
        return;
      }
      todolistByName[list.name] = list;
      $scope.todolist = Object.keys(todolistByName).map(function(key){ return todolistByName[key]; })
    })
  }
  $scope.toggleCheck = function(list, item){
    socket.emit('todolist/toggleCheck', list, item, function(err, list){
      if(err){
        toaster.pop('error', 'Error', 'Error on toggle item');
        console.error(err);
        return;
      }
      todolistByName[list.name] = list;
      $scope.todolist = Object.keys(todolistByName).map(function(key){ return todolistByName[key]; })
    })
  }

  $scope.deleteList = function(list){
    socket.emit('todolist/deleteList', list, function(err){
      if(err){
        toaster.pop('error', 'Error', 'Error on removing list');
        console.error(err);
        return;
      }
      delete todolistByName[list.name];
      $scope.todolist = Object.keys(todolistByName).map(function(key){ return todolistByName[key]; })
    })
  }
  $scope.deleteItem = function(list, item){
    socket.emit('todolist/deleteItem', list, item, function(err, list){
      if(err){
        toaster.pop('error', 'Error', 'Error on removing item');
        console.error(err);
        return;
      }
      todolistByName[list.name] = list;
      $scope.todolist = Object.keys(todolistByName).map(function(key){ return todolistByName[key]; })
    })
  }

}
},{}],2:[function(require,module,exports){
var plugin = getPlugin('todolist');

plugin.registerController('TodoListController', require('./controller/todolist.js'));

plugin.registerRoute('/todolist', {
  controller: 'TodoListController',
  templateUrl: 'index.html'
});

plugin.registerMenuItem('TodoList', '/todolist', 'fa-list-alt');
},{"./controller/todolist.js":1}]},{},[2])