angular.module('myApp')
  .controller('MainController', MainController);

function MainController(FilmFactory) {
  var vm = this;

  FilmFactory.getAllFilms()
    .then(function(response) {
      vm.films = response;
    });

  vm.name = 'Ben';

  vm.date1 = '01 February 2016';
  vm.date2 = '02 March 2016';
  vm.date3 = '03 January 2015';
  vm.date4 = '04 April 2014';
}
