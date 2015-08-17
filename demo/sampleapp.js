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
sampleapp.controller('samplectrl', function ($scope, $filter, $http) {

    var loadedTags = [];
    $scope.selectedTags = ['Tag #007', 'Tag #034'];

    // Listens user tag selections
    $scope.$watchCollection('selectedTags', function (tags) {
        if (tags !== undefined) {
            console.log('PARENT - watchCollection(): Selected item(s): ', tags);
        }
    });

    // callback - loads and filter tag items
    $scope.loadTags = function (filter) {
        return $filter('filter')(loadedTags, filter);
    };

    // Read the tags from the file
    function getTagsFromFile() {
        setTimeout(function () {
            $http.get('demo/tags.json').success(function (tags) {
                loadedTags = tags;
            });
        }, 20);
    }

    getTagsFromFile();

});
