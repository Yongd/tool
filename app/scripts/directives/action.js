'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */

var app = angular.module('toolApp');

app.directive('draggable', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        link: function(a, b, c) {
            angular.element(b).attr('draggable', 'true');
            b.bind('dragstart', function(e) {
                e.dataTransfer.setData('type', c.directive);
                $rootScope.$emit('dragStart');
            });
            b.bind('dragend', function() {
                $rootScope.$emit('dragEnd');
            });
        }
    };
}]);
app.directive('droppable', ['$rootScope', '$compile', '$position', function($rootScope, $compile, $position) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.bind('dragover', function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                e.dataTransfer.dropEffect = 'move';
                return false;
            });
            element.bind('drop', function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if (e.stopPropogation) {
                    e.stopPropogation();
                }
                var dataTransfer = e.dataTransfer.getData('type');
                scope.addElement( dataTransfer );
                scope.attrControl = true;   
                if(dataTransfer=='imgpop'){
                    dataTransfer = 'img';
                }
                var width,height,maxtop,maxleft,dx,dy;
                if(dataTransfer=='wwgroup'||dataTransfer=='ww'){
                    maxtop = scope.dataMks.height;
                    maxleft = scope.dataMks.width;
                    dx = e.clientX - $position.offset(element).left;
                    dy = e.clientY - $position.offset(element).top;
                }else{
                    width = scope.dataMks.mks[scope.canvasOrder].widget[scope.order].size.width;
                    height = scope.dataMks.mks[scope.canvasOrder].widget[scope.order].size.height;
                    maxtop = scope.dataMks.height-height;
                    maxleft = scope.dataMks.width-width;
                    dx = e.clientX - $position.offset(element).left - width / 2;
                    dy = e.clientY - $position.offset(element).top - height / 2;
                }
                    
               
                

                
                if(dy < 0){
                    dy = 0; 
                }else if(dy > maxtop){
                    dy = maxtop;
                }
                if(dx < 0){
                    dx = 0; 
                }else if(dx > maxleft){
                    dx = maxleft;
                }   
                if(dataTransfer=='wwgroup'||dataTransfer=='ww'){
                    angular.element(element[0].children[scope.canvasOrder]).append($compile('<div '+dataTransfer+' yd-drag></div>')(scope)); 
                }else{
                    angular.element(element[0].children[scope.canvasOrder]).append($compile('<div '+dataTransfer+' yd-drag yd-resize></div>')(scope)); 
                }
                    

                    scope.dataMks.mks[scope.canvasOrder].widget[scope.order].position.left = dx;
                    scope.dataMks.mks[scope.canvasOrder].widget[scope.order].position.top = dy;
                
            
                var layerHtml = '<p class="' + scope.dataMks.mks[scope.canvasOrder].widget[scope.order].type + '_' + scope.order + ' now eButton" index="' + scope.order + '">'+
                '<span class="left">' + scope.dataMks.mks[scope.canvasOrder].widget[scope.order].name + '</span>'+
                '<i class="icon fi-x size-14 right" ng-click="deleteElement()" ></i>'+
                '<i class="icon fi-arrow-down size-14 actChangeZindex right" tooltip="下移"></i>'+
                '<i class="icon fi-arrow-up size-14 actChangeZindex right" tooltip="上移"></i>'+
                '<i class="icon fi-unlock size-14 actLock right" tooltip="锁定"></i>'+
                '</p>';
                angular.element(document.querySelector('.layer_' + scope.canvasOrder)).prepend($compile(layerHtml)(scope));
                
            });
            $rootScope.$on('dragStart', function() {
                element.addClass('drop-target');
            });
            $rootScope.$on('dragEnd', function() {
                angular.element(document.getElementById('workspace')).removeClass('move-right');
                element.removeClass('drop-target');
            });
        }
    };
}]);


app.directive('eButton', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            function removeAct() {
                angular.element(document.querySelectorAll('.now')).removeClass('now');
            }
            function addAct() {
                removeAct();
                angular.element(document.getElementsByClassName(attrs.class.split(' ')[0])).addClass('now');
                if (angular.isDefined(scope.$parent.order)) {
                    scope.$apply(scope.$parent.order = attrs.index,scope.$parent.attrControl=true);
                    console.log(scope);
                } else if(angular.isDefined(scope.order)){
                    scope.$apply(scope.order = attrs.index,scope.attrControl=true);
                    console.log(scope);
                }else{
                    scope.$apply(
                        scope.$parent.$parent.$parent.$parent.$parent.order = attrs.index,
                        scope.$parent.$parent.$parent.$parent.$parent.attrControl = true
                    );
                }

            }
            removeAct();
            element.on('mousedown', addAct);
        }
    };
});

app.directive('actChangeZindex', ['$timeout', function($timeout) {
    return {
        restrict: 'C',
        link: function(scope, element) {
            function changeZindex() {
                var obj = element.parent(),
                    nextObj;
                nextObj = element.hasClass('fi-arrow-down') ? obj.next() : angular.element(obj[0].previousSibling);
                if (nextObj.length === 1 && angular.element(obj.children()[4]).hasClass('fi-unlock')) {
                    nextObj.addClass('changing');
                    $timeout(function() {
                            if (element.hasClass('fi-arrow-down')) {
                                nextObj.after(obj);
                            } else {
                                obj.parent()[0].insertBefore(obj[0], nextObj[0]);
                            }
                            nextObj.removeClass('changing');
                        },
                        300
                    );
                    var
                        order = obj.attr('class').replace(/[^0-9]/ig, ''),
                        nextOrder = nextObj.attr('class').replace(/[^0-9]/ig, ''),
                        tempOrder = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[order].zindex;
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[order].zindex = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[nextOrder].zindex;
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[nextOrder].zindex = tempOrder;
                }
            }
            element.bind('mousedown', changeZindex);
        }
    };
}]);

