angular.module('dbapp').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('fr', {"New widget":"Nouveau widget","Widget":"Widget","Sign in":"Connexion","Remember me":"Se souvenir de moi","I forgot my password":"Mot de passe oublié","Sign up":"Inscription"});
/* jshint +W100 */
}]);