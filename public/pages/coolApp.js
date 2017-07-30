var coolApp = angular.module('cool', [
    'ngMaterial',
    'ngRoute'
]);

coolApp.config(function ($routeProvider) {
    $routeProvider
        .when("/new", {
            templateUrl: 'pages/tasks/new.html',
            controller: 'createCtrl'
        })
        // .when("/edit", {
        //     templateUrl: 'pages/tasks/edit.html',
        //     controller: 'editCtrl'
        // })
        // .when("/", {
        //     templateUrl: 'pages/tasks/all.html',
        //     controller: 'allCtrl'
        // })
        .when("/all", {
            templateUrl: 'pages/tasks/all.html',
            controller: 'allCtrl'
        })
        .when("/login", {
            templateUrl: 'pages/tasks/login.html',
            controller: 'loginCtrl'
        })
        // .otherwise({
        //     templateUrl: 'pages/tasks/all.html',
        //     controller: 'allCtrl'
        // })
        ;
});

coolApp.service('api', function ($http) {
    // sample http api POST request
    let sampleHttpApiCall = function (method, jsonData, next) {
        var base = 'http://localhost:3300'
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": base+"/api/tasks",
            method: method,
            "headers": {
                "content-type": "application/json",
            },
        };
        if (window.localStorage.loggedIn == 1) {
            settings.headers.username = window.localStorage.username;
        }
        if (method != 'GET') {
            settings.data = jsonData
        }
        $http(settings).success(function (response) {
            console.log('Http response ', response);
            if (response.ok) {
                next(response);
            } else {
                console.error("error with http api: ", repsonse)
            }
        });
    };

    this.login = function login(username, next) {
        window.localStorage.username = username;
        window.localStorage.loggedIn = 1;
        sampleHttpApiCall('GET', {}, next);
    }

    this.allTasks = function allTasks(next) {
        sampleHttpApiCall('GET', {}, next);
    }

    this.createOne = function createOne(data, next) {
        sampleHttpApiCall('POST', data, next);
    }

    this.deleteOne = function deleteOne(id, next) {
        sampleHttpApiCall('DELETE', { id: id }, next);
    }

    this.updateOne = function updateOne(data, next) {
        sampleHttpApiCall('PUT', data, next);
    }

});

coolApp.controller('app', function ($scope, api, $location) {
    console.log('app init')
    let s = $scope;
    $scope.selectedIndex = 1;
    $scope.currentNavItem = 'new';
    /* $scope.$watch('selectedIndex', function (current, old) {
        previous = selected;
        selected = tabs[current];
        if (old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
        if (current + 1) $log.debug('Hello ' + selected.title + '!');
    }); */
    $scope.$watch('currentNavItem', function (current, old) {
        console.log('current hash changed')
        //$location.hash($scope.currentNavItem);
    });
    s.loc = function (name) {
        $scope.currentNavItem = name;
        window.location = '#/' + name;
        //$scope.$digest();
    }
    s.logout = function () {
        window.localStorage.loggedIn = 0;
        delete window.localStorage.username;
        s.loggedIn = false;
        window.location = "#/login"
        //s.loc('login')
    }
    s.loggedIn = (window.localStorage.loggedIn == 1);
    if (!s.loggedIn) {
        //s.loc('login')
        window.location = "#/login"
    } else {
        s.username = (window.localStorage.username);
        console.log('setting you a trap')
        s.loc('new');
    }
});

coolApp.controller('loginCtrl', function ($scope, api) {
    let s = $scope;
    s.login = function () {
        if (s.username && s.username.length > 0) {
            api.login(s.username, function () {
                $scope.$parent.loc('new');
                s.$parent.loggedIn = true;
                s.$parent.username = s.username;
            })
        }
    }
});

coolApp.controller('createCtrl', function ($scope, api, $mdToast) {
    $scope.data = {};
    $scope.create = function () {
        api.createOne($scope.data, function () {
            console.log('created one');
            $scope.data = {};
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Created!')
                    .hideDelay(1000)
            );
        })
    }
});

coolApp.controller('allCtrl', function ($scope, api, $mdDialog, $mdToast) {
    $scope.list = [];
    api.allTasks(function (response) {
        console.log('allre ', response);
        $scope.list = response.tasks.map(i => {
            i.date = new Date(i.due).toDateString();
            return i;
        });
    })

    $scope.edit = function (ev, task) {
        console.log(task);
        $mdDialog.show({
            controller: function ($scope, api) {
                let edataObje = JSON.parse(JSON.stringify(task));
                edataObje.due = new Date(task.due);
                $scope.edata = edataObje;
                $scope.save = function () {
                    api.updateOne({
                        due: $scope.edata.due,
                        what: $scope.edata.what,
                        id: $scope.edata._id,
                    }, function () {
                        console.log('updated one');
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Updated!')
                                .hideDelay(1000)
                        );
                        $mdDialog.hide($scope.edata);
                    })
                }
            },
            templateUrl: 'pages/tasks/edit.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false // Only for -xs, -sm breakpoints.
        })
            .then(function (d) {
                // after close
                task.date = new Date(d.due).toDateString();
                task.what = d.what;
                window.location = '#/all';

            }, function () {

            });
    };

    $scope.delete = function (task) {
        console.log('TOdelete ', task)
        const idToDel = task._id;
        api.deleteOne(task._id, function () {
            console.log('deleted one');
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Deleted!')
                    .hideDelay(1000)
            );
             $scope.list =  $scope.list.filter(i=>{
                 return idToDel != i._id;
             })
        });
    }

});

//coolApp.controller('editCtrl', );
