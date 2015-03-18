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
                var imgurl = angular.element(element).parent().hasClass('carousel')?'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2EcBWcXXXXXcHXpXXXXXXXXXX-134264536.jpg':'http://img02.taobaocdn.com/imgextra/i2/134264536/TB27kiacXXXXXX4XXXXXXXXXXXX-134264536.jpg';
                var content = scope.$parent.$parent.$parent.dataMks.mks[scope.$parent.$parent.$parent.canvasOrder].widget[scope.$parent.$parent.$parent.order];
                if (element.hasClass('fi-plus')) {
                    content.content.push( {'imgurl':imgurl,'link':'http://www.tiancaiui.com'} );
                } else {
                    content.content.pop();
                }
            });
        }
    };
});

app.directive('accordion', function($document) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var startX = 0, startY = 0, e = angular.element(element).parent().parent().parent();
            element.bind('mousedown', function($event) {
                event.preventDefault();
                  startX = $event.pageX - parseInt(e.css('left'));
                  startY = $event.pageY - parseInt(e.css('top'));
                  $document.bind('mousemove', mousemove);
                  $document.bind('mouseup', mouseup);  
            });
            function mousemove($event){
                var 
                    y = $event.pageY - startY,
                    x = $event.pageX - startX;
                    scope.$apply(function(){
                        scope.$parent.$parent.dataMks.mks[scope.$parent.$parent.canvasOrder].widget[scope.$parent.index].position.left=x;
                        scope.$parent.$parent.dataMks.mks[scope.$parent.$parent.canvasOrder].widget[scope.$parent.index].position.top=y;
                    });
                    e.css({
                        top: y + 'px',
                        left:  x + 'px'
                    }).addClass('opacity');
            }
            function mouseup() {
              $document.unbind('mousemove', mousemove);
              $document.unbind('mouseup', mouseup);
              e.removeClass('opacity');
            }    
        }
    };
});

app.directive('accordionAction', function() {
    return {
        restrict: 'C',
        link: function(scope, element) {
            element.bind('mousedown', function() {
                var content = scope.$parent.$parent.$parent.dataMks.mks[scope.$parent.$parent.$parent.canvasOrder].widget[scope.$parent.$parent.$parent.order];
                if (element.hasClass('fi-plus')) {
                    content.content.push( {'imgurl':'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2xpD9XXXXXXX5XFXXXXXXXXXX-134264536.jpg','ximgurl':'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2x9iXcXXXXXcHXXXXXXXXXXXX-134264536.jpg','link':'http://www.tiancaiui.com'} );
                } else {
                    content.content.pop();
                }
            });
        }
    };
});

app.directive('imghover', function($document) {
    return {
        restrict: 'C',
        link: function(scope, element) {
            var startX = 0, startY = 0, e = angular.element(element);
            element.bind('mousedown', function($event) {
                event.preventDefault();
                  startX = $event.pageX - parseInt(e.css('left'));
                  startY = $event.pageY - parseInt(e.css('top'));
                  $document.bind('mousemove', mousemove);
                  $document.bind('mouseup', mouseup); 
            });
            function mousemove($event){
                var 
                    y = $event.pageY - startY,
                    x = $event.pageX - startX;
                    scope.$apply(function(){
                        scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].hover.position.left=x;
                        scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].hover.position.top=y;
                    });
                    e.css({
                        top: y + 'px',
                        left:  x + 'px'
                    }).addClass('opacity');
            }
            function mouseup() {
              $document.unbind('mousemove', mousemove);
              $document.unbind('mouseup', mouseup);
              e.removeClass('opacity');
            }    
        }
    };
});