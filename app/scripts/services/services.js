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
				return '{"id": '+order+',"zindex": '+order+',"name": "倒计时'+(order+1)+'","type": "countdown","placetime": "'+(new Date()).format('y-m-d h:n:s','future')+'","time":"","show":4,"position": {"left": 100,"top"'+
				': 100},"size": {"width":305,"height":55},"margin":0,"lineht":36,"img": '+
				' "http://img01.taobaocdn.com/bao/uploaded/i2/T1H0_cFg4dXXaCwpjX","font": "impact","fontsize": 36,"weight": 100,"color": "#fff","units":true}';
			} 
			break;
			case 'cart': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "购物车'+(order+1)+'","type": "cart","position": {"left": 100,"top": 100},"size": {"width":50,"height":50},"imgUrl": '+
				' "http://img02.taobaocdn.com/imgextra/i2/134264536/T2RjJ8X64XXXXXXXXX-134264536.png","link":""}';
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
			case 'wwgroup': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "旺旺群'+(order+1)+'","type": "wwgroup","position": {"left": 100,"top":100},"img": "http://img01.taobaocdn.com/bao/uploaded/i4/T1ZsYpFfpg'+
				'XXartXjX","wwGroupId":0, "imgStyle": 1}';
			} 
			break;
		}
	};
});