var _ = require('underscore');

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
    if(totoListName.length == 0 || todolistByName[totoListName] != null){
      return;
    }
    socket.emit('todolist/create', totoListName, function(err, list){
      if(err){
        toaster.pop('error', 'Error', 'Error on creating totolist');
        console.err(err);
        return;
      }
      $scope.newTodoName = "";
      todolistByName[list.name] = list;
      $scope.todolist = _.values(todolistByName);
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
      $scope.todolist = _.values(todolistByName);
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
      $scope.todolist = _.values(todolistByName);
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
      $scope.todolist = _.values(todolistByName);
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
      $scope.todolist = _.values(todolistByName);
    })
  }

}