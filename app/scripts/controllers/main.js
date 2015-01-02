'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
var app = angular.module('toolApp');
app.controller('MyTool', function ($scope,$modal) {
	    $scope.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	    $scope.nowAct=-1;
		$scope.left = 200;
		$scope.bgcolor='#f00';
		$scope.canvasOrder=0;
		$scope.tabs = [
		{ title:'添加组件', content:'views/tools.html'},
		{ title:'画布管理', content:'views/canvas.html'},
		{ title:'图层管理', content:'views/layer.html'}
		];

		$scope.canvastabs = [
		{ title:'画布1', content:'views/canvasconfig.html'}
		];

		


      	var 
      	wWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      	wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      	
      	$scope.width ={
      		'c':950,
      		'b':990,
      		'self':wWidth
      	};
      	$scope.test = function(){
      		console.log(1);
      	};
      	
		$scope.dataMks = {
			'jname':'未命名',
			'width':wWidth,
			'height':wHeight,
			'slider':{
				'arrow':{
						'enable':true,
						'left_url':'http://img01.taobaocdn.com/bao/uploaded/i2/T1kqzaFhtaXXaCwpjX',
						'left_position':{'left':447.5,'top':273},
						'right_url':'http://img01.taobaocdn.com/bao/uploaded/i1/T1eJnPXeNrXXaCwpjX',
						'right_position':{'left':1397,'top':273},
					},
				'nav':{
						'enable':true,
						'bg_color':'',
						'border_color':'',
						'font_color':'',
						'align':0,
						'position':{'left':600,'top':100}
					},
				'effect':'scrollx',
				'duration':0.5,
				'autoplay':true
			},
			'mks':[
				{
					'color': 'transparent',
					'img':{'repeat':'no-repeat','url':''}
					
				}
			],
			'version':1
		};
		$scope.data = [];
		
		$scope.indexCanvas = 1;
		/**/
		$scope.addCanvas = function(){
			$scope.indexCanvas += 1;
			$scope.canvastabs.push({title:'画布'+$scope.indexCanvas, content:'views/canvasconfig.html'});
			$scope.dataMks.mks.push({'color': 'transparent', 'img':{'repeat':'no-repeat','url':''}});
			
		};

		$scope.deleteCanvas = function(){
			$scope.indexCanvas -= 1;
			$scope.canvastabs.splice($scope.canvasOrder,1);
			var tabLength = $scope.canvastabs.length;
			if($scope.canvasOrder==tabLength){
				$scope.canvasOrder-=1;
			}else{
				var rIndex = 0;
				for(var $i=0;$i<tabLength;$i++){
					rIndex ++;
					$scope.canvastabs[$i].title = '画布'+rIndex;
				}
			}
			$scope.dataMks.mks.splice($scope.canvasOrder,1);
		};


		$scope.getOrder = function(){
			$scope.nowAct++;
			$scope.order=$scope.nowAct;
			return $scope.order;
		};
		$scope.remove = function() {
			var obj = document.getElementsByClassName($scope.data[$scope.order].type+'_'+$scope.order);
	        //console.log($scope.data);
	        //console.log($scope.order);
	        if(obj!==null&&angular.element(obj[1].children[3]).hasClass('fi-unlock')) {
	        	console.log(123);
	            angular.element(obj).remove();
	        }
	        //console.log($scope.data);
	        //console.log($scope.order);
	    };
	    $scope.openWindow = function () {
	    	var calldata={'name':$scope.data[$scope.order].name,'order':$scope.order,'remove':$scope.remove};
			//var modalInstance = $modal.open({
			$modal.open({
		      templateUrl: 'myWindow.html',
		      controller: 'WindowCtrl',
		      resolve: {
		        data: function () {
		         	return calldata;
		        }
		      }
			});
		};
});
app.controller('WindowCtrl', function ($scope, $modalInstance, data) {
		$scope.name = data.name;
	  	$scope.order = parseInt(data.order)+1;
	  	$scope.remove = data.remove;
		$scope.ok = function () {
	    	$modalInstance.close($scope.remove());

	  	};
		$scope.cancel = function () {
	    	$modalInstance.dismiss('cancel');
    };
});

Array.prototype.unique3 = function(){
 this.sort();
	var re=[this[0]];
	for(var i = 1; i < this.length; i++)
	{
		if( this[i] !== re[re.length-1])
		{
			re.push(this[i]);
		}
	}
	return re;
};
