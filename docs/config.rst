.. config-guide:
Configuration guide
#####################
.. module:: conf
  :synopsis: Build configuration file.

.. _conf-tags

General configuration
***********************

* url

The default url for your dashboard

Exemple: ` http://dashboard.exemple.com/` 


Database
**********

`MongoDB`_ access configuration

* url

It is the database server url

Exemple: ` mongodb://localhost:27017/dashboard` 

* user (optional)
 
If your mongodb database required a authentification, it is your database user


Exemple: `yourLogin` 

* pass (optional)

 
If your mongodb database required a authentification, it is your database pass


Exemple: `yourPass`

Google
*******

Google configuration

Auth
^^^^^^^^^^^^^^^^^^^^^


* clientID
  
  Client id get from google console developers

* clientSecret

  Client secret key get from google console developers



.. _MongoDB: http://mongodb.org