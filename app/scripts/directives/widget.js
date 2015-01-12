'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */

var app = angular.module('toolApp');


app.directive('area', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/area.html',
        link: function(scope, element) {
            scope.index = scope.$parent.$parent.order;
            function removeData() {
                delete scope.$parent.$parent.dataMks.mks[scope.$parent.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
});


app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/area.html',
    '<div class="{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].type}} eButton active" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].position.left}}px;'+
    'top:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].size.height}}px;">{{index}}{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index]}}</div>');
}]);


