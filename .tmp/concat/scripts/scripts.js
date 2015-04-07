'use strict';

/**
 * @ngdoc overview
 * @name toolApp
 * @description
 * # toolApp
 *
 * Main module of the application.
 */
  angular
  .module('toolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'mm.foundation',
    'ngAnimate',
    'colorpicker.module',
    'datePicker',
    'ngClipboard',
    'ngLoadScript'
  ])
  .config(['$tooltipProvider', function ($tooltipProvider) {
	$tooltipProvider.options({
		placement: 'bottom',
		animation: true,
		popupDelay:200,
		appendToBody: true
	});
  
	}
]);

'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
 var app = angular.module('toolApp');
 app.controller('MyTool', ['$scope', '$http', 'dataHandler', 'ajax', '$modal', '$cookieStore', '$tour', function($scope, $http, dataHandler, ajax, $modal, $cookieStore, $tour) {
    $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
    ];
    $scope.tabs = [{
        title: '添加组件',
        content: 'views/tools.html'
    }, {
        title: '画布管理',
        content: 'views/canvas.html'
    }, {
        title: '图层管理',
        content: 'views/layer.html'
    }];
    $scope.ruler = true;
    $scope.attrControl = false;
    $scope.canvasPosition = 1;
    $scope.borderColor = '#888';
    $scope.wWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    $scope.wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    $scope.start = function(){
        $tour.start();
        $cookieStore.put('tour', true);
    };
    if(!$cookieStore.get('tour')){
        $scope.start();
    }
    $scope.width = {
        'c': 950,
        'b': 990,
        'self': $scope.wWidth-130
    };
    $scope.addOrder = [-1];
    $scope.canvastabs = [{
        title: '画布1',
        content: 'views/canvasconfig.html'
    }];

    $scope.dataMks = JSON.parse( dataHandler.canvas($scope.width.self,$scope.wHeight) ) ;
    
    
    /*canvas*/
    $scope.canvasOrder = 0;
    $scope.indexCanvas = 1;
    $scope.addCanvas = function(open) {
        $scope.$broadcast('addWrap');
        $scope.indexCanvas += 1;
        $scope.canvastabs.push({
            title: '画布' + $scope.indexCanvas,
            content: 'views/canvasconfig.html'
        });
        if(open!=1){
            $scope.dataMks.mks.push({
                'color': 'transparent',
                'img': {
                    'repeat': 'no-repeat',
                    'url': '',
                    'position':'center'
                },
                'widget': []
            });
        }    
        $scope.addOrder.push(-1);
    };
    $scope.confirmDelete = function() {
            $scope.$broadcast('removeWrap');
            $scope.canvasOrder -= 1;
            $scope.indexCanvas -= 1;
            $scope.canvastabs.splice($scope.indexCanvas, 1);
            $scope.addOrder.splice($scope.indexCanvas, 1);
        };
    $scope.deleteCanvas = function() {
        
        if ($scope.canvastabs.length == 1) {
            code = 4;
        } else {
            if ($scope.canvasOrder == $scope.canvastabs.length - 1) {
                code = 1;
            } else {
                code = 3;
            }
        }
        var calldata = {
            'name': $scope.canvastabs[$scope.canvasOrder].title,
            'remove': $scope.confirmDelete,
            'code': code
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
    };


    /*element*/
    var code;
    $scope.order = -1;
    $scope.elementOrder = $scope.order + 1;
    $scope.addElement = function(type) {
        if(!angular.isDefined(type)){
            $scope.canvasOrder = $scope.indexCanvas-1;
        }
        $scope.addOrder[$scope.canvasOrder] += 1;
        $scope.order = $scope.addOrder[$scope.canvasOrder];
        if(angular.isDefined(type)){
            $scope.dataMks.mks[$scope.canvasOrder].widget.push( JSON.parse( dataHandler.element(type,$scope.order) ) );
        }
    };
    $scope.remove = function() {
        angular.element($scope.obj).remove();
        $scope.attrControl = false;
    };
    $scope.deleteElement = function() {
        $scope.obj = document.getElementsByClassName($scope.dataMks.mks[$scope.canvasOrder].widget[$scope.order].type + '_' + $scope.order);
        if ($scope.obj === null || angular.element($scope.obj[1].children[4]).hasClass('fi-lock')) {
            code = 2;
        } else {
            code = 1;
        }
        var calldata = {
            'name': $scope.canvastabs[$scope.canvasOrder].title + '中的' + $scope.dataMks.mks[$scope.canvasOrder].widget[$scope.order].name,
            'remove': $scope.remove,
            'code': code
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
    };
    $scope.clearElement = function(){
        $scope.confirmClear = function(){
            angular.element(document.querySelector('.clearElement')).scope().emptyWrap($scope.canvasOrder);
            $scope.dataMks.mks[$scope.canvasOrder].widget.splice(0,$scope.dataMks.mks[$scope.canvasOrder].widget.length);
            $scope.addOrder[$scope.canvasOrder] = -1; 
        };
        var calldata = {
            'name': $scope.canvastabs[$scope.canvasOrder].title + '中的所有组件',
            'remove': $scope.confirmClear,
            'code': 1
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
    };
    
    $scope.getImageSize = function(){
        var img = new Image();
        img.src = $scope.dataMks.mks[$scope.canvasOrder].widget[$scope.order].imgUrl;
        img.onload = function() {
            $scope.$apply(
                $scope.dataMks.mks[$scope.canvasOrder].widget[$scope.order].size.width = this.width,
                $scope.dataMks.mks[$scope.canvasOrder].widget[$scope.order].size.height = this.height
            );
        };
    };
    $scope.setLeft = function(){
        $scope.dataMks.offsetLeft =  $cookieStore.get('shoptype')===0?($scope.dataMks.width-950)/2:($scope.dataMks.width-990)/2; 
    };
    $scope.generateCode = function(){
        if(angular.isDefined($scope.ckName)){
            $scope.getCode = function(type){
                $scope.setLeft();
                ajax.generateCode(type,$scope.dataMks);
            };  
            var calldata = {
                'action': $scope.getCode,
                'code': 11
            };
            $modal.open({
                templateUrl: 'views/myWindow.html',
                controller: 'windowCtrl',
                resolve: {
                    data: function() {
                        return calldata;
                    }
                }
            });
        }else{
            $scope.login();
        }
    };
    $scope.login = function(){
        $scope.setCk = function(){
            $scope.ckName = $cookieStore.get('userName');
            $scope.shopType = $cookieStore.get('shoptype');
        };
        var calldata = {
            'action': $scope.setCk
        };
        $modal.open({
            templateUrl: 'views/myWindow.html',
            controller: 'loginWindowCtrl',
            resolve: {
                data: function() {
                    return calldata;
                }
            }
         });
    };
    $scope.ckName = $cookieStore.get('userName');
    $scope.shopType = $cookieStore.get('shoptype');
    $scope.logout = function(){
        $cookieStore.remove('userName');
        $cookieStore.remove('shoptype');
        delete $scope.ckName;
        delete $scope.shopType;
    };
    $scope.preview = function(){
        $scope.smallTip = true;
        $scope.tipText = '加载中...';
        $scope.setLeft();
        ajax.preViewt($scope.dataMks,$scope.ckName,$cookieStore.get('shoptype'));
    };
    $scope.accountInfo = function(){
        $modal.open({
            templateUrl: 'views/account.html',
            controller: 'accountInfo',
            resolve: {
                data: function() {
                    return $scope.ckName;
                }
            }
         });
    };
    $scope.save = function(){
        $scope.smallTip = true;
        $scope.tipText = '保存中...';
        if(angular.isDefined($scope.jid)){
            ajax.updateData($scope.dataMks,$scope.jid);
        }else{
            ajax.saveData($scope.dataMks,$scope.ckName);
        }
    };
    $scope.jsonList = function(){
        $modal.open({
            templateUrl: 'views/jsonlist.html',
            controller: 'getJsonList',
            resolve: {
                data: function() {
                    return $scope.ckName;
                }
            }
         });
    };
    $scope.import = function(){
        $scope.getCode = function(code){
            console.log(code);
            $scope.addElement('import','',$scope.canvasOrder);
        };
        $modal.open({
            templateUrl: 'views/import.html',
            controller: 'import',
            resolve: {
                data: function() {
                    return $scope.getCode;
                }
            }
         });
    };
}]);




app.controller('elementWindowCtrl', ["$scope", "$modalInstance", "data", function($scope, $modalInstance, data) {
    $scope.name = data.name;
    $scope.code = data.code;
    var remove = data.remove;
    $scope.ok = function() {
        $modalInstance.close(remove());
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('windowCtrl', ["$scope", "$modalInstance", "data", "$timeout", function($scope, $modalInstance, data, $timeout) {
    $scope.code = data.code;
    var action = data.action;
    $scope.ok = function(type) {
        action(type);

    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.getCodeToCopy = function() {
        return $scope.htmlCode;
    };
    $scope.copied= false;
    $scope.doSomething = function () {
        $scope.copied= true;
        $timeout(function() {
            $scope.copied= false;
            },
            2000
        );
    };
    $scope.$on('codeGenerateSuccess', function(event, code) {
        $scope.htmlCode = code;
    });
}]);

app.controller('loginWindowCtrl', ["$scope", "$modalInstance", "data", "md5", "$http", "$timeout", "$cookieStore", function($scope, $modalInstance, data, md5, $http, $timeout, $cookieStore) {
    $scope.code = 12;
    var action = data.action;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.login = function(){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/login',data:{'name':$scope.userName,'pass':angular.isDefined($scope.userPass)?md5.createHash($scope.userPass):''}})
                .success(function(data) {
                    $scope.backCode = data.code;
                    if(data.code===0){
                        $scope.showSuccess = true;
                        $scope.dbName = data.name;
                        $cookieStore.put('userName', $scope.dbName);
                        $cookieStore.put('shoptype', data.shoptype);
                        action();
                        $timeout(function() {
                            $scope.showSuccess = false;
                            $modalInstance.dismiss('cancel');
                            },
                            1000
                        );
                    }
                });
        
    }; 
    $scope.hide = function(){
        if($scope.backCode==1||$scope.backCode==2){
            $scope.backCode=0;
        }
    };
}]);
app.controller('getJsonList', ["$scope", "ajax", "$modalInstance", "data", "$timeout", function($scope, ajax, $modalInstance, data, $timeout) {
    var name = data; 
    $scope.ajax = function(method,page,jid,status){
        $scope.deletea = method=='delete'?true:false;
        ajax.getJsonList(method,name,page,jid,status);
        $scope.$on('getlist',function(event,data){
            $scope.jsonlist = data.data;
            $scope.totalItems = data.total;
            if(method=='delete'){
                $timeout(function() {
                        $scope.deletea = false;
                    },
                            1500
                );
            }
       });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.ajax('getlist', $scope.currentPage);
    
    $scope.goPage = function(page){
        $scope.ajax('getlist', page);
    };
    $scope.open = function(jid){
        ajax.open(jid);
        $modalInstance.dismiss('cancel');
    };


}]);
app.controller('import',["$scope", "$modalInstance", function($scope, $modalInstance){
    $scope.ok = function() {
        if(angular.isDefined($scope.htmlCode)){
            $scope.$emit('import',$scope.htmlCode);
        }
        $scope.cancel();   
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('accountInfo', ["$scope", "md5", "ajax", "$modalInstance", "data", "$timeout", function($scope, md5, ajax, $modalInstance, data, $timeout) {
    var name = data;
    ajax.getDate('userdata',name);
    $scope.$on('userDataReady',function(event,data){
            $scope.userData = data.data;
            $scope.backCode = data.code;
            if($scope.backCode==3){
                $timeout(function() {
                        $scope.backCode = 0;
                        $scope.code = 1;
                    },
                            1500
                );
            }
    });
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.code = 1;
    $scope.change = function(){
        if($scope.userPass==$scope.confirmPass&&angular.isDefined($scope.userPass)&&angular.isDefined($scope.beforePass)){
            ajax.getDate('changepass',name,md5.createHash($scope.beforePass),md5.createHash($scope.userPass));
        }else if(angular.isUndefined($scope.beforePass)){
            $scope.backCode = 1;
        }else{
            $scope.backCode = 2;
        }
    };
    $scope.hide = function($scope){
        if($scope.backCode==1||$scope.backCode==2){
            $scope.backCode=0;
        }
    };
}]);

Date.prototype.format = function(partten,time){
    function getLastDay(y,m){
        if(m == 2){
            return y % 4 === 0 ? 29 : 28;
        }else if(m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12){
            return 31;
        }else{
            return 30;
        }
    }
    if(partten === null||partten === '')
    {
        partten = 'y-m-d h:n:s'    ;
    }
    var y = this.getFullYear();
    var m = this.getMonth()+1;
    var d = this.getDate();
    var h = this.getHours(); 
    var n = this.getMinutes();
    var s = this.getSeconds();  
    var r = partten.replace(/y+/gi,y);
    if(time == 'future'){ 
        if(d==getLastDay(y,m)){
            if(m==12){
                y = y + 1;
                m = 1;
            }else{
                m = m + 1;
            }
            d = 2;
        }else{
          d = d + 2;   
        }
    }
    r = r.replace(/m+/gi,(m<10?'0':'')+m);
    r = r.replace(/d+/gi,(d<10?'0':'')+d);
    r = r.replace(/h+/gi,(h<10?'0':'')+h);
    r = r.replace(/n+/gi,(n<10?'0':'')+n);
    r = r.replace(/s+/gi,(s<10?'0':'')+s);
    return r; 
};

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
                    if(type=='wwgroup'||type=='ww'||type=='jdservice'||type=='import'){
                        angular.element(element[0].children[canvasOrder]).append($compile('<div loadx="'+number+'" '+type+' yd-drag></div>')(scope)); 
                    }else{
                        angular.element(element[0].children[canvasOrder]).append($compile('<div loadx="'+number+'" '+type+' yd-drag yd-resize></div>')(scope)); 
                    }

            }
            function addLayer(index, type, name, canvasOrder){
                var layerHtml = '<p class="eButton ' + type + '_' + index + ' now" index="' + index + '">'+
                '<span class="left">' + name + '</span>'+
                '<i class="icon fi-x size-14 right" ng-click="deleteElement()" ></i>'+
                '<i class="icon fi-arrow-down size-14 actChangeZindex right" tooltip="下移"></i>'+
                '<i class="icon fi-arrow-up size-14 actChangeZindex right" tooltip="上移"></i>'+
                '<i class="icon fi-unlock size-14 actLock right" tooltip="锁定"></i>'+
                '</p>';
                angular.element(document.querySelector('.layer_' + canvasOrder)).prepend($compile(layerHtml)(scope));
            }
            function initialize(){
                angular.element(element[0].children[0]).empty().append($compile('<div class="gridbg"></div>')(scope));
                angular.element(document.querySelector('.layer_0')).empty();
                scope.order = -1;
                scope.addOrder = [-1];
                scope.canvasOrder = scope.indexCanvas - 1;
                for(var i=1;scope.indexCanvas>1;i++){
                    scope.confirmDelete();
                }
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
                if(dataTransfer=='wwgroup'||dataTransfer=='ww'||dataTransfer=='jdservice'){
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
                addLayer(scope.order, scope.dataMks.mks[scope.canvasOrder].widget[scope.order].type, scope.dataMks.mks[scope.canvasOrder].widget[scope.order].name, scope.canvasOrder);
                
                
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
                'background-repeat:{{dataMks.mks[' + currentIndex + '].img.repeat}};background-color:{{dataMks.mks[' + currentIndex + '].color}};background-position:{{dataMks.mks[' + currentIndex + '].img.position}} center;" ng-style="{\'background-image\': \'url(\'+dataMks.mks['+currentIndex+'].img.url+\')\'}"><div class="gridbg"></div></div>';
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
            $rootScope.$on('import', function(event, code) {
                scope.addElement( 'import' );
                scope.dataMks.mks[scope.canvasOrder].widget[scope.order].code = code;
                addElement('import','',scope.canvasOrder);
                scope.dataMks.mks[scope.canvasOrder].widget[scope.order].position.left = 50;
                scope.dataMks.mks[scope.canvasOrder].widget[scope.order].position.top = 50;
                addLayer(scope.order, 'import', scope.dataMks.mks[scope.canvasOrder].widget[scope.order].name, scope.canvasOrder);
            });
            scope.$on('addWrap',addWrap);
            scope.$on('removeWrap',removeWrap);
            /*open*/
            scope.$on('open',function(event, data){
                initialize();
                scope.dataMks = data.data;
                scope.jid = data.jid;
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
                angular.element(document.querySelectorAll('.'+element[0].className.split(' ')[1])).addClass('now');
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
                    scope.$parent.$parent.$parent.dataMks.mks[attr.canvasorder].widget[attr.order].time = modelValue;
                    return modelValue; 
                }
            });
        }
    };
});
app.directive('smalltip', ["$timeout", function($timeout){
    return {
      restrict:'E',
      replace: true,
      template: '<div class="smalltip text-center load animated" ng-class="{\'fadeInDown\':smallTip,\'fadeOutUp\':smallTip==null}">{{tipText}}</div>',
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
        scope.$on('endview',function(){
            scope.smallTip= null;
        });
      }
    };
}]);
app.directive('preview',  ["$cookieStore", "$compile", function ($cookieStore,$compile) {
    return  {
        restrict: 'C',
         link: function(scope,element) {
            scope.$on('viewSuccess',function(event,data){
                if(data){
                    scope.preViewShow = true;
                    scope.htmlUrl = 'shop_'+$cookieStore.get('shoptype')+'_'+scope.ckName;
                    angular.element(element.children()[0]).empty().append($compile(data)(scope));
                }else{
                    scope.tipText = '通信失败，检查网络！';
                }
            });
        }
    };
}]);

app.directive('mAppLoading',["$animate", function( $animate ) {
    return{
        restrict: 'C',
        link: function( scope, element, attributes ) {
             $animate.leave( element.children().eq( 1 ) ).then(
                function cleanupAfterAnimation() {
                    // Remove the root directive element.
                    element.remove();
                    // Clear the closed-over variable references.
                    scope = element = attributes = null;
                }
            );
        }
    };
 }]);
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
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('img', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/img.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('imgtwo', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/img.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
}).directive('imgeffect', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/imgeffect.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('text', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/text.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('paragraph', ["$compile", function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/paragraph.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
}]).directive('countdown', ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/countdown.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
}]).directive('cart', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/cart.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
}).directive('video', ["$sce", function($sce) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/video.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}]).directive('wwgroup', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/wwgroup.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('jdservice', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/jdservice.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
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
}).directive('carousel', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/carousel.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('carouseline', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/carouseline.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('accordiona', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/accordiona.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            scope.active = 0;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('comment', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/comment.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('userdefine', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/userdefine.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}).directive('import', ["$compile", function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: 'template/widget/import.html',
        link: function(scope, element, attr) {
            scope.index = attr.loadx!==''?attr.loadx:scope.$parent.order;
            angular.element(element).append($compile(scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index].code)(scope));
            function removeData() {
                delete scope.$parent.dataMks.mks[scope.$parent.canvasOrder].widget[scope.index];
            }
            element.on('$destroy', removeData);
        }
    };
}]);


app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/area.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/img.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}">'+
    '</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/imgeffect.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}">'+
    '<img class="imghover" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].hover.position.left}}px;top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].hover.position.top}}px;" ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].hover.imgUrl}}"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/text.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;line-height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].lineht}}px;font-size:{{$parent.'+
    'dataMks.mks[$parent.canvasOrder].widget[index].fontsize}}px;font-weight:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].weight}};color:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].color}};font-family:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].font}};">{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].text}}</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/paragraph.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;line-height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].lineht}}px;font-size:{{$parent.'+
    'dataMks.mks[$parent.canvasOrder].widget[index].fontsize}}px;font-weight:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].weight}};color:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].color}};font-family:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].font}};"><div class="text_bd">{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].text}}</div></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/countdown.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
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
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}">'+
    '</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/qrcode.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src="http://gqrcode.alicdn.com/img?{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].qrtype}}'+
    '={{$parent.dataMks.mks[$parent.canvasOrder].widget[index].id}}&w={{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}&h={{$parent.dataMks.mks[$parent.canvasOrder].widget[index]'+
    '.size.height}}"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/search.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} status{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].showStyle}} now" index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent'+
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
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><iframe src="{{trustSrc($parent.dataMks.mks[$parent.canvasOrder].widget[index].videolink)}}" '+
    'width="100%" height="100%" frameborder="0"></iframe></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/wwgroup.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;'+
    '"><img ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}}">'+
    '</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/ww.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;"><img ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}}"><br>'+
    '<img ng-class="{\'toux\':$parent.dataMks.mks[$parent.canvasOrder].widget[index].img!=\'\'&&$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgStyle==2}" ng-src="images/tool/ww'+
    '{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgStyle}}.gif"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/jdservice.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;"><img ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].img}}"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/attention.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img ng-src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}}"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/share.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><div class="style{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].showStyle}}" style="'+
    'width:100%;height:100%;background-image:url({{$parent.dataMks.mks[$parent.canvasOrder].widget[index].imgUrl}});font-family:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].font}};'+
    'color:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].color}};font-size:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].fontsize}}px;font-weight:{{$parent.dataMks.mks'+
    '[$parent.canvasOrder].widget[index].weight}};">分享给好友</div></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/carousel.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].content[0].imgurl}}">'+
    '<span class="yd" style="z-index:99;cursor:pointer;left:10px;top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height/2-40}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].leftUrl}}"></span>'+
    '<span class="yd" style="z-index:99;cursor:pointer;right:10px;top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height/2-40}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].rightUrl}}"></span>'+
    '</div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/carouseline.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><div style="width:9999999px;height:100%;"><div class="list" '+
    'ng-repeat="carousel in $parent.dataMks.mks[$parent.canvasOrder].widget[index].content"><img ng-src="{{carousel.imgurl}}"></div><div class="list" ng-repeat="carousel in '+
    '$parent.dataMks.mks[$parent.canvasOrder].widget[index].content"><img ng-src="{{carousel.imgurl}}"></div></div><span class="yd" style="z-index:99;cursor:pointer;left:0px;top:'+
    '{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height/2-40}}px;"><img src="{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].leftUrl}}"></span><span class="yd" '+
    'style="z-index:99;cursor:pointer;right:0px;top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height/2-40}}px;"><img src="'+
    '{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].rightUrl}}"></span></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/accordiona.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><div class="list" '+
    'ng-repeat="accordion in $parent.dataMks.mks[$parent.canvasOrder].widget[index].content"><div class="ks-content" ng-show="active=={{$index}}">'+
    '<img ng-src="{{accordion.imgurl}}"></div><div class="trigger"><img accordion ng-click="$parent.active=$index" ng-src="{{accordion.ximgurl}}"></div></div></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/comment.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now sns-widget sns-comment sns-widget-ui" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><div class="comment-widget"><div class="comment-edit"><div class="comment-add"><div class="textarea-b">'+
    '<textarea class="f-txt" resize="none" style="" placeholder="我也插句话..."></textarea></div><div class="act"><span class="skin-blue"><em class="J_LetterCount">0/140</em><span class="btn">'+
    '<a href="#" class="J_PostComment">评论</a></span></span><a href="#" class="face">表情</a><label><input type="checkbox" class="ui-buttonset"> 同时转发到我的淘宝</label></div></div></div></div></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/userdefine.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;width:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.width}}px;'+
    'height:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].size.height}}px;"><div ng-bind-html="$parent.dataMks.mks[$parent.canvasOrder].widget[index].code | unsafe"></div>');
}]);

