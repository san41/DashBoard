Server
=========

index.js
----------

The `index.js` server file contains the server `socketio`_ events.

The main strucure of the index.js file is: 

.. code:: javascript

  module.exports = function(socket){

    socket.on('...', function(){
        ...
    });

  }

The `index.js` can be contains, a settings who be pass after the socket.io connection

.. code:: javascript

  module.exports.getSettings = function(){
    return {
      ...
    }
  }



routes.js
-----------

This file is use only if you need to register new route on the web server. 

.. note:: For exemple, a new web server route can be used for api authentification callback

.. warning:: This is not the same as the client route


.. code:: javascript 
  
  module.exports = function(app, passport){
    ...
  } 

The `app` parameter is the `expressjs`_ instance. You can register your new route as :

.. code:: javascript
  
  app.get('/yourRoute', function(){
    ...  
  });

  app.put('/yourRoute', function(){
    ...  
  });

The `passport` parameter is the `passportjs` instance. It's used for the authentification.


passport.js
------------

`Passportjs` is the libary used for the dashboard authentifcation. But you can define new authentification strategy for exemple a new api autentification for your plugin. 

For this, you can register this new strategy in the `passport.js` file : 

.. code:: javascript

  module.exports = function(passport){
    ...
  }



.. _socketio: http://socket.io/
.. _expressjs: http://expressjs.com
.. _passportjs: http://passportjs.org


