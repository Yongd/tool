'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */

var app = angular.module('toolApp');

app.directive('carouselAction', function() {
    return {
        restrict: 'C',
        link: function(scope, element) {
            element.bind('mousedown', function() {
                var content = scope.$parent.$parent.$parent.dataMks.mks[scope.$parent.$parent.$parent.canvasOrder].widget[scope.$parent.$parent.$parent.order];
                if (element.hasClass('fi-plus')) {
                    content.content.push( {'imgurl':'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2EcBWcXXXXXcHXpXXXXXXXXXX-134264536.jpg','link':'http://www.tiancaiui.com'} );
                } else {
                    content.content.pop();
                }
            });
        }
    };
});

