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
		return '{"jname": "未命名","width":'+width+',"height":'+(height-160)+',"offset":"margin:0 auto","offsetLeft": 0,"slider": {'+
				'"arrow": {"enable": true,"leftUrl": "http://img01.taobaocdn.com/bao/uploaded/i2/T1kqzaFhtaXXaCwpjX","leftPosition": { "left": 200,"top": '+(height-200)/2+'},'+
	                '"rightUrl": "http://img01.taobaocdn.com/bao/uploaded/i1/T1eJnPXeNrXXaCwpjX","rightPosition": { "left": '+(width-200)+',"top": '+(height-200)/2+'}},'+
	           '"nav": {"enable": true,"bgColor": "#cccccc","borderColor": "#666666", "color": "#666666","align": "left","position": {"left": '+(width-70)/2+',"top": '+(height-220)+'}},'+
	            '"effect": "scrollx","duration": 0.5,"autoplay": true},'+
	        '"mks": [{ "color": "transparent","img": {"repeat": "no-repeat","url": "","position":"center"}, "widget": []}],'+
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
				return '{"id": '+order+',"zindex": '+order+',"name": "图片层'+(order+1)+'","type": "img","position": {"left": 200,"top": 100},"size": {"width": 310,"height": 390},"imgUrl":'+
				' "http://img02.taobaocdn.com/imgextra/i2/134264536/TB2b21EXVXXXXa9XpXXXXXXXXXX-134264536.jpg","link": ""}';
			} 
			break;
            case 'imgtwo': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "正反面'+(order+1)+'","type": "imgtwo","position": {"left": 200,"top": 100},"size": {"width": 320,"height": 430},"imgUrl":'+
                ' "http://img04.taobaocdn.com/imgextra/i4/134264536/TB2cjqfXVXXXXa2XpXXXXXXXXXX-134264536.jpg","link": "","hover": {"status": true,"imgUrl": "http://img01.taobaocdn.com/imgextra/i1/134264536/TB2Z1KecXXXXXbvXXXXXXXXXXXX-134264536.jpg"}}';
            } 
            break;
            case 'imgeffect': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "悬浮特效'+(order+1)+'","type": "imgeffect","position": {"left": 200,"top": 100},"size": {"width": 390,"height": 490},"imgUrl":'+
                ' "http://img04.taobaocdn.com/imgextra/i4/134264536/TB2EwOhcXXXXXX0XXXXXXXXXXXX-134264536.jpg","link": "","hover": {"position": {"left": 29,"top": 340},"imgUrl": "http://img04.taobaocdn.com/imgextra/i4/134264536/TB2a9SecXXXXXa4XpXXXXXXXXXX-134264536.png"},'+
                ' "transition":{"time":"05","effect":"ease-in","display":"yd-box-fadein","transX":"none","transY":"yd-box-dy40","css3":"none"}}';
            } 
            break;
			case 'text': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "文本层'+(order+1)+'","type": "text","position": {"left": 200,"top": 100},"size": {"width": 200,"height": 20},"text": "这是一个文本区",'+
				'"link": "", "font": "microsoft yahei","fontsize": 14,"lineht":14,"weight": 100,"color": "#000"}';
			} 
			break;
            case 'paragraph': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "段落层'+(order+1)+'","type": "paragraph","position": {"left": 200,"top": 100},"size": {"width": 200,"height": 100},"text": "我们是专业的店铺装修工作室，致力于各行业店铺模板的设计",'+
                '"font": "microsoft yahei","fontsize": 14,"lineht":14,"weight": 100,"color": "#000","scrollStatus": false,"scrollMode": "left","scrollSpeed": 5}';
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
				' "http://img02.taobaocdn.com/imgextra/i2/134264536/T2RjJ8X64XXXXXXXXX-134264536.png","itemid":""}';
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
			case 'video': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "视频层'+(order+1)+'","type": "video","position": {"left": 100,"top":100},"size": {"width":300,"height":300},"videolink":'+
				'"http://player.youku.com/player.php/Type/Folder/Fid/23322150/Ob/1/sid/XODc2MzA4NDE2/v.swf"}';
			} 
			break;
			case 'wwgroup': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "旺旺群'+(order+1)+'","type": "wwgroup","position": {"left": 100,"top":100},"img": "http://img01.taobaocdn.com/bao/uploaded/i4/T1ZsYpFfpg'+
				'XXartXjX","wwGroupId":123456, "imgStyle": 1}';
			} 
			break;
			case 'ww': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "在线客服'+(order+1)+'","type": "ww","position": {"left": 100,"top":100},"img": '+
				'"http://img04.taobaocdn.com/imgextra/i4/134264536/T2fMp6X6RaXXXXXXXX-134264536.gif","wwId":"", "imgStyle": 1}';
			} 
			break;
            case 'jdservice': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "在线客服'+(order+1)+'","type": "jdservice","position": {"left": 100,"top":100},"img": '+
                '"http://img11.360buyimg.com/cms/jfs/t625/297/864798345/3219/6c8f477b/548fe1c3N9f50938a.gif","shopId":""}';
            } 
            break;
			case 'attention': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "天猫关注'+(order+1)+'","type": "attention","size": {"width":83,"height":24},"position": {"left": 100,"top":100},"imgUrl": '+
				'"http://img01.taobaocdn.com/bao/uploaded/i3/T1ROYFFn8eXXaCwpjX","brandid":""}';
			} 
			break;
			case 'favourite': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "店铺收藏'+(order+1)+'","type": "favourite","size": {"width":190,"height":160},"position": {"left": 100,"top":100},"imgUrl": '+
				'"http://img03.taobaocdn.com/imgextra/i3/134264536/TB2w22ZbFXXXXb0XpXXXXXXXXXX-134264536.gif","favouriteurl":""}';
			} 
			break;
			case 'share': 
			{
				return '{"id": '+order+',"zindex": '+order+',"name": "分享层'+(order+1)+'","type": "share","size": {"width":92,"height":27},"position": {"left": 100,"top":100},"imgUrl": '+
				'"http://img04.taobaocdn.com/imgextra/i4/134264536/TB2U3D3bFXXXXbXXpXXXXXXXXXX-134264536.png","shareType":"item","id":"","showStyle":1,"font": "simsun","fontsize": 12,"weight": 100,"color": "#666"}';
			} 
			break;
            case 'carousel': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "图片轮播'+(order+1)+'","type": "carousel","effect":"scrollx","duration": 0.5,"autoplay": true,"easing":"easeBoth","size": {"width":500,'+
                '"height":350},"position": {"left": 100,"top":100},"leftUrl":"http://img01.taobaocdn.com/imgextra/i1/134264536/TB2WLNWcXXXXXcQXpXXXXXXXXXX-134264536.png","rightUrl": '+
                '"http://img04.taobaocdn.com/imgextra/i4/134264536/TB2Ll44cXXXXXcuXXXXXXXXXXXX-134264536.png","content":[{"imgurl"'+
                ':"http://img04.taobaocdn.com/imgextra/i4/134264536/TB2EcBWcXXXXXcHXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2g9dZcXXXXXbeXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"}]}';
            } 
            break;
            case 'carouseline': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "无缝轮播'+(order+1)+'","type": "carouseline","effect":"scrollx","duration": 0.5,"autoplay": true,"easing":"easeBoth","step":1,"size": '+
                '{"width":975,"height":484},"position": {"left": 100,"top":100},"leftUrl":"http://img01.taobaocdn.com/imgextra/i1/134264536/TB2oWzDXXXXXXXwXVXXXXXXXXXX-134264536.png","rightUrl": '+
                '"http://img01.taobaocdn.com/imgextra/i1/39767794/TB2RIxNbXXXXXc_XXXXXXXXXXXX-39767794.png","content":[{"imgurl":'+
                '"http://img02.taobaocdn.com/imgextra/i2/134264536/TB27kiacXXXXXX4XXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img03.taobaocdn.com/imgextra/i3/134264536/TB2oZebcXXXXXX1XXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2KZd_cXXXXXcUXXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"}]}';
            } 
            break;
            case 'accordiona': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "手风琴'+(order+1)+'","type": "accordiona","triggerType":"mouse","size": '+
                '{"width":1001,"height":428},"position": {"left": 100,"top":100},"content":[{"imgurl":'+
                '"http://img01.taobaocdn.com/imgextra/i1/134264536/TB2xpD9XXXXXXX5XFXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2x9iXcXXXXXcHXXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2iTWXcXXXXXc6XXXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2JV5XcXXXXXXBXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img03.taobaocdn.com/imgextra/i3/134264536/TB2_jSDXVXXXXa8XpXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img02.taobaocdn.com/imgextra/i2/134264536/TB27aj7XXXXXXXHXVXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img01.taobaocdn.com/imgextra/i1/134264536/TB2PxAlaFXXXXbaXpXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img02.taobaocdn.com/imgextra/i2/134264536/TB2pOCacXXXXXb_XXXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"},{"imgurl":"'+
                'http://img02.taobaocdn.com/imgextra/i2/134264536/TB2YJt9cXXXXXbmXpXXXXXXXXXX-134264536.jpg","ximgurl":"'+
                'http://img04.taobaocdn.com/imgextra/i4/134264536/TB2qIR.cXXXXXXVXpXXXXXXXXXX-134264536.jpg","link":"http://www.tiancaiui.com"}]}';
            } 
            break;
            case 'comment': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "评论层'+(order+1)+'","type": "comment","position": {"left": 100,"top":100},"size": '+
                '{"width":750,"height":150},"activityUrl":"http://www.taobao.com","activityTitle":"活动标题","pagesize":"3"}';
            } 
            break;
            case 'userdefine': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "自定内容'+(order+1)+'","type": "userdefine","size":{"width":680,"height":300},"position": {"left": 100,"top":100},"code":"您的自定义内容(支持html)"}';
            } 
            break;
            case 'import': 
            {
                return '{"id": '+order+',"zindex": '+order+',"name": "导入层'+(order+1)+'","type": "import","position": {"left": 100,"top":100},"code":""}';
            } 
            break;
		}
	};
}).service('ajax', function($rootScope, $http) {
	var code;
	this.generateCode = function(type,data){
		$http({method: 'POST', url: 'http://localhost:8888/index.php/make',data:{'type':type,'jsondata':data}})
                .success(function(data) {
                   $rootScope.$broadcast('codeGenerateSuccess', data); 
                }).error(function(data, status) {
                    console.log(data+status);	
          });
	};
	this.getCode = function(){
		return code;
	};
    this.saveData = function(data, name){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/save',data:{'jsondata':data,'username':name}})
                .success(function(data) {
                   $rootScope.$broadcast('savestatus', data); 
                });
    };
    this.updateData = function(data, jid){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/update',data:{'jsondata':data,'jid':jid}})
                .success(function(data) {
                   $rootScope.$broadcast('updatestatus', data); 
                });
    };
    this.getJsonList = function(method, name, page, jid, status){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/'+method,data:{'username':name,'page':page,'jid':jid,'status':status}})
                .success(function(data) {
                   $rootScope.$broadcast('getlist', data);
        });
    };
    this.open = function(jid){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/open',data:{'jid':jid}})
                .success(function(data) {
                   $rootScope.$broadcast('open', data); 
                });
    };
    this.getDate = function(method,name,bpass,pass){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/curd/'+method,data:{'username':name,'beforepass':bpass,'pass':pass}})
                .success(function(data) {
                   $rootScope.$broadcast('userDataReady', data); 
                });
    };
    this.preViewt = function(json,name,type){
        $http({method: 'POST', url: 'http://localhost:8888/index.php/make/preview',data:{'data':json,'name':name,'type':type}})
                .success(function(data) {
                    $rootScope.$broadcast('viewSuccess', data);
               });
    };
}).factory('md5', function() {
	var md5 = {
		createHash: function(str) {
			var xl;
			var rotateLeft = function(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            };
			var addUnsigned = function(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            };

            var _F = function(x, y, z) {
                return (x & y) | ((~x) & z);
            };
            var _G = function(x, y, z) {
                return (x & z) | (y & (~z));
            };
            var _H = function(x, y, z) {
                return (x ^ y ^ z);
            };
            var _I = function(x, y, z) {
                return (y ^ (x | (~z)));
            };

            var _FF = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _GG = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _HH = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _II = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var convertToWordArray = function(str) {
                var lWordCount;
                var lMessageLength = str.length;
                var lNumberOfWordsTemp1 = lMessageLength + 8;
                var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
                var lWordArray = new Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount += 1;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };

            var wordToHex = function(lValue) {
                var wordToHexValue = '',
                    wordToHexValueTemp = '',
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount += 1) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    wordToHexValueTemp = '0' + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
                }
                return wordToHexValue;
            };

            var x = [],
                k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22,
                S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20,
                S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23,
                S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;

            //str = this.utf8_encode(str);
            x = convertToWordArray(str);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;

            xl = x.length;
            for (k = 0; k < xl; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
			var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
			return temp.toLowerCase();
        }
    };
	return md5;
});
