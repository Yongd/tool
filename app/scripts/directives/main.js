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
                e.dataTransfer.setData('text', c.directive);
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
                var dx = e.clientX - $position.offset(element).left,
                    dy = e.clientY - $position.offset(element).top; //data = e.dataTransfer.getData('text');

                angular.element(element[0].children[scope.$parent.canvasOrder]).append($compile('<div ta yd-drag yd-resize></div>')(scope));
                scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.$parent.order].position.left = dx - scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.$parent.order].size.width / 2;
                scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.$parent.order].position.top = dy - scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.$parent.order].size.height / 2;
                var layerHtml = '<p class="' + scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.$parent.order].type + '_' + scope.$parent.order + ' active eButton" index="' + scope.$parent.order + '">';
                layerHtml += '<span class="left">' + scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.$parent.order].name + '</span>';
                layerHtml += '<i class="icon fi-x size-14 right" ng-click="deleteElement()" ></i>';
                layerHtml += '<i class="icon fi-arrow-down size-14 actChangeZindex right" tooltip="下移"></i>';
                layerHtml += '<i class="icon fi-arrow-up size-14 actChangeZindex right" tooltip="上移"></i>';
                layerHtml += '<i class="icon fi-unlock size-14 actLock right" tooltip="锁定"></i>';
                layerHtml += '</p>';
                angular.element(document.querySelector('.layer_' + scope.$parent.canvasOrder)).prepend($compile(layerHtml)(scope));
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




app.directive('ta', ['$document', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        template: '<div class="{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].type}}  eButton active" index="{{index}}" style="position:absolute;left:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].position.left}}px;top:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].size.width}}px;height:{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index].size.height}}px;">{{index}}{{$parent.$parent.dataMks.mks[$parent.$parent.canvasOrder].widget[index]}}</div>',
        link: function(scope, element) {
            scope.index = scope.$parent.$parent.addElement();
            scope.nameOrder = scope.index + 1;
            scope.$parent.$parent.dataMks.mks[scope.$parent.$parent.canvasOrder].widget.push({
                'id': scope.index,
                'zindex': scope.index,
                'name': '热点层' + scope.nameOrder,
                'type': 'area',
                'position': {
                    'left': 200,
                    'top': 100
                },
                'size': {
                    'width': 100,
                    'height': 100
                },
                'link': ''
            });

            function removeData() {
                delete scope.$parent.$parent.dataMks.mks[scope.$parent.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}]);



app.directive('eButton', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            function removeAct() {
                angular.element(document.querySelectorAll('.eButton')).removeClass('active');
            }

            function addAct() {
                removeAct();
                angular.element(document.getElementsByClassName(attrs.class.split(' ')[0])).addClass('active');
                if (angular.isUndefined(scope.order)) {
                    scope.$apply(scope.$parent.$parent.order = attrs.index);
                } else {
                    scope.$apply(scope.$parent.order = attrs.index);
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
            var canvasTemplate, layerTemplate;
            scope.$parent.pre = 0;
            scope.$parent.index = 1;

            function addWrap() {
                canvasTemplate = '<div class="wrap_' + scope.indexCanvas + ' wrap" style="width:{{dataMks.width}}px;height:{{dataMks.height}}px;' +
                    'background-repeat:{{dataMks.mks[' + scope.$parent.index + '].img.repeat}};background-color:{{dataMks.mks[' + scope.$parent.index + '].color}};"><div class="gridbg"></div></div>';
                layerTemplate = '<div class="wrap_' + scope.$parent.index + ' layer_' + scope.$parent.index + ' wrap">';
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

app.directive('clearElement', function($modal) {
    return {
        restrict: 'C',
        require: 'elementWindowCtrl',
        link: function(scope, element,elementWindowCtrl) {
            var order = scope.$parent.$parent.$parent.$parent.$parent.$parent.canvasOrder,
                length = scope.$parent.$parent.$parent.$parent.$parent.$parent.dataMks.mks[order].widget.length;

            scope.confirmClear = function() {
                angular.element(document.querySelector('.wrap_' + order)).empty().append('<div class="gridbg"></div>');
                angular.element(document.querySelector('.layer_' + order)).empty();
                scope.$parent.$parent.$parent.$parent.$parent.$parent.dataMks.mks[order].widget.splice(0, length);
                scope.$parent.$parent.$parent.$parent.$parent.$parent.addOrder[order] = -1;
            }

            element.bind('click', function() {
                console.log(scope);
            });

            var calldata = {
                'name': '画布'+order+'中的所有图层',
                'remove': scope.confirmClear,
                'code': 11
            };
            $modal.open({
                templateUrl: 'views/myWindow.html',
                controller: 'elementWindowCtrl',
                resolve: {
                    data: function() {
                        return calldata;
                    }
                }
            });




        }
    };
});
