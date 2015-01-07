'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
var app = angular.module('toolApp');
app.controller('MyTool', function ($scope, $modal) {
	    $scope.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	    $scope.tabs = [
			{ title:'添加组件', content:'views/tools.html'},
			{ title:'画布管理', content:'views/canvas.html'},
			{ title:'图层管理', content:'views/layer.html'}
		];
		$scope.bgcolor='#f00';
		
		$scope.ruler = true;
		$scope.canvasPosition = 1;
      	
		var 
      	wWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      	wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      	$scope.width ={
	      	'c':950,
	      	'b':990,
	      	'self':wWidth
	    };
		$scope.addOrder = [-1];
		$scope.canvastabs = [
			{ title:'画布1', content:'views/canvasconfig.html'}
		];
		$scope.dataMks = {
			'jname':'未命名',
			'width':wWidth-160,
			'height':wHeight-300,
			'offset':'margin:0 auto',
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
					'img':{'repeat':'no-repeat','url':''},
					'widget':[]
				}
			],
			'version':1
		};

		
		
		
			
		
		$scope.canvasOrder=0;
		$scope.indexCanvas = 1;
		$scope.addCanvas = function(){
			$scope.indexCanvas += 1;
			$scope.canvastabs.push({title:'画布'+$scope.indexCanvas, content:'views/canvasconfig.html'});
			$scope.dataMks.mks.push({'color': 'transparent', 'img':{'repeat':'no-repeat','url':''}, 'widget':[]});
			$scope.addOrder.push(-1);
		};
		$scope.deleteCanvas = function(){
			$scope.indexCanvas -= 1;
			$scope.canvastabs.splice($scope.canvasOrder,1);
			$scope.addOrder.splice($scope.indexCanvas,1);
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
		
	
		

	var code;
	$scope.order = -1;

	$scope.addElement = function(){
		$scope.addOrder[$scope.canvasOrder] += 1;
		$scope.order = $scope.addOrder[$scope.canvasOrder];
		return $scope.order;
	};
	$scope.remove = function() {
		angular.element($scope.obj).remove();
	};
	$scope.openWindow = function () {
		$scope.obj = document.getElementsByClassName($scope.dataMks.mks[$scope.canvasOrder].widget[$scope.order].type+'_'+$scope.order);
		if($scope.obj===null||angular.element($scope.obj[1].children[4]).hasClass('fi-lock')) {
	        code = 2;
	    }else
	    {
	    	code = 1;
	    }
		var calldata={'name':$scope.dataMks.mks[$scope.canvasOrder].widget[$scope.order].name,'order':$scope.order,'remove':$scope.remove,'code':code};
		$modal.open({
		     templateUrl: 'views/myWindow.html',
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
		$scope.code = data.code;
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
