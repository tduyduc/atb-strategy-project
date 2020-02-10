/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="controller.ts" />

class Module {
  private module: angular.IModule;

  constructor(name: string, requires: string[] = []) {
    this.module = angular.module(name, requires);
  }

  getModule(): angular.IModule {
    return this.module;
  }
}

const app: Module = new Module("myApp");
const mainController = new MainController(app);

mainController.controller("mainController");
