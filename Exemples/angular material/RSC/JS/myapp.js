//
var myapp = angular.module('Uploader', ['ngMaterial', 'ngAnimate']);
//
myapp.controller('mainControl', function($scope, $http, $mdDialog, $location) {
    // static vars :
    $scope.app = {};
    $scope.app.name = "Swagger uploader";
    $scope.app.version = "v0.1a";
    $scope.app.description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamc";
    $scope.app.url = $location.absUrl();
    $scope.app.wiki_help = "wiki";
    $scope.app.new_ticket = "newticket";
    $scope.app.bug_kanban = "bug_kanban";
    $scope.swagger_ui_url = "swagger";
    // other vars :
    $scope.loading = 0;  // loading bar state (0: disabled, >=1: there is a request pending)

    $scope.reset_filters = function () {
        $scope.searchfilter = {};
        $scope.searchfilter.folder = {};
        $scope.searchfilter.file = {};
    }

    $scope.refresh_domains = function () {
        $scope.loading ++;
        $scope.folders = [];  // reset domain list
        $http.get('/data').then(function(response) {
            $scope.folders = response.data;
            $scope.loading --;
        }, function(response) {
            console.log("error : GET /data", response);
            $scope.loading --;
        });
    }

    $scope.refresh_domain_folders = function (domain) {
        $scope.loading ++;
        domain.folders = [];  // reset domain folder list
        $http.get('/data/' + domain.name).then(function(response) {
            domain.folders = response.data.folders;
            $scope.loading --;
        }, function(response) {
            console.log("error : GET /data/" + domain.name, response);
            $scope.loading --;
        });
    }

    $scope.refresh_folder_files = function (domain, folder) {
        $scope.loading ++;
        folder.files = [];  // reset folder file list
        $http.get('/data/' + domain.name + '/' + folder.name).then(function(response) {
            folder.files = response.data.files;
            $scope.loading --;
        }, function(response) {
            console.log("error : GET /data/" + domain.name + '/' + folder.name, response);
            $scope.loading --;
        });
    }

    $scope.add_folder = function (domain) {
        $mdDialog.show({
            templateUrl: 'RSC/html/new-folder.tmpl.html',
            locals: {
                domain: domain,
            },
            scope: $scope.$new(),
            fullscreen: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            parent: angular.element(document.body),
            controller: ['$scope', '$mdDialog', 'domain',
                function controller($scope, $mdDialog, domain) {
                    $scope.domain = domain;
                    $scope.folder_name = "";
                    $scope.err_msg = "";

                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };

                    $scope.exist_folder = function () {
                        return domain.folders.some(function(folder) {
                            return folder.name === $scope.folder_name;
                        });
                    }

                    $scope.create_folder = function() {
                        if ($scope.folder_name && ! $scope.exist_folder())
                            $http.post('/data/' + domain.name + '/' + $scope.folder_name).then(function() {
                                $scope.refresh_domain_folders(domain);
                                $scope.closeDialog();
                            }, function(response) {
                                console.log("error : POST /data/" + domain.name + '/' + $scope.folder_name, response);
                                $scope.err_msg = "error : POST /data/" + domain.name + '/' + $scope.folder_name + " : " + response.statusText;
                            });
                        else
                            $scope.err_msg = "Please choose a correct folder name !";
                    }
                }
            ]
        });
    }

    $scope.upload_file = function (domain, folder) {
        $mdDialog.show({
            templateUrl: 'RSC/html/upload-dialog.tmpl.html',
            locals: {
                folder: folder,
                domain: domain,
            },
            scope: $scope.$new(),
            fullscreen: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            parent: angular.element(document.body),
            controller: ['$scope', '$mdDialog', 'folder', 'domain',
                function controller($scope, $mdDialog, folder, domain) {
                    $scope.folder = folder;
                    $scope.domain = domain;
                    $scope.file_name = "";
                    $scope.selected_file = "";
                    $scope.err_msg = "";

                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };

                    $scope.exist_file = function () {
                        return $scope.folder.files.some(function(file) {
                            return file.name === $scope.file_name;
                        });
                    }

                    $scope.choose_file = function(element) {  // select the user selected file
                        $scope.$apply(function($scope) {
                            $scope.selected_file = element.files[0];
                            $scope.file_name = $scope.selected_file.name;
                        });
                    }

                    $scope.upload_file = function() {
                        if ($scope.selected_file && $scope.file_name && $scope.file_name.endsWith('.json')) {
                            var fd = new FormData();
                            fd.append('swagger', $scope.selected_file);
                            $http.post('/data/' + domain.name + '/' + folder.name + '/' + $scope.file_name, fd, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined } // reset it, it'll be automaticaly set to the good one
                            }).then(function() {
                                $scope.refresh_folder_files(domain, folder);
                                $scope.closeDialog();
                            }, function(response) {
                                console.log("error : POST /data/" + domain.name + '/' + folder.name + '/' + $scope.file_name, response);
                                $scope.err_msg = "error : POST /data/" + domain.name + '/' + folder.name + '/' + $scope.file_name + " : " + response.statusText;
                            });
                        } else
                            $scope.err_msg = "Please choose a correct file !";
                    }
                }
            ]
        });
    }
    //
    $scope.delete_folder = function (domain, folder) {
        $mdDialog.show({
            templateUrl: 'RSC/html/delete-folder.tmpl.html',
            locals: {
                folder: folder,
                domain: domain,
            },
            scope: $scope.$new(),
            fullscreen: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            parent: angular.element(document.body),
            controller: ['$scope', '$mdDialog', 'folder', 'domain',
                function controller($scope, $mdDialog, folder, domain) {
                    $scope.folder = folder;
                    $scope.domain = domain;
                    $scope.err_msg = "";

                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };

                    $scope.delete_request = function () {
                        $http.delete('/data/' + domain.name + '/' + $scope.folder.name).then(function() {
                            $scope.refresh_domain_folders(domain);
                            $scope.closeDialog();
                        }, function(response) {
                            console.log("error : DELETE /data/" + domain.name + '/' + $scope.folder.name, response);
                            $scope.err_msg = "error : DELETE /data/" + domain.name + '/' + $scope.folder.name + " : " + response.statusText;
                        });
                    }
                }
            ]
        });
    }

    $scope.delete_file = function (domain, folder, file) {
        $mdDialog.show({
            templateUrl: 'RSC/html/delete-file.tmpl.html',
            locals: {
                folder: folder,
                domain: domain,
                file: file,
            },
            scope: $scope.$new(),
            fullscreen: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            parent: angular.element(document.body),
            controller: ['$scope', '$mdDialog', 'folder', 'domain', 'file',
                function controller($scope, $mdDialog, folder, domain, file) {
                    $scope.folder = folder;
                    $scope.domain = domain;
                    $scope.file = file;
                    $scope.err_msg = "";

                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };

                    $scope.delete_request = function () {
                        $http.delete('/data/' + domain.name + '/' + $scope.folder.name + '/' + $scope.file.name).then(function() {
                            $scope.refresh_folder_files(domain, folder);
                            $scope.closeDialog();
                        }, function(response) {
                            console.log("error : DELETE /data/" + domain.name + '/' + $scope.folder.name + '/' + $scope.file.name, response);
                            $scope.err_msg = "error : DELETE /data/" + domain.name + '/' + $scope.folder.name + '/' + $scope.file.name + " : " + response.statusText;
                        });
                    }
                }
            ]
        });
    }
    // at app start :
    $scope.reset_filters();  // reset filters
    $scope.refresh_domains();  // refresh list
});

// IE support
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
