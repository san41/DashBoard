var plugin = getPlugin('todolist');

plugin.registerController('TodoListController', require('./controller/todolist.js'));

plugin.registerRoute('/todolist', {
  controller: 'TodoListController',
  templateUrl: 'index.html'
});

plugin.registerMenuItem('TodoList', '/todolist', 'fa-list-alt');