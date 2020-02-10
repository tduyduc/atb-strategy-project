/// <reference path="angular.d/angular.d.ts" />

interface ICustomScope extends angular.IScope {
  something: string;
  globalConfig: GlobalConfig;
  static: Static;
}
