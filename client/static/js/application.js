var plugins = [];
var pluginsByName = {};

var Plugin = function(name){
  this.routes = {};
  this.controllers = {};
  this.menuItems = [];

  

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

  function createPlugin(name){
    var plugin = new Plugin(name);
    plugins.push(plugin);    
    pluginsByName[name] = plugin;
    return plugin;
  }