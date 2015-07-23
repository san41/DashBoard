module.exports = function(app){
  app.directive("widgetconfig", function($compile, $templateCache, $templateRequest){
    var getTemplate = function(data) {
        // use data to determine which template to use
        var template = $templateRequest(data);
        return template;
      }

      return {
        restrict: "E",
        scope:{
          widget: "="  
        },
        template :"<div>  </div>",
        link: function(scope, element){
          function update(){
            getTemplate(scope.widget.templateURLConfig).then(function(tpl){
              console.log('update');
              var e = $compile(tpl)(scope);
              element.empty();
              element.append(e);
            });
          }
          scope.$watch('widget._id', function(){
            console.log(scope.widget);
            update();
          });
          update();
        }

      };
    });

  app.directive("widget", function($compile, $templateCache, $templateRequest){
    var getTemplate = function(data) {
        // use data to determine which template to use
        var template = $templateRequest(data);
        return template;
      }

      return {
        restrict: "E",
        scope:{
          widget: "="  
        },
        template :"<div>  </div>",
        link: function(scope, element){
          getTemplate(scope.widget.templateURL).then(function(tpl){
            var e = $compile(tpl)(scope);
            e.addClass("col-md-" + scope.widget.colWidth);
            element.append(e);
          });
        }

      };
    });
  

}