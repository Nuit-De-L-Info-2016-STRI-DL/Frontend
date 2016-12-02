//
var myapp = angular.module('Uploader', ['ngMaterial', 'ngAnimate']);
//
myapp.controller('mainControl', function($scope, $http, $mdDialog, $mdSidenav, $location) {
    // static vars :
    $scope.app = {};
    $scope.app.name = "Pas de toit pas de chocolat";
    $scope.app.version = "v0.1";
    $scope.app.description = "description";
    $scope.app.url = $location.absUrl();

    // other vars :
    $scope.loading = 0;  // loading bar state (0: disabled, !=0 : there is a request pending)
    $scope.main_page = true;

    $scope.refresh_annonces = function() {
        $http.get('/annonce').then(function (response) { // on success
            $scope.annonces = response.data.annonces;
        }, function (response) { // on error
            console.log(response);
        });
    };

    $scope.push_annonces = function() {
    	if(!$scope.new_annonce || !$scope.new_annonce.title || !$scope.new_annonce.description) {
    	    return;
    	}
        $http({
            method: 'POST',
            url: '/annonce',
            data: $scope.new_annonce
        }).then(function (response) { // on success
            $scope.annonces = response.data.annonces;
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

