angular.module('meanhotel')
  .directive('mhNavigation', mhNavigation);

function mhNavigation() {
  return {
    restric: 'E',
    templateUrl: 'angular-app/navigation-directive/navigation-directive.html'
  };
}
