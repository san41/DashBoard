Client
=======

The client is located in your plugin's `client` directory.  It contains, your settings, views, and controllers


index.js
----------

The `index.js` file would be located in the root of your `client` folder (see :doc:`structure`). 

First, your `index.js` would contains 

.. code:: javascript

  var plugin = getPlugin('pluginName');

Your plugin name must be exaclty the same as your plugin directory name.

Controller
~~~~~~~~~~~~

Then, you need to declare your plugin controller. 
The Dashboard use `AngularJS`_ for the client views.

To declare your controller in your plugin you must use : 

.. code:: javascript 

  plugin.registerController('YourController',  require('./controller/yourController.js'));

and in `controller/yourController.js` : 

.. code:: javascript

  module.exports = function($scope, socket,toaster){

  }


.. tip:: You can add other property in your controller

Routes
~~~~~~~

After adding your controllers, now you must add the routing rules. 

.. code:: javascript

  plugin.registerRoute('/yourRoute', {
    templateUrl: "yourView.html",
    controller:"YourController" 
  });


.. note:: The `templateUrl` is the path of your view file in your plugin `views` folder.

Menu items
~~~~~~~~~~~~

Now, you must add the menu item


.. code:: javascript

  plugin.registerMenuItem('YourMenuTitle', '/yourRoute', 'fa-envelope');

.. note:: The third parameter (`fa-envelope`) is the menu item logo. It use `Font Awesome`_ icons

.. _AngularJS: https://angularjs.org
.. _Font Awesome: http://fortawesome.github.io/Font-Awesome/icons/

Widget
~~~~~~~~~

.. warning:: This feature may change soon


.. code:: javascript

  plugin.registerWidget("widgetName", "widgetName.html", function($scope, socket){

  }, function($scope, socket, $element){

  })

The first parameter is the name of the widget.
The second parameter is is the path of your view file in your plugin's `views` folder.
The third parameter is the widget controllers
The fourth parameter is the widget configuration controllers

.. note:: The widget configuration view path for the `widgetName.html` view is `widgetName-config.html`