app.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/widget/import.html',
    '<div class="eButton {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}}_{{index}} {{$parent.dataMks.mks[$parent.canvasOrder].widget[index].type}} now" '+
    'index="{{index}}" style="position:absolute;left:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.left}}px;z-index:{{$parent.dataMks.mks[$parent.canvasOrder]'+
    '.widget[index].zindex}};top:{{$parent.dataMks.mks[$parent.canvasOrder].widget[index].position.top}}px;"></div>');
}]);
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

app.directive('accordion', ["$document", function($document) {
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
}]);

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

app.directive('imghover', ["$document", function($document) {
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
}]);
/*global angular */
(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) 
      {
        if (attr.type==='text/javascript-lazy') 
        {
        var s = document.createElement('script');
          s.type = 'text/javascript';                
          var src = elem.attr('src');
          if(src!==undefined)
          {
              s.src = src;
          }
          else
          {
              var code = elem.text();
              s.text = code;
          }
          document.head.appendChild(s);
          elem.remove();
          /*var f = new Function(code);
          f();*/
        }
        scope.$on('endview',function(){
            angular.element( document.querySelectorAll('head > script') ).remove() ;
        });
      }
    };
  });

}(angular));
'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
 
angular.module('toolApp').
	service('dataHandler', function() {
	this.canvas = function(width,height){
		return '{"jname": "未命名","width":'+width+',"height":'+(height-160)+',"offset":"margin:0 auto","offsetLeft": 0,"slider": {'+
				'"arrow": {"enable": true,"leftUrl": "http://img01.taobaocdn.com/bao/uploaded/i2/T1kqzaFhtaXXaCwpjX","leftPosition": { "left": 200,"top": '+(height-200)/2+'},'+
	                '"rightUrl": "http://img01.taobaocdn.com/bao/uploaded/i1/T1eJnPXeNrXXaCwpjX","rightPosition": { "left": '+(width-200)+',"top": '+(height-200)/2+'}},'+
	           '"nav": {"enable": true,"bgColor": "#cccccc","borderColor": "#666666", "color": "#666666","align": "left","position": {"left": '+(width-70)/2+',"top": '+(height-220)+'}},'+
	            '"effect": "scrollx","duration": 0.5,"autoplay": true},'+
	        '"mks": [{ "color": "transparent","img": {"repeat": "no-repeat","url": "","position":"center"}, "widget": []}],'+
	        '"version": 1}';
	};
	this.element = function(type,order) {
		switch(type){
			case 'area': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "热点层'+(order+1)+'","type": "area","position": {"left": 200,"top": 100},"size": {"width": 100,"height": 100},"link": ""}';
			} 
			break;
			case 'img': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "图片层'+(order+1)+'","type": "img","position": {"left": 200,"top": 100},"size": {"width": 310,"height": 390},"imgUrl":'+
				' "http://img02.taobaocdn.com/imgextra/i2/134264536/TB2b21EXVXXXXa9XpXXXXXXXXXX-134264536.jpg","link": ""}';
			} 
			break;
            case 'imgtwo': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "正反面'+(order+1)+'","type": "imgtwo","position": {"left": 200,"top": 100},"size": {"width": 320,"height": 430},"imgUrl":'+
                ' "http://img04.taobaocdn.com/imgextra/i4/134264536/TB2cjqfXVXXXXa2XpXXXXXXXXXX-134264536.jpg","link": "","hover": {"status": true,"imgUrl": "http://img01.taobaocdn.com/imgextra/i1/134264536/TB2Z1KecXXXXXbvXXXXXXXXXXXX-134264536.jpg"}}';
            } 
            break;
            case 'imgeffect': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "悬浮特效'+(order+1)+'","type": "imgeffect","position": {"left": 200,"top": 100},"size": {"width": 390,"height": 490},"imgUrl":'+
                ' "http://img04.taobaocdn.com/imgextra/i4/134264536/TB2EwOhcXXXXXX0XXXXXXXXXXXX-134264536.jpg","link": "","hover": {"position": {"left": 29,"top": 340},"imgUrl": "http://img04.taobaocdn.com/imgextra/i4/134264536/TB2a9SecXXXXXa4XpXXXXXXXXXX-134264536.png"},'+
                ' "transition":{"time":"05","effect":"ease-in","display":"yd-box-fadein","transX":"none","transY":"yd-box-dy40","css3":"none"}}';
            } 
            break;
			case 'text': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "文本层'+(order+1)+'","type": "text","position": {"left": 200,"top": 100},"size": {"width": 200,"height": 20},"text": "这是一个文本区",'+
				'"link": "", "font": "microsoft yahei","fontsize": 14,"lineht":14,"weight": 100,"color": "#000"}';
			} 
			break;
            case 'paragraph': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "段落层'+(order+1)+'","type": "paragraph","position": {"left": 200,"top": 100},"size": {"width": 200,"height": 100},"text": "我们是专业的店铺装修工作室，致力于各行业店铺模板的设计",'+
                '"font": "microsoft yahei","fontsize": 14,"lineht":14,"weight": 100,"color": "#000","scrollStatus": false,"scrollMode": "left","scrollSpeed": 5}';
            } 
            break;
			case 'countdown': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "倒计时'+(order+1)+'","type": "countdown","placetime": "'+(new Date()).format('y-m-d h:n:s','future')+'","time":"","show":4,"position": {"left": 100,"top"'+
				': 100},"size": {"width":305,"height":55},"margin":0,"lineht":36,"img": '+
				' "http://img01.taobaocdn.com/bao/uploaded/i2/T1H0_cFg4dXXaCwpjX","font": "impact","fontsize": 36,"weight": 100,"color": "#fff","units":true}';
			} 
			break;
			case 'cart': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "购物车'+(order+1)+'","type": "cart","position": {"left": 100,"top": 100},"size": {"width":50,"height":50},"imgUrl": '+
				' "http://img02.taobaocdn.com/imgextra/i2/134264536/T2RjJ8X64XXXXXXXXX-134264536.png","itemid":""}';
			} 
			break;
			case 'qrcode': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "二维码'+(order+1)+'","type": "qrcode","position": {"left": 100,"top"'+
				': 100},"size": {"width":140,"height":140}, "qrtype":"v=1&type=bs&shop_id","id":"123456"}';
			} 
			break;
			case 'search': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "搜索框'+(order+1)+'","type": "search","position": {"left": 100,"top":100},"size": {"width":394,"height":35}, "input": {"position":'+
				' {"left": 0,"top": 0},"size": {"width": 300,"height": 32}},"btn": {"position": { "left": 303,"top": 0 },"size": {"width": 90,"height":32}},"shoplink": "","textColor": "#000000",'+
				' "showStyle": 0,"mkColor": "#fa7f14","inputBgColor": "#ffffff","imgUrl": "http://img01.taobaocdn.com/bao/uploaded/i3/T1cs0cFdXfXXaCwpjX"}';
			} 
			break;
			case 'video': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "视频层'+(order+1)+'","type": "video","position": {"left": 100,"top":100},"size": {"width":300,"height":300},"videolink":'+
				'"http://player.youku.com/player.php/Type/Folder/Fid/23322150/Ob/1/sid/XODc2MzA4NDE2/v.swf"}';
			} 
			break;
			case 'wwgroup': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "旺旺群'+(order+1)+'","type": "wwgroup","position": {"left": 100,"top":100},"img": "http://img01.taobaocdn.com/bao/uploaded/i4/T1ZsYpFfpg'+
				'XXartXjX","wwGroupId":123456, "imgStyle": 1}';
			} 
			break;
			case 'ww': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "在线客服'+(order+1)+'","type": "ww","position": {"left": 100,"top":100},"img": '+
				'"http://img04.taobaocdn.com/imgextra/i4/134264536/T2fMp6X6RaXXXXXXXX-134264536.gif","wwId":"", "imgStyle": 1}';
			} 
			break;
            case 'jdservice': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "在线客服'+(order+1)+'","type": "jdservice","position": {"left": 100,"top":100},"img": '+
                '"http://img11.360buyimg.com/cms/jfs/t625/297/864798345/3219/6c8f477b/548fe1c3N9f50938a.gif","shopId":""}';
            } 
            break;
			case 'attention': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "天猫关注'+(order+1)+'","type": "attention","size": {"width":83,"height":24},"position": {"left": 100,"top":100},"imgUrl": '+
				'"http://img01.taobaocdn.com/bao/uploaded/i3/T1ROYFFn8eXXaCwpjX","brandid":""}';
			} 
			break;
			case 'favourite': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "店铺收藏'+(order+1)+'","type": "favourite","size": {"width":190,"height":160},"position": {"left": 100,"top":100},"imgUrl": '+
				'"http://img03.taobaocdn.com/imgextra/i3/134264536/TB2w22ZbFXXXXb0XpXXXXXXXXXX-134264536.gif","favouriteurl":""}';
			} 
			break;
			case 'share': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "分享层'+(order+1)+'","type": "share","size": {"width":92,"height":27},"position": {"left": 100,"top":100},"imgUrl": '+
				'"http://img04.taobaocdn.com/imgextra/i4/134264536/TB2U3D3bFXXXXbXXpXXXXXXXXXX-134264536.png","shareType":"item","id":"","showStyle":1,"font": "simsun","fontsize": 12,"weight": 100,"color": "#666"}';
			} 
			break;
            case 'carousel': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "图片轮播'+(order+1)+'","type": "carousel","effect":"scrollx","duration": 0.5,"autoplay": true,"easing":"easeBoth","size": {"width":500,'+
                '"height":350},"position": {"left": 100,"top":100},"leftUrl":"http://img01.taobaocdn.com/imgextra/i1/134264536/TB2WLNWcXXXXXcQXpXXXXXXXXXX-134264536.png","rightUrl": '+
                '"http://img04.taobaocdn.com/imgextra/i4/134264536/TB2Ll44cXXXXXcuXXXXXXXXXXXX-134264536.png","content":[{"imgurl"'+
                ':"http://img04.taobaocdn.com/imgextra/i4/134264536/TB2EcBWcXXXXXcHXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2g9dZcXXXXXbeXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"}]}';
            } 
            break;
            case 'carouseline': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "无缝轮播'+(order+1)+'","type": "carouseline","effect":"scrollx","duration": 0.5,"autoplay": true,"easing":"easeBoth","step":1,"size": '+
                '{"width":975,"height":484},"position": {"left": 100,"top":100},"leftUrl":"http://img01.taobaocdn.com/imgextra/i1/134264536/TB2oWzDXXXXXXXwXVXXXXXXXXXX-134264536.png","rightUrl": '+
                '"http://img01.taobaocdn.com/imgextra/i1/39767794/TB2RIxNbXXXXXc_XXXXXXXXXXXX-39767794.png","content":[{"imgurl":'+
                '"http://img02.taobaocdn.com/imgextra/i2/134264536/TB27kiacXXXXXX4XXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img03.taobaocdn.com/imgextra/i3/134264536/TB2oZebcXXXXXX1XXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2KZd_cXXXXXcUXXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"}]}';
            } 
            break;
            case 'accordiona': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "手风琴'+(order+1)+'","type": "accordiona","triggerType":"mouse","size": '+
                '{"width":1001,"height":428},"position": {"left": 100,"top":100},"content":[{"imgurl":'+
                '"http://img01.taobaocdn.com/imgextra/i1/134264536/TB2xpD9XXXXXXX5XFXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2x9iXcXXXXXcHXXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2iTWXcXXXXXc6XXXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2JV5XcXXXXXXBXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img03.taobaocdn.com/imgextra/i3/134264536/TB2_jSDXVXXXXa8XpXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img02.taobaocdn.com/imgextra/i2/134264536/TB27aj7XXXXXXXHXVXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2PxAlaFXXXXbaXpXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img02.taobaocdn.com/imgextra/i2/134264536/TB2pOCacXXXXXb_XXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img02.taobaocdn.com/imgextra/i2/134264536/TB2YJt9cXXXXXbmXpXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2qIR.cXXXXXXVXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"}]}';
            } 
            break;
            case 'comment': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "评论层'+(order+1)+'","type": "comment","position": {"left": 100,"top":100},"size": '+
                '{"width":750,"height":150},"activityUrl":"http://www.taobao.com","activityTitle":"活动标题","pagesize":"3"}';
            } 
            break;
            case 'userdefine': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "自定内容'+(order+1)+'","type": "userdefine","size":{"width":680,"height":300},"position": {"left": 100,"top":100},"code":"您的自定义内容(支持html)"}';
            } 
            break;
            case 'import': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "导入层'+(order+1)+'","type": "import","position": {"left": 100,"top":100},"code":""}';
            } 
            break;
		}
	};
}).service('ajax', ["$rootScope", "$http", function($rootScope, $http) {
	var code;
	this.generateCode = function(type,data){
		$http({method: 'POST', url: 'http://localhost:8888/index.php/make',data:{'type':type,'jsondata':data}})
                .success(function(data) {
                   $rootScope.$broadcast('codeGenerateSuccess', data); 
                }).error(function(data, status) {
                    console.log(data+status);	
          });
	};
	this.getCode = function(){
		return code;
	};
    this.saveData = function(data, name){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/save',data:{'jsondata':data,'username':name}})
                .success(function(data) {
                   $rootScope.$broadcast('savestatus', data); 
                });
    };
    this.updateData = function(data, jid){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/update',data:{'jsondata':data,'jid':jid}})
                .success(function(data) {
                   $rootScope.$broadcast('updatestatus', data); 
                });
    };
    this.getJsonList = function(method, name, page, jid, status){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/'+method,data:{'username':name,'page':page,'jid':jid,'status':status}})
                .success(function(data) {
                   $rootScope.$broadcast('getlist', data);
        });
    };
    this.open = function(jid){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/open',data:{'jid':jid}})
                .success(function(data) {
                   $rootScope.$broadcast('open', data); 
                });
    };
    this.getDate = function(method,name,bpass,pass){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/'+method,data:{'username':name,'beforepass':bpass,'pass':pass}})
                .success(function(data) {
                   $rootScope.$broadcast('userDataReady', data); 
                });
    };
    this.preViewt = function(json,name,type){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/make/preview',data:{'data':json,'name':name,'type':type}})
                .success(function(data) {
                    $rootScope.$broadcast('viewSuccess', data);
               });
    };
}]).factory('md5', function() {
	var md5 = {
		createHash: function(str) {
			var xl;
			var rotateLeft = function(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            };
			var addUnsigned = function(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            };

            var _F = function(x, y, z) {
                return (x & y) | ((~x) & z);
            };
            var _G = function(x, y, z) {
                return (x & z) | (y & (~z));
            };
            var _H = function(x, y, z) {
                return (x ^ y ^ z);
            };
            var _I = function(x, y, z) {
                return (y ^ (x | (~z)));
            };

            var _FF = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _GG = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _HH = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _II = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var convertToWordArray = function(str) {
                var lWordCount;
                var lMessageLength = str.length;
                var lNumberOfWordsTemp1 = lMessageLength + 8;
                var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
                var lWordArray = new Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount += 1;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };

            var wordToHex = function(lValue) {
                var wordToHexValue = '',
                    wordToHexValueTemp = '',
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount += 1) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    wordToHexValueTemp = '0' + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
                }
                return wordToHexValue;
            };

            var x = [],
                k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22,
                S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20,
                S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23,
                S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;

            //str = this.utf8_encode(str);
            x = convertToWordArray(str);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;

            xl = x.length;
            for (k = 0; k < xl; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
			var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
			return temp.toLowerCase();
        }
    };
	return md5;
});

