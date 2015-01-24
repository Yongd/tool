'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
 var app = angular.module('toolApp');
 app.controller('MyTool', ['$scope', '$http','dataHandler', '$modal', function($scope, $http, dataHandler, $modal) {
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
    $scope.bgcolor = '#f00';

    $scope.ruler = true;
    $scope.attrControl = false;
    $scope.canvasPosition = 1;

    $scope.wWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    $scope.wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    $scope.width = {
        'c': 950,
        'b': 990,
        'self': $scope.wWidth-160
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
    $scope.addCanvas = function() {
        $scope.indexCanvas += 1;
        $scope.canvastabs.push({
            title: '画布' + $scope.indexCanvas,
            content: 'views/canvasconfig.html'
        });
        $scope.dataMks.mks.push({
            'color': 'transparent',
            'img': {
                'repeat': 'no-repeat',
                'url': ''
            },
            'widget': []
        });
        $scope.addOrder.push(-1);
    };
    $scope.deleteCanvas = function() {
        $scope.indexCanvas -= 1;
        $scope.canvastabs.splice($scope.canvasOrder, 1);
        $scope.addOrder.splice($scope.indexCanvas, 1);
        var tabLength = $scope.canvastabs.length;
        if ($scope.canvasOrder == tabLength) {
            $scope.canvasOrder -= 1;
        } else {
            var rIndex = 0;
            for (var $i = 0; $i < tabLength; $i++) {
                rIndex++;
                $scope.canvastabs[$i].title = '画布' + rIndex;
            }
        }
    };

    $scope.deleteCanvas = function() {
        $scope.confirmDelete = function() {
            angular.element(document.querySelector('.addWrap')).scope().removeWrap();
            $scope.canvasOrder -= 1;
            $scope.indexCanvas -= 1;
            $scope.canvastabs.splice($scope.indexCanvas, 1);
            $scope.addOrder.splice($scope.indexCanvas, 1);
        };
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
        $scope.addOrder[$scope.canvasOrder] += 1;
        $scope.order = $scope.addOrder[$scope.canvasOrder];
        $scope.dataMks.mks[$scope.canvasOrder].widget.push( JSON.parse( dataHandler.element(type,$scope.order) ) );
    };
    $scope.remove = function() {
        angular.element($scope.obj).remove();
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


}]);




app.controller('elementWindowCtrl', function($scope, $modalInstance, data) {
    $scope.name = data.name;
    $scope.code = data.code;
    $scope.remove = data.remove;
    $scope.ok = function() {
        $modalInstance.close($scope.remove());

    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});



Array.prototype.unique3 = function() {
    this.sort();
    var re = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== re[re.length - 1]) {
            re.push(this[i]);
        }
    }
    return re;
};
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



//console.log( Date.parse(  (new Date()).format('y-m-d h:n:s','future') ) );
//console.log( Date.parse(new Date())  );
