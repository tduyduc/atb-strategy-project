/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="controller.ts" />

class Module {
  private _module: angular.IModule;

  constructor(name: string, requires: string[] = []) {
    this._module = angular.module(name, requires);
  }

  get module(): angular.IModule {
    return this._module;
  }

  controller(name: string, _controller: IAngularController): angular.IModule {
    return this._module.controller(name, _controller.injectors);
  }

  directive(name: string, _directive: IAngularDirective): angular.IModule {
    return this._module.directive(name, _directive.injectors);
  }
}

const app: Module = new Module('myApp');
const mainController = new MainController(mainControllerFunction);

app.controller('mainController', mainController);
