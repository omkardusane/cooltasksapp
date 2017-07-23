/**
 * Created by Omkar Dusane on 27-Oct-16.
 */

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
        .when("/edit", {
            templateUrl: 'pages/tasks/edit.html',
            controller: 'editCtrl'
        })
        .when("/", {
            templateUrl: 'pages/tasks/all.html',
            controller: 'allCtrl'
        })
        .when("/login", {
            templateUrl: 'pages/tasks/login.html',
            controller: 'loginCtrl'
        })
        .otherwise({
            templateUrl: 'pages/tasks/all.html',
            controller: 'allCtrl'
        });
});

coolApp.service('api', function ($http) {
    // sample http api POST request
    let sampleHttpApiCall = function (method, jsonData, next) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/tasks",
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
                console.error("error with http api: " ,repsonse)
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

    this.createOne = function createOne(data,next) {
        sampleHttpApiCall('POST', data, next);
    }

    this.deleteOne = function deleteOne(id,next) {
        sampleHttpApiCall('DELETE', { id: id }, next);
    }

    this.updateOne = function updateOne(data,next) {
        sampleHttpApiCall('PUT', data, next);
    }

});

coolApp.controller('app', function ($scope, api) {
    $scope.currentNavItem = 'all';
    let s = $scope;
    s.loc = function (hash) {
        window.location = hash;
    }
    s.logout = function () {
        window.localStorage.loggedIn = 0;
        delete window.localStorage.username;
        s.loggedIn = false;
        window.location = "#/login"
    }
    s.loggedIn = (window.localStorage.loggedIn == 1);
    if (!s.loggedIn) {
        window.location = "#/login"
    } else {
        s.username = (window.localStorage.username );
    }
});

coolApp.controller('loginCtrl', function ($scope, api) {
    let s = $scope;
    s.login = function () {
        if (s.username && s.username.length > 0) {
            api.login(s.username, function () {
                window.location = "#/new"
                s.$parent.currentNavItem = 'new';

                s.$parent.loggedIn = true;
                s.$parent.username = s.username;
            })
        }
    }
});

coolApp.controller('createCtrl', function ($scope, api) {
    $scope.data = {};
    $scope.create = function(){
        api.createOne($scope.data,function(){
            console.log('created one');
        })
    }
});

coolApp.controller('allCtrl', function ($scope, api) {
    $scope.list =[];
    api.allTasks(function(response){
        console.log('allre ',response);
        $scope.list = response.tasks.map(i=>{
            i.date = new Date(i.due).toDateString();
            return i;
        });
        
    })

});
coolApp.controller('editCtrl', function ($scope, api) {
    $scope.sample = "data";
});
