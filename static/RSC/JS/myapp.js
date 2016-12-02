//
var myapp = angular.module('Uploader', ['ngMaterial', 'ngAnimate']);
//
myapp.controller('mainControl', function($scope, $http, $mdDialog, $mdSidenav, $location) {
    // static vars :
    $scope.app = {};
    $scope.app.name = "Pas de toit pas de chocolat";
    $scope.app.version = "v0.1";
    $scope.app.description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamc";
    $scope.app.url = $location.absUrl();

    // other vars :
    $scope.loading = 0;  // loading bar state (0: disabled, !=0 : there is a request pending)
    $scope.main_page = true;

    $scope.refresh_annonces = function() {
        $http({
            method: 'GET',
            url: '/annonce'
        }).then(function (response) { // on success
            $scope.annonces = response.annonces;
        }, function (response) { // on error
            console.log(response);
        });
    };

    // menu
    $scope.toggleLeft = buildToggler('left');
    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    };

    // au demarage, rafraichir les données
    $scope.refresh_annonces();
});

// IE support
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

