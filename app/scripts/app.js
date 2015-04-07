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
