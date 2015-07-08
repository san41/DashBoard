Structure
============================

 .. sourcecode:: bash

    plugins/
    └── pluginName/ 
          ├── server/ 
          │   ├── models/
          │   │   └── ...
          │   ├── sockets/
          │   │   └── ...
          │   ├── index.js
          │   ├── passport.js
          │   └── routes.js
          │
          ├── client/ 
          │   ├── controllers/
          │   │   └── ...
          │   ├── public/
          │   │   └── ...
          │   ├── settings/
          │   │   ├── controllers/
          │   │   │  └── ...
          │   │   ├── views/
          │   │   │  └── ...
          │   │   └── index.js
          │   ├── public/
          │   ├── index.js
          |   │   └── ...
