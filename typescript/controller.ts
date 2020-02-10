/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/scope.d.ts" />
/// <reference path="index.ts" />

class MainController implements angular.IController {
  module: Module;
  _controller: ($scope: ICustomScope) => void;

  constructor(module: Module) {
    this.module = module;
    this._controller = ($scope: ICustomScope) => {
      $scope.something = "This is a string!";
    };
  }

  controller(name: string): angular.IModule {
    return this.module
      .getModule()
      .controller(name, ["$scope", this._controller]);
  }
}
