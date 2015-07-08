Settings
=========

index.js
---------

The `index.js` client settings are similar as the `index.js` client but it has little difference

First, you need to get the settings instance of your plugin : 

.. code:: javascript

  var settings = getPlugin('mail').settings;


Controller and routes
~~~~~~~~~~~~~~~~~~~~~~~~

The controller and the route declaration are the same as the `index.js` client declaration (see :doc:`client`)


Settigns Menu items
~~~~~~~~~~~~~~~~~~~~~~~~

Now, you must add the settings menu item

.. code:: javascript

  settings.registerSettingsItem('YourMenuTitle', '/yourRoute', 'fa-envelope');

.. note:: The third parameter (`fa-envelope`) is the menu item logo. It use `Font Awesome`_ icons

.. _Font Awesome: http://fortawesome.github.io/Font-Awesome/icons/


