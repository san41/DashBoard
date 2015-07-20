angular.module('dbapp').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('en', {"New widget":"New widget","Widget":"Widget","Sign in":"Sign in","Remember me":"Remember me","I forgot my password":"I forgot my password","Sign up":"Sign up"});
/* jshint +W100 */
}]);