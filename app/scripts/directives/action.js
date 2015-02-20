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
            function addElement(type, number, canvasOrder){
                    
                    if(type=='wwgroup'||type=='ww'){
                        angular.element(element[0].children[canvasOrder]).append($compile('<div loadx="'+number+'" '+type+' yd-drag></div>')(scope)); 
                    }else{
                        angular.element(element[0].children[canvasOrder]).append($compile('<div loadx="'+number+'" '+type+' yd-drag yd-resize></div>')(scope)); 
                    }

            }
            function addLayer(index, type, name, canvasOrder){
                var layerHtml = '<p class="' + type + '_' + index + ' now eButton" index="' + index + '">'+
                '<span class="left">' + name + '</span>'+
                '<i class="icon fi-x size-14 right" ng-click="deleteElement()" ></i>'+
                '<i class="icon fi-arrow-down size-14 actChangeZindex right" tooltip="下移"></i>'+
                '<i class="icon fi-arrow-up size-14 actChangeZindex right" tooltip="上移"></i>'+
                '<i class="icon fi-unlock size-14 actLock right" tooltip="锁定"></i>'+
                '</p>';
                angular.element(document.querySelector('.layer_' + canvasOrder)).prepend($compile(layerHtml)(scope));
            }
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
                addElement(dataTransfer,'',scope.canvasOrder);
                
                scope.dataMks.mks[scope.canvasOrder].widget[scope.order].position.left = dx;
                scope.dataMks.mks[scope.canvasOrder].widget[scope.order].position.top = dy;
                addLayer(scope.order, scope.dataMks.mks[scope.canvasOrder].widget[scope.order].type, scope.dataMks.mks[scope.canvasOrder].widget[scope.order].name);
                
                
            });
            $rootScope.$on('dragStart', function() {
                element.addClass('drop-target');
            });
            $rootScope.$on('dragEnd', function() {
                angular.element(document.getElementById('workspace')).removeClass('move-right');
                element.removeClass('drop-target');
            });


            /*addWrap & removeWrao*/
            var canvasTemplate, navli, layerTemplate, controlTemplate,preIndex=0,currentIndex=1;
            function addWrap() {
                navli = '<li style="background-color:{{dataMks.slider.nav.bgColor}};border-color:{{dataMks.slider.nav.borderColor}};color:{{dataMks.slider.nav.color}};">'+(currentIndex+1)+'</li>';
                controlTemplate = '<ul class="slidenav {{dataMks.slider.nav.align}} eButton" index="-1" yd-drag ng-class="{\'hide\':!dataMks.slider.nav.enable}" style="left:{{dataMks.slider.nav.position.left}}px;top:{{dataMks.slider.nav.position.top}}px;"><li class="act" style="'+
                'background-color:{{dataMks.slider.nav.bgColor}};border-color:{{dataMks.slider.nav.borderColor}};color:{{dataMks.slider.nav.color}};">1</li>'+navli+'</ul><span ng-class="{\'hide\':!dataMks.slider.arrow.enable}" class="slidearrow slidearrowl eButton" style="left:{{dataMks.slider.arrow.leftPosition.left}}px;'+
                'top:{{dataMks.slider.arrow.leftPosition.top}}px;" index="-2" ng-class="{\'hide\':!dataMks.slider.arrow.enable}" yd-drag><img src="{{dataMks.slider.arrow.leftUrl}}"></span>'+
                '<span ng-class="{\'hide\':!dataMks.slider.arrow.enable}" index="-2" class="slidearrow slidearrowr eButton" style="left:{{dataMks.slider.arrow.rightPosition.left}}px;top:{{dataMks.slider.arrow.rightPosition.top}}px;" yd-drag><img src="{{dataMks.slider.arrow.rightUrl}}"></span>';
                canvasTemplate = '<div class="wrap_' + currentIndex + ' wrap" style="width:{{dataMks.width}}px;height:{{dataMks.height}}px;' +
                'background-repeat:{{dataMks.mks[' + currentIndex + '].img.repeat}};background-color:{{dataMks.mks[' + currentIndex + '].color}};background-position:{{dataMks.mks[' + currentIndex + '].img.position}} center;background-image:url({{dataMks.mks[' + currentIndex + '].img.url}});"><div class="gridbg"></div></div>';
                layerTemplate = '<div class="wrap_' + currentIndex + ' layer_' + currentIndex + ' wrap">';
                if(preIndex===0){
                    angular.element(document.querySelector('.canvas')).append($compile(controlTemplate)(scope));
                }else{
                    angular.element(document.querySelector('.slidenav')).append($compile(navli)(scope));
                }
                angular.element(document.querySelector('.wrap_' + preIndex)).after($compile(canvasTemplate)(scope));
                angular.element(document.querySelector('.layer_' + preIndex)).after($compile(layerTemplate)(scope));
                currentIndex += 1;
                preIndex += 1;
            }
            function removeWrap(){
                if (preIndex === scope.canvasOrder) {
                    if(preIndex === 1){
                        angular.element(document.querySelector('.slidenav')).remove();
                        angular.element(document.querySelector('.slidearrow')).remove();
                    }else{
                        var allLi = angular.element(document.querySelectorAll('.slidenav li'));
                        allLi[allLi.length-1].remove();
                    }
                    angular.element(document.querySelector('.wrap_' + preIndex)).remove();
                    angular.element(document.querySelector('.layer_' + preIndex)).remove();
                    scope.dataMks.mks.splice(preIndex, 1);
                    currentIndex -= 1;
                    preIndex -= 1;
                }
            }
            scope.$on('addWrap',addWrap);
            scope.$on('removeWrap',removeWrap);
            /*open*/
            
            scope.$on('open',function(event, data){
                scope.dataMks = data;
                var t = scope.dataMks.mks;
                for(var c in t){
                    if(c>0){
                        scope.addCanvas(1);
                    }
                    var e = t[c].widget;
                    if(e.length>0){
                        for(var p in e) {
                            if(e[p].type){
                                addElement(e[p].type, p, c);
                                addLayer(p, e[p].type, e[p].name, c);
                                scope.addElement();
                            }
                        }
                    } 
                    
                }    
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
                if (angular.isUndefined(scope.order)) {
                        scope.$apply(scope.$parent.order = attrs.index,scope.$parent.attrControl=true);
                        
                    } else{
                        scope.$apply(scope.order = attrs.index,scope.attrControl=true);
                       
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
app.directive('datefilter',  function () {
    return  {
        restrict: 'A',
        require: ['ngModel'],
        link: function(scope, element, attr, ctrls) {
            ctrls[0].$formatters.push(function (modelValue) {
                if(angular.isDefined(modelValue)){
                    console.log(modelValue);
                   scope.$parent.$parent.$parent.dataMks.mks[attr.canvasorder].widget[attr.order].time = modelValue;
                    return modelValue; 
                }
            });
        }
    };
});
app.directive('smalltip', function($timeout){
    return {
      restrict:'E',
      replace: true,
      template: '<div class="smalltip text-center load animated" ng-class="{\'fadeInDown\':smallTip,\'fadeOutUp\':smallTip==null}">保存中...</div>',
      link:function(scope, element){
        var e = angular.element(element);
        function recovery(){
            e.removeClass('load').text('保存成功');
                $timeout(function() {
                    scope.smallTip= null;
                    },
                    2000
            );
        }
        scope.$on('savestatus',function(event, data){
            if(data.code==1){
                scope.jid = data.jid;
                recovery();
            }else{
                e.text(data.code);
            }
        }); 
        scope.$on('updatestatus',function(event, data){
            if(data==1){
                e.removeClass('load').text('保存成功');
                recovery();
            }else{
                e.text(data);
            }
        }); 
      }
    };
});
app.directive('save', function(){
    return {
      restrict:'A',
      link:function(scope, element){
        element.bind('click', function(){
          //$scope.htmlCode = angular.element(document.querySelector('.canvas')).html()
        });
      }
    };
});