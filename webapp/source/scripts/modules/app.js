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
        .when('/events/add', {
          templateUrl: 'source/scripts/partials/event-add.html',
          controller: 'EventAddController'
        })
        .when('/events/:id', {
          templateUrl: 'source/scripts/partials/event-detail.html',
          controller: 'EventDetailController'
        })
        .when('/events/:id/edit', {
          templateUrl: 'source/scripts/partials/event-edit.html',
          controller: 'EventEditController'
        })
        .when('/events/:id/guest/add', {
          templateUrl: 'source/scripts/partials/guest-add.html',
          controller: 'GuestAddController'
        })

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
      addEvent: function(event, callback) {
        $http.post('/api/events/', {id : event.id, name : event.name, description : event.description, targetGroup : event.targetGroup, contributionDescription : event.contributionsDescription, location : event.location, times : event.times}).success(callback);
      },
      deleteGuestFromEvent: function(eventId, guestId, callback) {
        $http.delete('/api/events/' + eventId + "/guests/" + guestId).success(callback);
      },
      addGuestToEvent: function(eventId, guest, callback) {
        $http.post('/api/events/' + eventId + '/guests', {id : guest.id, name : guest.name, contribution : guest.contribution, comment : guest.comment}).success(callback);
      }
    }
  });

  app.controller('EventController', function($scope, $location, $timeout, Event) {
    Event.getAll(function(data) {
      $scope.events = data;
      $scope.events.length = data.events.length;
    });

    $scope.switchToEventAdd = function() {
      $location.url("/events/add");
    }

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

    $scope.switchtToGuestAdd = function(eventId) {
      $location.url("/events/" + eventId + "/guest/add");
    }

    $scope.switchtToEventEdit = function(eventId) {
      $location.url("/events/" + eventId + "/edit");
    }
  });

  app.controller('EventAddController', function($scope, $location, Event) {
    $scope.create = function(event) {
      $scope.master = angular.copy(event);
      Event.addEvent(event, function(data) {
        $location.url("/events/");
      });
    };
  });

  app.controller('EventEditController', function($scope, $location, Event) {
    console.log("blub");
    Event.getOne(event.id, function(data) {
      console.log(data);
    });
  });

  app.controller('GuestAddController', function($scope, $location, $routeParams, Event) {
    $scope.master = {};

    $scope.create = function(guest) {
      $scope.master = angular.copy(guest);
      Event.addGuestToEvent($routeParams.id, guest, function(data) {
        $location.url("/events/" + $routeParams.id);
      });
    };
  });

}());