app.directive('actLock', function() {
    return {
        restrict: 'C',
        link: function(a, b) {
            b.bind('mousedown', function() {
                if (b.hasClass('fi-unlock')) {
                    b.removeClass('fi-unlock').addClass('fi-lock');
                } else {
                    b.removeClass('fi-lock').addClass('fi-unlock');
                }
            });
        }
    };
});

app.directive('addWrap', ['$compile', function($compile) {
    return {
        restrict: 'C',
        link: function(scope, element) {
            var canvasTemplate, layerTemplate, controlTemplate;
            scope.$parent.pre = 0;
            scope.$parent.index = 1;
            controlTemplate = '<ul class="slidenav eButton" index="-1" yd-drag ng-class="{\'hide\':!dataMks.slider.nav.enable}" style="left:{{dataMks.slider.nav.position.left}}px;top:{{dataMks.slider.nav.position.top}}px;"><li class="left act" style="'+
            'background-color:{{dataMks.slider.nav.bgColor}};border-color:{{dataMks.slider.nav.borderColor}};color:{{dataMks.slider.nav.color}};">1</li><li class="left" style="'+
            'background-color:{{dataMks.slider.nav.bgColor}};border-color:{{dataMks.slider.nav.borderColor}};color:{{dataMks.slider.nav.color}};">2</li></ul><span ng-class="{\'hide\':!dataMks.slider.arrow.enable}" class="slidearrow slidearrowl eButton" style="left:{{dataMks.slider.arrow.leftPosition.left}}px;'+
            'top:{{dataMks.slider.arrow.leftPosition.top}}px;" index="-2" ng-class="{\'hide\':!dataMks.slider.arrow.enable}" yd-drag><img src="{{dataMks.slider.arrow.leftUrl}}"></span>'+
            '<span ng-class="{\'hide\':!dataMks.slider.arrow.enable}" index="-2" class="slidearrow slidearrowr eButton" style="left:{{dataMks.slider.arrow.rightPosition.left}}px;top:{{dataMks.slider.arrow.rightPosition.top}}px;" yd-drag><img src="{{dataMks.slider.arrow.rightUrl}}"></span>';

            function addWrap() {
                canvasTemplate = '<div class="wrap_' + scope.indexCanvas + ' wrap" style="width:{{dataMks.width}}px;height:{{dataMks.height}}px;' +
                    'background-repeat:{{dataMks.mks[' + scope.$parent.index + '].img.repeat}};background-color:{{dataMks.mks[' + scope.$parent.index + '].color}};"><div class="gridbg"></div></div>';
                layerTemplate = '<div class="wrap_' + scope.$parent.index + ' layer_' + scope.$parent.index + ' wrap">';
                if(scope.$parent.pre===0){
                    angular.element(document.querySelector('.canvas')).append($compile(controlTemplate)(scope));
                }
                angular.element(document.querySelector('.wrap_' + scope.$parent.pre)).after($compile(canvasTemplate)(scope));
                angular.element(document.querySelector('.layer_' + scope.$parent.pre)).after($compile(layerTemplate)(scope));
                scope.$parent.index += 1;
                scope.$parent.pre += 1;
            }
            scope.removeWrap = function() {
                var order = scope.$parent.$parent.$parent.$parent.$parent.$parent.canvasOrder;
                if (scope.$parent.pre == order) {
                    angular.element(document.querySelector('.wrap_' + scope.$parent.pre)).remove();
                    angular.element(document.querySelector('.layer_' + scope.$parent.pre)).remove();
                    scope.$parent.$parent.$parent.$parent.$parent.$parent.dataMks.mks.splice(scope.$parent.pre, 1);
                    scope.$parent.index -= 1;
                    scope.$parent.pre -= 1;
                }
            };
            element.bind('mousedown', function() {
                addWrap();
            });
        }
    };
}]);

app.directive('bginput', function() {
    return {
        restrict: 'C',
        link: function(scope, element) {
            scope.addbg = function() {
                if (element.hasClass('ng-valid')) {
                    var index = scope.$parent.$index,
                        url = angular.element(document.querySelector('#main')).scope().$parent.dataMks.mks[index].img.url;
                    angular.element(document.querySelector('.wrap_' + index)).css('background-image', 'url(' + url + ')');
                }
            };
        }
    };
});

app.directive('clearElement', function() {
    return {
        restrict: 'C',
        link: function(scope) {
           scope.emptyWrap = function(order) {
                angular.element(document.querySelector('.wrap_' + order)).empty().append('<div class="gridbg"></div>');
                angular.element(document.querySelector('.layer_' + order)).empty();
          };
        }
    };
});

app.directive('gridbg', function(){
    return {
      restrict:'C',
      link:function(scope, element){
        element.bind('click', function(){
          angular.element(document.querySelectorAll('.now')).removeClass('now'); 
          scope.$apply(scope.attrControl=false);
        });
      }
    };
});


