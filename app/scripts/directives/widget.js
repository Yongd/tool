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
            var temp = '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} popup now" ng-class="{\'hide\': !$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup'+
            '.status||!$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.show}" style="position: absolute; left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.position.left}}px;'+
            'top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.position.top}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].zindex}};" index="{{index}}" yd-drag>'+
            '<img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].popup.imgUrl}}"></div>';
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
}).directive('text', function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/text.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            scope.$on('marquee', function() {
                var marquee;
                if(scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].scrollStatus){
                    marquee = '<marquee direction="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].scrollMode}}" scrollamount="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index]'+
                    '.scrollSpeed}}" height="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}" width="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}"'+
                    ' behavior="scroll">{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].text}}</marquee>';
                    
                }else{
                    marquee = '<div>{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].text}}</div>';
                }
                angular.element(element[0].children[0]).empty().append($compile(marquee)(scope));
            });
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('countdown', function($timeout) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/countdown.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            var last = Date.parse( scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].time );
            scope.days = 2;
            scope.seconds = scope.minutes = scope.hours = '00';
            scope.countdown = function() {
                var minus =  last - Date.parse( new Date() ),leave1,leave2,leave3,days,hours,minutes,seconds;
                var show = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].show;
                $timeout(function() {
                days  =  Math.floor( minus/(1000*3600*24) );  //剩余天数
                leave1 = minus%(24*3600*1000);    //计算出小时数
                leave2 = leave1%(3600*1000);
                leave3 = leave2%(60*1000);    
                hours =  Math.floor(leave1/(3600*1000));
                minutes = Math.floor(leave2/(60*1000));
                seconds = Math.round(leave3/1000);
                if(show<4){
                   hours =  hours + days*24;
                   if(show>1){
                        minutes = minutes + hours*60;
                        if(show==3){
                            seconds = seconds + minutes*60;
                        }
                   }
                }
                scope.days = (days<1?'0':'')+days;
                scope.hours = (hours<10?'0':'')+hours;
                scope.minutes = (minutes<10?'0':'')+minutes;
                scope.seconds = (seconds<10?'0':'')+seconds;
                scope.countdown();   
                }, 1000);
            };
            scope.countdown();
            scope.$on('show', function() {
                var show = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].show;
                for(var i=0;i<4;i++){
                    if(i<show&&show!=4){
                        angular.element(element.children()[i]).css('display','none');
                    }else{
                        angular.element(element.children()[i]).css('display','inline-block');
                    }
                }
                
               
            });
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
});







app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/area.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/img.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}">'+
    '</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/text.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;line-height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].lineht}}px;font-size:{{$parent.'+
    'dataMks.mks[$parent.canvasOrder].widget[index].fontsize}}px;font-weight:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].weight}};color:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].color}};font-family:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].font}};"><div class="text_bd">{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].text}}</div></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/countdown.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;line-height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].lineht}}px;font-size:{{$parent.'+
    'dataMks.mks[$parent.canvasOrder].widget[index].fontsize}}px;font-weight:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].weight}};color:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].color}};font-family:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].font}};"><span style="background-image:url({{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}});'+
    'margin:0 {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].margin}}px;">{{days}}<em ng-class="{\'hide\':!$parent.dataMks.mks[$parent.canvasOrder].widget[index].units}">天</em></span>'+ 
    '<span style="background-image:url({{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}});margin:0 {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].margin}}px;">{{hours}}<em ng-class="'+
    '{\'hide\':!$parent.dataMks.mks[$parent.canvasOrder].widget[index].units}">时</em></span><span style="background-image:url({{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}});margin:0 '+
    '{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].margin}}px;">{{minutes}}<em ng-class="{\'hide\':!$parent.dataMks.mks[$parent.canvasOrder].widget[index].units}">分</em></span>'+
    '<span style="background-image:url({{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}});margin:0 {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].margin}}px;">{{seconds}}<em ng-class="'+
    '{\'hide\':!$parent.dataMks.mks[$parent.canvasOrder].widget[index].units}">秒</em></span></div>');
}]);
