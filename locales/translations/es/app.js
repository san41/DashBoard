angular.module('dbapp').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('es', {"New widget":"Nuevo widget","Widget":"Widget","Sign in":"iniciar sesión","Remember me":"Acuérdate de mí","I forgot my password":"He perdido mi contraseña","Sign up":"Registrarse"});
/* jshint +W100 */
}]);