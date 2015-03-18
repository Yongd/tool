'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:Filter
 * @description
 * # MainCtrl
 * Filter of the toolApp
 */

var app = angular.module('toolApp');

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    }; });