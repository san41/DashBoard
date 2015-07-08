Server
=========

index.js
----------

The `index.js` server file contains the server `socket.io`_ events.

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


.. _socket.io: http://socket.io/