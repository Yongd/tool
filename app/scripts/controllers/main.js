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




app.controller('elementWindowCtrl', function($scope, $modalInstance, data) {
    $scope.name = data.name;
    $scope.code = data.code;
    var remove = data.remove;
    $scope.ok = function() {
        $modalInstance.close(remove());
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('windowCtrl', function($scope, $modalInstance, data, $timeout) {
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
});

app.controller('loginWindowCtrl', function($scope, $modalInstance, data, md5, $http, $timeout, $cookieStore) {
    $scope.code = 12;
    var action = data.action;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.login = function(){
        $http({method: 'POST', url: 'http://www.tiancaiui.com/tool/ajax/index.php/login',data:{'name':$scope.userName,'pass':angular.isDefined($scope.userPass)?md5.createHash($scope.userPass):''}})
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
});
app.controller('getJsonList', function($scope, ajax, $modalInstance, data, $timeout) {
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


});
app.controller('import',function($scope, $modalInstance){
    $scope.ok = function() {
        if(angular.isDefined($scope.htmlCode)){
            $scope.$emit('import',$scope.htmlCode);
        }
        $scope.cancel();   
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('accountInfo', function($scope, md5, ajax, $modalInstance, data, $timeout) {
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
});

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
