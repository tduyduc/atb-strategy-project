/// <reference path="angular.d.ts" />

interface CustomScope extends angular.IScope {
  something: string;
}

class MainController implements angular.IController {
  controller: ($scope: CustomScope) => void;

  constructor() {
    this.controller = function($scope: CustomScope) {
      $scope.something = 'This is a string!';
    }
  }

  getController() {
    return this.controller;
  }
}
