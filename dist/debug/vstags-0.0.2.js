/* 
*  Name: vstags 
*  Description: Tags - AngularJS reusable UI component 
*  Version: 0.0.2 
*  Author: kekeh 
*  Homepage: http://kekeh.github.io/vstags 
*  License: MIT 
*  Date: 2015-08-17 
*/ 
angular.module('template-vstags-0.0.2.html', ['templates/vstags.html']);

angular.module("templates/vstags.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/vstags.html",
    "<div class=\"vstags\">\n" +
    "    <div class=\"vstagsgroup\">\n" +
    "        <div ng-if=\"showOverlay\" ng-include=\"'tagsoverlay.html'\"></div>\n" +
    "        <div class=\"vstagsarea\">\n" +
    "            <div ng-include=\"'tagsrepeat.html'\"></div>\n" +
    "        </div>\n" +
    "        <span class=\"vsbtncontainer\">\n" +
    "            <button class=\"vstagsbtn\" ng-click=\"showOverlay=true\" ng-show=\"selectedTags.length>0\"><span class=\"icon icon-selections\"></span></button>\n" +
    "            <button class=\"vstagsbtn\" ng-click=\"addNewItem()\"><span class=\"icon\" ng-class=\"{'icon-plus':!showInput,'icon-check':showInput}\"></span></button>\n" +
    "            <span class=\"vstagsselectioncounttxt\" ng-if=\"selectedTags.length > 0\" ng-click=\"showOverlay=true\">{{selectedTags.length}}</span>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <input class=\"vstagsinput\" type=\"text\" placeholder=\"{{conf.TYPE_TAG_TXT}}\" input-focus ng-show=\"showInput\" ng-model=\"inputTxt\" ng-model-options=\"{debounce:conf.INPUT_DEBOUNCE}\" ng-keydown=\"keyDown($event)\"/>\n" +
    "    <div class=\"vstagsloader\" ng-show=\"showInput&&inputTxt!==''&&loadedTags.length>0\">\n" +
    "        <div class=\"vstagsloaderitem\" ng-repeat=\"item in loadedTags track by $index\" ng-click=\"itemClicked(item)\">\n" +
    "            <span class=\"vstagsloaderitemtxt\">{{item}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <script type=\"text/ng-template\" id=\"tagsoverlay.html\">\n" +
    "        <div class=\"vstagsoverlay\" ng-mouseleave=\"closeOverlay()\">\n" +
    "            <div class=\"vstagsoverlaytitle\">\n" +
    "                <span class=\"vstagsoverlaytitletxt\">{{selectedTags.length}} {{conf.SEL_TAGS_TXT}}</span>\n" +
    "                <span class=\"icon icon-cross vsiconoverlaycross\" ng-click=\"closeOverlay()\"></span>\n" +
    "            </div>\n" +
    "            <div ng-include=\"'tagsrepeat.html'\"></div>\n" +
    "        </div>\n" +
    "    </script>\n" +
    "    <script type=\"text/ng-template\" id=\"tagsrepeat.html\">\n" +
    "        <div class=\"vsselectedtags\" ng-repeat=\"item in selectedTags track by $index\">\n" +
    "            <div class=\"vstagtext\">{{item}}</div>\n" +
    "            <span class=\"vsiconcross icon icon-cross\" ng-click=\"removeItem(item)\"></span>\n" +
    "        </div>\n" +
    "    </script>\n" +
    "</div>");
}]);

angular.module('vstags', ["template-vstags-0.0.2.html"])
    .constant('vstagsConf', {
        INPUT_DEBOUNCE: 500,
        INPUT_FOCUS_EVENT: 'vstags.ife',
        SEL_TAGS_TXT: 'selected tag(s)',
        TYPE_TAG_TXT: 'Type tag here...'
    })
    .directive('vstags', function () {
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
                var inputTxtWatch = null;

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

                scope.$on('$destroy', function () {
                    if (inputTxtWatch !== null) {
                        inputTxtWatch();
                    }
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
                    if(attrs.onLoadTagsFn !== undefined) {
                        inputTxtWatch = scope.$watch('inputTxt', inputTxtWatchFn);
                    }
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
                scope.$on(scope.conf.INPUT_FOCUS_EVENT, function () {
                    $timeout(function () {
                        element[0].focus();
                    });
                });
            }
        };
    }]);