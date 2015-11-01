'use strict';

var app = angular.module('lafete', ['ngRoute', 'ngResource'])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        redirectTo: '/events'
      })
      .when('/events', {
        templateUrl: 'source/scripts/partials/event-list.html',
        controller: 'EventController'
      })
      .when('/events/:id', {
        templateUrl: 'source/scripts/partials/event-detail.html',
        controller: 'EventDetailController'
      });

    $locationProvider.html5Mode(true);

  });

app.factory('Event', function($http) {
  return {
    getAll: function(callback) {
      $http.get('/api/events/').success(callback);
    },
    getOne: function(id, callback) {
      $http.get('/api/events/' + id).success(callback);
    }
  }
});

app.controller('EventController', function($scope, Event) {
  Event.getAll(function(data) {
    $scope.events = data;
  });
});

app.controller('EventDetailController', function($scope, $routeParams, Event) {
  Event.getOne($routeParams.id, function(data) {
    $scope.event = data;
  });
});