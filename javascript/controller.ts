/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/scope.d.ts" />

class MainController implements angular.IController {
  controller: ($scope: CustomScope) => void;

  constructor() {
    this.controller = ($scope: CustomScope) => {
      $scope.something = 'This is a string!';
    }
  }

  getController() {
    return this.controller;
  }
}
