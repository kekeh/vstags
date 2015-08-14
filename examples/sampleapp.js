/**
 * @ngdoc object
 * @name sampleapp
 * @description sampleapp is module of sampleapp. It injects the vstags module.
 */
var sampleapp = angular.module('sampleapp', ['vstags']);

/**
 * @ngdoc object
 * @name samplectrl
 * @description samplectrl is controller of sampleapp.
 */
sampleapp.controller('samplectrl', function ($scope) {

    $scope.selectedTags = ['Tag #2', 'Tag #4'];

    $scope.$watchCollection('selectedTags', function (tags) {
        if (tags !== undefined) {
            console.log('PARENT - watchCollection(): Selected item(s): ', tags);
        }
    });


});
