angular.module('vstags', [])
    .constant('vstagsConfig', {
        INPUT_FOCUS_EVENT: 'vstags.inputFocusEvent'
    })
    .directive('vstags', function () {
        return {
            restrict: 'EA',
            templateUrl: 'templates/vstags.html',
            scope: {
                ngModel: '=?'
            },
            controller: ['$scope', 'vstagsConfig', function ($scope, vstagsConfig) {
                $scope.config = vstagsConfig;
                $scope.inputTxt = '';
                $scope.inputFocusEvent = function () {
                    $scope.$broadcast($scope.config.INPUT_FOCUS_EVENT);
                };
            }],
            link: function (scope, element, attrs) {
                scope.selectedTags = [];
                scope.showInput = false;

                scope.addNewItem = function () {
                    scope.showInput = !scope.showInput;
                    if (scope.showInput) {
                        scope.inputFocusEvent();
                    }
                    else if (scope.inputTxt !== '') {
                        addItem(scope.inputTxt);
                        scope.inputTxt = '';
                    }
                };

                scope.removeItem = function (item) {
                    var idx = scope.selectedTags.indexOf(item);
                    if (idx !== -1) {
                        scope.selectedTags.splice(idx, 1);
                        updateView();
                    }
                };

                scope.keyDown = function (event) {
                    if (event.which === 13 && scope.inputTxt !== '') {
                        addItem(scope.inputTxt);
                        scope.inputTxt = '';
                        scope.showInput = false;
                    }
                };

                function updateView() {
                    scope.ngModel = scope.selectedTags;
                };

                function addItem(item) {
                    scope.selectedTags.push(item);
                    updateView();
                }

                function init() {
                    scope.selectedTags = scope.ngModel;
                }

                init();
            }
        };
    })

/**
 * @ngdoc object
 * @name inputFocus
 * @description inputFocus is directive which set focus to the input field.
 */
    .directive('inputFocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element) {
                scope.$on(scope.config.INPUT_FOCUS_EVENT, function () {
                    $timeout(function () {
                        element[0].focus();
                    });
                });
            }
        };
    }]);