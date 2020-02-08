/// <reference path="javascript/angular.d/angular.d.ts" />
/// <reference path="javascript/interfaces.ts" />
/// <reference path="javascript/controller.ts" />

class Module {
  module: angular.IModule;

  constructor(name: string) {
    this.module = angular.module(name, []);
  }

  controller(
    name: string,
    controllerConstructor: angular.Injectable<angular.IControllerConstructor>
  ): angular.IModule {
    return this.module.controller(name, controllerConstructor);
  }
}

const app: Module = new Module("myApp");
const mainController = new MainController();

app.controller("mainController", ["$scope", mainController.getController()]);
