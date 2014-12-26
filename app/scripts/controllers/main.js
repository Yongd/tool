'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
app.controller('MyTool', function ($scope,$modal) {
	    $scope.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	    $scope.now_act=-1;
		$scope.left = 200;
		$scope.bgcolor='#f00';
		$scope.tabs = [
		{ title:"添加组件", content:"tools.html" },
		{ title:"图层管理", content:"layer.html"}
		],
		$scope.data = [
		
		],
		$scope.getOrder = function(){
			$scope.now_act++;
			$scope.order=$scope.now_act;
			return $scope.order;
		}
		$scope.remove = function() {
			var obj = document.getElementsByClassName($scope.data[$scope.order].type+'_'+$scope.order);
	        //console.log($scope.data);
	        //console.log($scope.order);
	        if(obj!=null&angular.element(obj[1].children[3]).hasClass('fi-unlock')) {
	        	console.log(123);
	            angular.element(obj).remove();
	        }
	        //console.log($scope.data);
	        //console.log($scope.order);
	    }
	    $scope.openWindow = function () {
	    	calldata={"name":$scope.data[$scope.order].name,"order":$scope.order,"remove":$scope.remove};
			var modalInstance = $modal.open({
		      templateUrl: 'myWindow.html',
		      controller: 'WindowCtrl',
		      resolve: {
		        data: function () {
		         	return calldata;
		        }
		      }
			});
		};	

 })
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
}
