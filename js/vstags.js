angular.module('vstags', [])
    .constant('vstagsConf', {
        INPUT_DEBOUNCE: 500,
        INPUT_FOCUS_EVENT: 'vstags.ife',
        SEL_TAGS_TXT: 'tag(s)',
        TYPE_TAG_TXT: 'Type tag here...'
    })
    .directive('vstags', ['$window', function ($window) {
        return {
            restrict: 'EA',
            templateUrl: 'templates/vstags.html',
            scope: {
                ngModel: '=?',
                onLoadTagsFn: '&'
            },
            controller: ['$scope', 'vstagsConf', function ($scope, vstagsConf) {
                $scope.conf = vstagsConf;
                $scope.inputTxt = '';
                $scope.inputFocusEvent = function () {
                    $scope.$broadcast($scope.conf.INPUT_FOCUS_EVENT);
                };
            }],
            link: function (scope, element, attrs) {
                scope.selectedTags = [], scope.loadedTags = [];
                scope.showInput = false, scope.showOverlay = false;
                var tagsArea = tagsArea = angular.element(element[0].querySelector('.vstagsarea'));
                var window = angular.element($window);

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

                scope.itemClicked = function (item) {
                    addItem(item);
                    scope.inputTxt = '';
                    scope.showInput = false;
                };

                scope.closeOverlay = function () {
                    scope.showOverlay = false;
                };

                scope.$watch(function () {
                    return tagsArea[0].scrollHeight;
                },
                function (val) {
                    scope.showTagsBtn = val > 34;
                });

                window.on('resize', function () {
                    scope.$apply();
                });

                function inputTxtWatchFn(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.loadedTags = scope.onLoadTagsFn({filter: scope.inputTxt});
                    }
                }

                function updateView() {
                    scope.ngModel = scope.selectedTags;
                }

                function addItem(item) {
                    scope.selectedTags.push(item);
                    updateView();
                }

                function init() {
                    if (attrs.onLoadTagsFn !== undefined) {
                        scope.$watch('inputTxt', inputTxtWatchFn);
                    }
                    scope.selectedTags = scope.ngModel;
                }

                init();
            }
        };
    }])

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
                scope.$on(scope.conf.INPUT_FOCUS_EVENT, function () {
                    $timeout(function () {
                        element[0].focus();
                    });
                });
            }
        };
    }]);