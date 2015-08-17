# vstags v. 0.0.2

**Tags - AngularJS reusable UI component**

## Description
Simple AngularJS directive which implements the tags. Depends on only the AngularJS.

## Usage

* include the **vstags-0.0.2.min.js** and the **vstags-0.0.2.min.css** files into your project. See the **Build project** and the **Installation** chapters below.
```html
<script src="vstags-0.0.2.min.js"></script>
<link href="vstags-0.0.2.min.css" rel="stylesheet" type="text/css">
```
* inject the **vstags** module into your application module.
```js
angular.module('sampleapp', ['vstags']);
```
* add **vstags** HTML tag into your HTML file. See the **HTML example** chapter below.
* add needed Javascript code. See the **Javascript example** chapter below.

### HTML example
```html
<div ng-app="sampleapp" ng-controller="sampleappctrl">

    <vstags ng-model="selectedTags" on-load-tags-fn="loadTags(filter)"></vstags>
    
</div>
```

### Tags
| Tag  | Description | Mandatory | 
| :------------ |:---------------|:---------------:|
| vstags | vstags tag | yes | 


### Attributes
| Attribute | Description | Mandatory | 
| :------------ |:---------------|:---------------:|
| ng-model | selected tags of the component - array of strings. | yes |
| on-load-tags-fn | callback function to load tags - function must be synchronously return an array of strings. Called when the user type a text to the tag input field. | no |


### Javascript example
```js
var sampleapp = angular.module('sampleapp', ['vstags']);
sampleapp.controller('sampleappctrl', function ($scope, $filter) {

    // Initially the Item #2 and the Item #4 tags are selected
    $scope.selectedTags = ['Item #2', 'Item #4'];

    // watch - called when the user create or delete the tag
    $scope.$watchCollection('selectedTags', function (tags) {
        if (tags !== undefined) {
            console.log('PARENT - watchCollection(): Selected item(s): ', tags);
        }
    });
    
    // callback - loads and filter tag items
    $scope.loadTags = function (filter) {
        return $filter('filter')(loadedTags, filter);
    };
```


## Demo
In the **examples** folder of this project has the sample application and the online demo is [here](http://kekeh.github.io/vstags)

## Dependencies
Depends on AngularJS. Implemented using the AngularJS version 1.4.3.

## Build project
* Build can be done by executing the **grunt** command. It creates the **dist/debug** and the **dist/min** folders and put files to these folders.
```js
grunt
```

## Installation
* Installation can be done using the **bower**. It installs files from the **dist/debug** and the **dist/min** folders. Needed CSS and javascript files are located in these folders.
```js
bower install vstags
```

## Compatibility (tested with)
* IE 9+
* Firefox 36
* Google Chrome 41
* Opera 28.0
* Mobile Safari 8

## Licence
* License: MIT

## Author
* Author: kekeh