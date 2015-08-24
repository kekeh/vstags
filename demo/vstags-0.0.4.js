/* 
*  Name: vstags 
*  Description: Tags - AngularJS reusable UI component 
*  Version: 0.0.4 
*  Author: kekeh 
*  Homepage: http://kekeh.github.io/vstags 
*  License: MIT 
*  Date: 2015-08-24 
*/ 
angular.module('template-vstags-0.0.4.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("templates/vstags.html",
    "<div class=vstags><div class=vstagsgroup><div ng-if=showOverlay ng-include=\"'templates/vstagsoverlay.html'\"></div><div class=vstagsarea><div ng-include=\"'templates/vstagsrepeat.html'\"></div></div><span class=vsbtncontainer><button class=vstagsbtn ng-click=\"showOverlay=true\" ng-show=showTagsBtn><span class=\"icon icon-selections\"></span></button> <button class=vstagsbtn ng-click=addNewItem()><span class=icon ng-class=\"{'icon-plus':!showInput,'icon-check':showInput}\"></span></button> <span class=vstagsselectioncounttxt ng-if=showTagsBtn ng-click=\"showOverlay=true\">{{selectedTags.length}}</span></span></div><input class=vstagsinput placeholder={{conf.TYPE_TAG_TXT}} input-focus ng-show=showInput ng-model=inputTxt ng-model-options={debounce:conf.INPUT_DEBOUNCE} ng-keydown=\"keyDown($event)\"><div class=vstagsloader ng-show=\"showInput&&inputTxt!==''&&loadedTags.length>0\"><div class=vstagsloaderitem ng-repeat=\"item in loadedTags track by $index\" ng-click=itemClicked(item) ng-keydown=\"$event.which===13?itemClicked(item):null\" tabindex=0><span class=vstagsloaderitemtxt>{{item}}</span></div></div></div>");
  $templateCache.put("templates/vstagsoverlay.html",
    "<div class=vstagsoverlay ng-mouseleave=closeOverlay()><div class=vstagsoverlaytitle><span class=vstagsoverlaytitletxt>{{selectedTags.length}} {{conf.SEL_TAGS_TXT}}</span> <span class=\"icon icon-cross vsiconoverlaycross\" ng-click=closeOverlay() ng-keydown=\"$event.which===13?closeOverlay():null\" tabindex=0></span></div><div ng-include=\"'templates/vstagsrepeat.html'\"></div></div>");
  $templateCache.put("templates/vstagsrepeat.html",
    "<div class=vsselectedtags ng-repeat=\"item in selectedTags track by $index\"><span class=vstagtext>{{item}}</span> <span class=\"vsiconcross icon icon-cross\" ng-click=removeItem(item) ng-keydown=\"$event.which===13?removeItem(item):null\" tabindex=0></span></div>");
}]);

angular.module('vstags', ["template-vstags-0.0.4.html"])
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