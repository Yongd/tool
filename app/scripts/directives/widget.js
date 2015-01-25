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
            scope.days = 2;
            scope.seconds = scope.minutes = scope.hours = '00';
            scope.countdown = function() {
                var minus,leave1,leave2,leave3,days,hours,minutes,seconds,last,show;
                if(scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].time!==''){
                    last = Date.parse( scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].time );
                }else{
                    last = Date.parse( scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].placetime );     
                }
                minus =  last - Date.parse( new Date() );
                show = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].show;
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
}).directive('cart', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/cart.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('qrcode', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/qrcode.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('search', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/search.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            var mkColor,inputBgColor;
            scope.$on('transparent', function() {
                if(scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].showStyle==1){
                    mkColor = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].mkColor;
                    inputBgColor = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].inputBgColor;
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].mkColor = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].inputBgColor = 'transparent';
                    element.children()[0].src=scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].imgUrl;
                }else{
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].mkColor = mkColor;
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].inputBgColor = inputBgColor;
                    element.children()[0].src='';
                }
            });
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('video', function($sce) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/video.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('wwgroup', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/wwgroup.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            scope.$on('changeStyle', function() {
                var t = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].imgStyle;
                if(t==1){
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].img = 'http://img01.taobaocdn.com/bao/uploaded/i1/T15nj0FopXXXartXjX';
                }else if(t==2){
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].img = 'http://img01.taobaocdn.com/bao/uploaded/i3/T14kLTFaXdXXartXjX';
                }else if(t==3){
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].img = 'http://img01.taobaocdn.com/bao/uploaded/i3/T1mtDYFodbXXartXjX';
                }else{
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].img = 'http://img01.taobaocdn.com/bao/uploaded/i4/T1ZsYpFfpgXXartXjX';
                }
            });
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('ww', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/ww.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('attention', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/attention.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('favourite', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/attention.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('share', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/share.html',
        link: function(scope, element) {
            scope.index = scope.$parent.order;
            scope.$on('changeShareStyle', function() {
                var t = scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].showStyle;
                if(t==1){
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].imgUrl = 'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2U3D3bFXXXXbXXpXXXXXXXXXX-134264536.png';
                }else if(t==2){
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].imgUrl = 'none';
                }else{
                    scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].imgUrl = 'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2uwf1bFXXXXbFXpXXXXXXXXXX-134264536.png';
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

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/cart.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}">'+
    '</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/qrcode.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src="http://gqrcode.alicdn.com/img?{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].qrtype}}'+
    '={{$parent.dataMks.mks[$parent.canvasOrder].widget[index].id}}&w={{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}&h={{$parent.dataMks.mks[$parent.canvasOrder].widget[index]'+
    '.size.height}}"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/search.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} status{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].showStyle}} eButton now" index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent'+
    '.canvasOrder].widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src=""><div yd-drag class="search_keyword" index="{{index}}" style="width: {{$parent.dataMks.mks[$parent.canvasOrder].'+
    'widget[index].input.size.width}}px;height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].input.size.height}}px;left: {{$parent.dataMks.mks[$parent.canvasOrder].widget[index]'+
    '.input.position.left}}px;top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].input.position.top}}px;border-color:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].mkColor}}'+
    ';background-color:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].inputBgColor}};"></div><div yd-drag class="search_btn" index="{{index}}" style="width:{{$parent.dataMks.mks[$parent.'+
    'canvasOrder].widget[index].btn.size.width}}px; height: {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].btn.size.height}}px;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index]'+
    '.btn.position.left}}px;top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].btn.position.top}}px;border-color:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].mkColor}}'+
    ';background-color:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].mkColor}};line-height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].btn.size.height}}px;">搜索</div></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/video.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><iframe src="{{trustSrc($parent.dataMks.mks[$parent.canvasOrder].widget[index].videolink)}}" '+
    'width="100%" height="100%" frameborder="0"></iframe></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/wwgroup.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;'+
    '"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}}">'+
    '</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/ww.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}}"><br>'+
    '<img ng-class="{\'toux\':$parent.dataMks.mks[$parent.canvasOrder].widget[index].img!=\'\'&&$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgStyle==2}" src="images/tool/ww'+
    '{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgStyle}}.gif"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/attention.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/share.html',
    '<div class="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} eButton now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><div class="style{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].showStyle}}" style="width:100%;height:100%;background-image:url({{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}});">分享给好友</div></div>');
}]);