'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:Filter
 * @description
 * # MainCtrl
 * Filter of the toolApp
 */

var app = angular.module('toolApp');

app.filter('unsafe', ["$sce", function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    }; }]);
'use strict';

angular.module('colorpicker.module', [])
    .factory('Helper', function () {
      return {
        closestSlider: function (elem) {
          var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
          if (matchesSelector.bind(elem)('I')) {
            return elem.parentNode;
          }
          return elem;
        },
        getOffset: function (elem, fixedPosition) {
          var
              x = 0,
              y = 0,
              scrollX = 0,
              scrollY = 0;
          while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
            if (!fixedPosition && elem.tagName === 'BODY') {
              scrollX += document.documentElement.scrollLeft || elem.scrollLeft;
              scrollY += document.documentElement.scrollTop || elem.scrollTop;
            } else {
              scrollX += elem.scrollLeft;
              scrollY += elem.scrollTop;
            }
            elem = elem.offsetParent;
          }
          return {
            top: y,
            left: x,
            scrollX: scrollX,
            scrollY: scrollY
          };
        },
        // a set of RE's that can match strings and generate color tuples. https://github.com/jquery/jquery-color/
        stringParsers: [
          {
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (execResult) {
              return [
                execResult[1],
                execResult[2],
                execResult[3],
                execResult[4]
              ];
            }
          },
          {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (execResult) {
              return [
                2.55 * execResult[1],
                2.55 * execResult[2],
                2.55 * execResult[3],
                execResult[4]
              ];
            }
          },
          {
            re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
            parse: function (execResult) {
              return [
                parseInt(execResult[1], 16),
                parseInt(execResult[2], 16),
                parseInt(execResult[3], 16)
              ];
            }
          },
          {
            re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
            parse: function (execResult) {
              return [
                parseInt(execResult[1] + execResult[1], 16),
                parseInt(execResult[2] + execResult[2], 16),
                parseInt(execResult[3] + execResult[3], 16)
              ];
            }
          }
        ]
      };
    })
    .factory('Color', ['Helper', function (Helper) {
      return {
        value: {
          h: 1,
          s: 1,
          b: 1,
          a: 1
        },
        // translate a format from Color object to a string
        'rgb': function () {
          var rgb = this.toRGB();
          return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
        },
        'rgba': function () {
          var rgb = this.toRGB();
          return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        },
        'hex': function () {
          return  this.toHex();
        },

        // HSBtoRGB from RaphaelJS
        RGBtoHSB: function (r, g, b, a) {
          r /= 255;
          g /= 255;
          b /= 255;

          var H, S, V, C;
          V = Math.max(r, g, b);
          C = V - Math.min(r, g, b);
          H = (C === 0 ? null :
              V === r ? (g - b) / C :
                  V === g ? (b - r) / C + 2 :
                      (r - g) / C + 4
              );
          H = ((H + 360) % 6) * 60 / 360;
          S = C === 0 ? 0 : C / V;
          return {h: H || 1, s: S, b: V, a: a || 1};
        },

        //parse a string to HSB
        setColor: function (val) {
          if(angular.isDefined(val)){
            val = val.toLowerCase();
          }
          for (var key in Helper.stringParsers) {
            if (Helper.stringParsers.hasOwnProperty(key)) {
              var parser = Helper.stringParsers[key];
              var match = parser.re.exec(val),
                  values = match && parser.parse(match);
              if (values) {
                this.value = this.RGBtoHSB.apply(null, values);
                return false;
              }
            }
          }
        },

        setHue: function (h) {
          this.value.h = 1 - h;
        },

        setSaturation: function (s) {
          this.value.s = s;
        },

        setLightness: function (b) {
          this.value.b = 1 - b;
        },

        setAlpha: function (a) {
          this.value.a = parseInt((1 - a) * 100, 10) / 100;
        },

        // HSBtoRGB from RaphaelJS
        // https://github.com/DmitryBaranovskiy/raphael/
        toRGB: function (h, s, b, a) {
          if (!h) {
            h = this.value.h;
            s = this.value.s;
            b = this.value.b;
          }
          h *= 360;
          var R, G, B, X, C;
          h = (h % 360) / 60;
          C = b * s;
          X = C * (1 - Math.abs(h % 2 - 1));
          R = G = B = b - C;

          h = ~~h;
          R += [C, X, 0, 0, X, C][h];
          G += [X, C, C, X, 0, 0][h];
          B += [0, 0, X, C, C, X][h];
          return {
            r: Math.round(R * 255),
            g: Math.round(G * 255),
            b: Math.round(B * 255),
            a: a || this.value.a
          };
        },

        toHex: function (h, s, b, a) {
          var rgb = this.toRGB(h, s, b, a);
          return '#' + ((1 << 24) | (parseInt(rgb.r, 10) << 16) | (parseInt(rgb.g, 10) << 8) | parseInt(rgb.b, 10)).toString(16).substr(1);
        }
      };
    }])
    .factory('Slider', ['Helper', function (Helper) {
      var
          slider = {
            maxLeft: 0,
            maxTop: 0,
            callLeft: null,
            callTop: null,
            knob: {
              top: 0,
              left: 0
            }
          },
          pointer = {};

      return {
        getSlider: function() {
          return slider;
        },
        getLeftPosition: function(event) {
          return Math.max(0, Math.min(slider.maxLeft, slider.left + ((event.pageX || pointer.left) - pointer.left)));
        },
        getTopPosition: function(event) {
          return Math.max(0, Math.min(slider.maxTop, slider.top + ((event.pageY || pointer.top) - pointer.top)));
        },
        setSlider: function (event, fixedPosition) {
          var
            target = Helper.closestSlider(event.target),
            targetOffset = Helper.getOffset(target, fixedPosition);
          slider.knob = target.children[0].style;
          slider.left = event.pageX - targetOffset.left - window.pageXOffset + targetOffset.scrollX;
          slider.top = event.pageY - targetOffset.top - window.pageYOffset + targetOffset.scrollY;
          
          pointer = {
            left: event.pageX,
            top: event.pageY
          };
        },
        setSaturation: function(event, fixedPosition) {
          slider = {
            maxLeft: 150,
            maxTop: 150,
            callLeft: 'setSaturation',
            callTop: 'setLightness'
          };
          this.setSlider(event, fixedPosition);
        },
        setHue: function(event, fixedPosition) {
          slider = {
            maxLeft: 0,
            maxTop: 150,
            callLeft: false,
            callTop: 'setHue'
          };
          this.setSlider(event, fixedPosition);
        },
        setAlpha: function(event, fixedPosition) {
          slider = {
            maxLeft: 0,
            maxTop: 150,
            callLeft: false,
            callTop: 'setAlpha'
          };
          this.setSlider(event, fixedPosition);
        },
        setKnob: function(top, left) {
          slider.knob.top = top + 'px';
          slider.knob.left = left + 'px';
        }
      };
    }])
    .directive('colorpicker', ['$document', '$compile', '$parse','Color', 'Slider', 'Helper', function ($document, $compile,$parse,Color, Slider, Helper) {
      return {
        require: '?ngModel',
        restrict: 'A',
        scope:{},
        link: function ($scope, elem, attrs, ngModel) {
          var  
              thisFormat = attrs.colorpicker ? attrs.colorpicker : 'hex',
              position = angular.isDefined(attrs.colorpickerPosition) ? attrs.colorpickerPosition : 'bottom',
              inline = angular.isDefined(attrs.colorpickerInline) ? attrs.colorpickerInline : false,
              fixedPosition = angular.isDefined(attrs.colorpickerFixedPosition) ? attrs.colorpickerFixedPosition : false,
              target = angular.isDefined(attrs.colorpickerParent) ? elem.parent() : angular.element(document.body),
              withInput = angular.isDefined(attrs.colorpickerWithInput) ? attrs.colorpickerWithInput : false,
              inputTemplate = withInput ? '<input type="text" name="colorpicker-input"></div>' : '',
              closeButton = !inline ? '<button type="button" class="tiny button">&times;</button>' : '',
              template =
                      '<div class="colorpicker f-dropdown animated n'+position+'">' +
                      '<div class="left" ng-include="\'views/generatedcolor.html\'"></div>' +
                      '<div class="right rcolorpicker"><colorpicker-saturation><i></i></colorpicker-saturation>' +
                      '<colorpicker-hue><i></i></colorpicker-hue>' +
                      '<colorpicker-alpha><i></i></colorpicker-alpha>' +
                      '<colorpicker-preview>Preview</colorpicker-preview>' +
                      inputTemplate +
                      closeButton +
                      '</div>',
              colorpickerTemplate = angular.element(template),
              pickerColor = Color,
              sliderAlpha,
              sliderHue = colorpickerTemplate.find('colorpicker-hue'),
              sliderSaturation = colorpickerTemplate.find('colorpicker-saturation'),
              colorpickerPreview = colorpickerTemplate.find('colorpicker-preview'),
              pickerColorPointers = colorpickerTemplate.find('i');
          $compile(colorpickerTemplate)($scope);
          
          if (withInput) {
            var pickerColorInput = colorpickerTemplate.find('input');
            pickerColorInput
                .on('mousedown', function(event) {
                  event.stopPropagation();
                })
                .on('keyup', function(event) {
                  var newColor = this.value;
                  elem.val(newColor);
                  $scope.objvalue = newColor;
                  if(ngModel) {
                    $scope.$apply(ngModel.$setViewValue(newColor));
                  }
                  event.stopPropagation();
                  event.preventDefault();
                });
            elem.on('keyup', function() {
              pickerColorInput.val(elem.val());
            });
          }

          var bindMouseEvents = function() {
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          };

          if (thisFormat === 'rgba') {
            colorpickerTemplate.addClass('alpha');
            sliderAlpha = colorpickerTemplate.find('colorpicker-alpha');
            sliderAlpha
                .on('click', function(event) {
                  Slider.setAlpha(event, fixedPosition);
                  mousemove(event);
                })
                .on('mousedown', function(event) {
                  Slider.setAlpha(event, fixedPosition);
                  bindMouseEvents();
                });
          }

          sliderHue
              .on('click', function(event) {
                Slider.setHue(event, fixedPosition);
                mousemove(event);
              })
              .on('mousedown', function(event) {
                Slider.setHue(event, fixedPosition);
                bindMouseEvents();
              });

          sliderSaturation
              .on('click', function(event) {
                Slider.setSaturation(event, fixedPosition);
                mousemove(event);
              })
              .on('mousedown', function(event) {
                Slider.setSaturation(event, fixedPosition);
                bindMouseEvents();
              });

          if (fixedPosition) {
            colorpickerTemplate.addClass('colorpicker-fixed-position');
          }

          colorpickerTemplate.addClass('colorpicker-position-' + position);
          if (inline === 'true') {
            colorpickerTemplate.addClass('colorpicker-inline');
          }

          target.append(colorpickerTemplate);

          if(ngModel) {
            ngModel.$render = function () {
              elem.val(ngModel.$viewValue);
            };
            $scope.$watch(attrs.ngModel, function(newVal) {
              update();

              if (withInput) {
                pickerColorInput.val(newVal);
                $scope.objvalue = newVal;
              }
            });
          }

          elem.on('$destroy', function() {
            colorpickerTemplate.remove();
          });

          var previewColor = function () {
            try {
              if(ngModel.$viewValue=='transparent'){
                colorpickerPreview.css('backgroundColor', pickerColor[thisFormat]());
              }else{
                colorpickerPreview.css('backgroundColor', ngModel.$viewValue);
              }
            } catch (e) {
              colorpickerPreview.css('backgroundColor', pickerColor.toHex());
            }
            sliderSaturation.css('backgroundColor', pickerColor.toHex(pickerColor.value.h, 1, 1, 1));
            if (thisFormat === 'rgba') {
              sliderAlpha.css.backgroundColor = pickerColor.toHex();
            }
          };
          
          var mousemove = function (event) {
            var
                left = Slider.getLeftPosition(event),
                top = Slider.getTopPosition(event),
                slider = Slider.getSlider();

            Slider.setKnob(top, left);

            if (slider.callLeft) {
              pickerColor[slider.callLeft].call(pickerColor, left / 150);
            }
            if (slider.callTop) {
              pickerColor[slider.callTop].call(pickerColor, top / 150);
            }
            previewColor();
            var newColor = pickerColor[thisFormat]();
            elem.val(newColor);
            $scope.objvalue = newColor;
            if(ngModel) {
              $scope.$apply(ngModel.$setViewValue(newColor));
            }
            if (withInput) {
              pickerColorInput.val(newColor);
            }
            return false;
          };

          var mouseup = function () {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
          };

          var update = function () {
            pickerColor.setColor(elem.val());
            pickerColorPointers.eq(0).css({
              left: pickerColor.value.s * 150 + 'px',
              top: 150 - pickerColor.value.b * 150 + 'px'
            });
            pickerColorPointers.eq(1).css('top', 150 * (1 - pickerColor.value.h) + 'px');
            pickerColorPointers.eq(2).css('top', 150 * (1 - pickerColor.value.a) + 'px');
            previewColor();
          };
          var getColorpickerTemplatePosition = function() {
            var
                positionValue,
                positionOffset = Helper.getOffset(elem[0]);

            if(angular.isDefined(attrs.colorpickerParent)) {
              positionOffset.left = 0;
              positionOffset.top = 0;
            }

            if (position === 'top') {
              positionValue =  {
                'top': positionOffset.top - 240,
                'left': positionOffset.left-400
              };
            } else if (position === 'right') {
              positionValue = {
                'top': positionOffset.top,
                'left': positionOffset.left + 126
              };
            } else if (position === 'bottom') {
              positionValue = {
                'top': positionOffset.top + elem[0].offsetHeight + 2,
                'left': positionOffset.left
              };
            } else if (position === 'left') {
              positionValue = {
                'top': positionOffset.top+30,
                'left': positionOffset.left
              };
            }
            return {
              'top': positionValue.top + 'px',
              'left': positionValue.left + 'px'
            };
          };

          var documentMousedownHandler = function() {
            hideColorpickerTemplate();
          };
          var inmethod = attrs.inmethod,
          outmethod = attrs.outmethod;
          if(inline === false) {
            elem.on('click', function () {
              update();
                colorpickerTemplate
                .removeClass(outmethod)
                .addClass('colorpicker-visible')
                .addClass(inmethod)
                .css(getColorpickerTemplatePosition());
              // register global mousedown event to hide the colorpicker
              $document.on('mousedown', documentMousedownHandler);
            });
          } else {
            update();
            colorpickerTemplate
              .removeClass(outmethod)
              .addClass('colorpicker-visible')
              .addClass(inmethod)
              .css(getColorpickerTemplatePosition());
          }

          colorpickerTemplate.on('mousedown', function (event) {
            event.stopPropagation();
            event.preventDefault();
          });

          var emitEvent = function(name) {
            if(ngModel) {
              $scope.$emit(name, {
                name: attrs.ngModel,
                value: ngModel.$modelValue
              });
            }
          };

          var hideColorpickerTemplate = function() {
            if (colorpickerTemplate.hasClass('colorpicker-visible')) {
              colorpickerTemplate.removeClass(inmethod).addClass(outmethod);
              emitEvent('colorpicker-closed');
              // unregister the global mousedown event
              $document.off('mousedown', documentMousedownHandler);
            }
          };

          $scope.changeColor=function(color){
            ngModel.$setViewValue(color);
            $scope.objvalue = color;
          };

          colorpickerTemplate.find('button').on('click', function () {
            hideColorpickerTemplate();
          });
        }
      };
    }]);

    