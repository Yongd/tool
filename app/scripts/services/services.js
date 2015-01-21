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
		return '{"jname": "未命名","width":'+width+',"height":'+(height-160)+',"offset": "margin:0 auto","slider": {'+
				'"arrow": {"enable": true,"left_url": "http://img01.taobaocdn.com/bao/uploaded/i2/T1kqzaFhtaXXaCwpjX","left_position": { "left": 447.5,"top": 273},'+
	                '"right_url": "http://img01.taobaocdn.com/bao/uploaded/i1/T1eJnPXeNrXXaCwpjX","right_position": { "left": 1397,"top": 273}},'+
	           '"nav": {"enable": true,"bg_color": "","border_color": "", "font_color": "","align": 0,"position": {"left": 600,"top": 100}},'+
	            '"effect": "scrollx","duration": 0.5,"autoplay": true},'+
	        '"mks": [{ "color": "transparent","img": {"repeat": "no-repeat","url": ""}, "widget": []}],'+
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
				return '{"id": '+order+',"zindex": '+order+',"name": "图片层'+(order+1)+'","type": "img","position": {"left": 200,"top": 100},"size": {"width": 200,"height": 320},"imgUrl":'+
				' "http://img01.taobaocdn.com/bao/uploaded/i1/T1HqlOFo4hXXb1upjX","link": "","popup": {"status": false,"show": true,"imgUrl": "http://img01.taobaocdn.com/bao/uploaded/i1/T1m.XNFl4iXXb1upjX",'+
				' "position": {"left": 300,"top": 0}},"hover": {"status": false,"imgUrl": "http://img01.taobaocdn.com/bao/uploaded/i1/T1TPl0FXhaXXb1upjX"}}';
			} 
			break;
			case 'text': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "文字区'+(order+1)+'","type": "text","position": {"left": 200,"top": 100},"size": {"width": 200,"height": 100},"text": "这是一个文本区",'+
				'"link": "", "font": "microsoft yahei","fontsize": 14,"lineht":14,"weight": 100,"color": "#000","scrollStatus": false,"scrollMode": "left","scrollSpeed": 5}';
			} 
			break;
			case 'imgpop': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "弹出层'+(order+1)+'","type": "img","position": {"left": 200,"top": 100},"size": {"width": 200,"height": 320},"imgUrl":'+
				' "http://img01.taobaocdn.com/bao/uploaded/i1/T1HqlOFo4hXXb1upjX","link": "","popup": {"status": true,"show": true,"imgUrl": "http://img01.taobaocdn.com/bao/uploaded/i1/T1m.XNFl4iXXb1upjX",'+
				' "position": {"left": 300,"top": 0}},"hover": {"status": false,"imgUrl": "http://img01.taobaocdn.com/bao/uploaded/i1/T1TPl0FXhaXXb1upjX"}}';
			} 
			break;
			case 'countdown': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "倒计时'+(order+1)+'","type": "countdown","time": "'+(new Date()).format('y-m-d h:n:s','future')+'","show":0,"d":{"position": {"left": 100,"top": 100}},"h":'+ 
				' {"position": {"left": 200,"top": 100}},"m": {"position": {"left": 300,"top": 100}},"s": {"position": {"left": 400,"top": 100}},"img": '+
				' "http://img01.taobaocdn.com/bao/uploaded/i2/T1H0_cFg4dXXaCwpjX","font": "microsoft yahei","fontsize": 14,"weight": 100,"color": "#000","units":1}';
			} 
			break;
		}
	};
});