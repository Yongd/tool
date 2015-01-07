'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
var app = angular.module('toolApp');
app.factory('data', function () {
	var data = [];
    return {
        showData: function() {
            console.log(data);
            return data;
        }
    };   
});


