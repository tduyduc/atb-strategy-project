/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/scope.d.ts" />

class MainController implements IAngularInjectable {
  private _injectors: angular.Injectable<angular.IControllerConstructor>;

  constructor() {
    const controller = ($scope: ICustomScope) => {
      $scope.something = "This is a string!";
    };
    this._injectors = ["$scope", controller];
  }

  get injectors() {
    return this._injectors;
  }
}
