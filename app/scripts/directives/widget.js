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
            scope.index = scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('img', function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/img.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            var temp = '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} popup now" ng-class="{\'hide\': !$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.status||!$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.show'+
            '}" style="position: absolute; left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.position.left}}px; top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.position.'+
            'top}}px;" index="{{index}}" yd-drag><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.imgUrl}}" ></div>';
            element.after( $compile(temp)(scope) );
            function changeUrl(){
               if(scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].hover.status){
                    element[0].children[0].src = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].hover.imgUrl;
                }
            }
            function recoverUrl(){
                if(scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].hover.status){
                    element[0].children[0].src = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].imgUrl;
                }
            }
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('mouseover',changeUrl).on('mouseleave',recoverUrl).on('$destroy', removeData);
        }
    };
});







app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/area.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;'+
    'top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;">{{index}}{{dataMks.mks[$parent.canvasOrder].widget[index]}}</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/img.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;'+
    'top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}">'+
    '</div>');
}]);


