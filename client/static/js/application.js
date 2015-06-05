var plugins = [];
var pluginsByName = {};

var Plugin = function(name){
  this.routes = {};
  this.controllers = {};
  this.menuItems = [];
  this.settings = new Settings();
}

Plugin.prototype.registerController = function(name, controllerFnc){
  if(this.controllers[name] != null){
    throw new Error('Controller '+ name + ' already exits');
  }
  this.controllers[name] = controllerFnc;
}

/**
* @param url exemple : "/mon/url"
* @param routeData : { controller: "MonController", templateURL: "index.js" }
**/
Plugin.prototype.registerRoute = function(url, routeData){
  if(this.routes[url] != null){
    throw new Error('Route '+ url + ' already exits');
  }
  this.routes[url] = routeData;
}

/**
* @param iconClass exemple : "fa-enveloppe"
**/
Plugin.prototype.registerMenuItem = function(title, url, iconClass){
  var data = {
    title: title, 
    url: url,
    iconClass: iconClass
  }
  this.menuItems.push(data);
}

var Settings = function(){
  this.routes = {};
  this.controllers = {};
  this.settingsItems = [];
};

Settings.prototype.registerController = function(name, controllerFnc){
  name = "Settings" + name; 
  if(this.controllers[name] != null){
    throw new Error('Controller '+ name + ' already exits');
  }
  this.controllers[name] = controllerFnc;
}

Settings.prototype.registerRoute = function(url, routeData){
  url = '/settings' + url;
  if(routeData.controller != null && !routeData.controller.startsWith('Settings')){
    routeData.controller = 'Settings' + routeData.controller;
  }
  if(this.routes[url] != null){
    throw new Error('Route '+ url + ' already exits');
  }
  this.routes[url] = routeData;
}

Settings.prototype.registerSettingsItem = function(title, url, iconClass){
  var data = {
    title: title, 
    url: '/settings' + url,
    iconClass: iconClass
  }
  this.settingsItems.push(data);
}


/**
* Get plugin by name & if plugin not exits create it
**/
function getPlugin(name){
  var plugin = null;
  if(pluginsByName[name] == null){
    plugin = new Plugin(name);
    plugins.push(plugin);    
    pluginsByName[name] = plugin;
  }else{
    plugin = pluginsByName[name];
  }
  return plugin;
}