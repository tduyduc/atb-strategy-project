/// <reference path="angular.d.ts" />

class App {
  module: angular.IModule;

  constructor() {
    this.module = angular.module("myApp", []);
  }

  controller(
    name: string,
    controllerConstructor: angular.Injectable<angular.IControllerConstructor>
  ): angular.IModule {
    return this.module.controller(name, controllerConstructor);
  }
}

const program: App = new App();
const mainController = new MainController();

program.controller("mainController", [
  "$scope",
  mainController.getController()
]);
