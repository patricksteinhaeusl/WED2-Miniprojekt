'use strict';

(function() {
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
      getOne: function(eventId, callback) {
        $http.get('/api/events/' + eventId).success(callback);
      },
      deleteGuestFromEvent: function(eventId, guestId, callback) {
        $http.delete('/api/events/' + eventId + "/guests/" + guestId).success(callback);
      }
    }
  });

  app.controller('EventController', function($scope, $location, $timeout, Event) {
    Event.getAll(function(data) {
      $scope.events = data;
    });

    $scope.switchToEventDetail = function(event) {
      $location.url("/events/" + event.id);
    }
  });

  app.controller('EventDetailController', function($scope, $location, $timeout, $routeParams, Event) {
    Event.getOne($routeParams.id, function(data) {
      $scope.event = data;
      $scope.event.guests.length = data.guests.length;
    });

    $scope.deleteGuestFromEvent = function(eventId, guestId) {
      Event.deleteGuestFromEvent(eventId, guestId, function(data) {
        $timeout(function() {
          $scope.event = data;
        }, 500);
      });
    };
  });

}());
