'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
var app = angular.module('toolApp'); 
app.directive('rsHandle', function($document) {
  return {
    restrict : 'C',
    link : function(a,b,c) {
      function mousedown() {
        $document.bind('mousemove',move);
        $document.bind('mouseup', mouseup);
      }
      function mouseup() {
        $document.unbind('mousemove', move);
        $document.unbind('mouseup', mouseup);
      }
      b.bind('mousedown',mousedown);
      function move(event){
        var left = event.clientX-44;
        if(left<=0){
          left=0;
        }else if(left>=181){
          left=181;
      }
        b.css('left',left+'px');
        var percent = Math.ceil(left/181*100);
        angular.element(document.getElementsByClassName('gridbg')[0]).css('opacity',percent/100);
        angular.element(document.getElementById(c.display)).text(percent);
      }
      
    }
  };
});
app.directive('draggable', ['$rootScope',function($rootScope) {
  return {
    restrict: 'A',
    link: function(a,b,c) {
      angular.element(b).attr('draggable', 'true');
      b.bind('dragstart', function(e) {
        e.dataTransfer.setData('text', c.directive);
        $rootScope.$emit('dragStart');
      });
      b.bind('dragend', function() {
        $rootScope.$emit('dragEnd');
      });
    }
  };
}]);
app.directive('droppable', ['$rootScope','$compile',function($rootScope,$compile) {
  return {
    restrict: 'A',
    link: function(a,b) {
      b.bind('dragover', function(e) {
        if (e.preventDefault) {
          e.preventDefault(); 
        }
        if(e.stopPropagation) { 
          e.stopPropagation(); 
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
      });/*
      b.bind("dragenter", function(e) {
        angular.element(e.target).addClass('lvl-over');
        console.log(e)
      });
      b.bind("dragleave", function(e) {
        angular.element(e.target).removeClass('lvl-over');
      });*/
      b.bind('drop', function(e) {
        console.log(11);
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (e.stopPropogation) {
          e.stopPropogation(); 
        }
        var dx = e.clientX,dy = e.clientY;//data = e.dataTransfer.getData('text');
        b.append($compile('<div ta ce-drag ce-resize></div>')(a));
        a.data[a.order].position.left=dx;
        a.data[a.order].position.top=dy;

        var obj=document.getElementById('layer_list');
        var layerHtml = '<p class="'+a.data[a.order].type+'_'+a.order+' active eButton" index="'+a.order+'">';
        layerHtml+='<i class="icon fi-x size-14" ng-click="openWindow()" ></i>';
        layerHtml+='<i class="icon fi-arrow-down size-14 actChangeZindex" tooltip="下移"></i>';
        layerHtml+='<i class="icon fi-arrow-up size-14 actChangeZindex" tooltip="上移"></i>';
        layerHtml+='<i class="icon fi-unlock size-14 actLock" tooltip="锁定"></i>';
        layerHtml+='<span>'+a.data[a.order].name+(a.order+1)+'</span>';
        layerHtml+='</p>';
        angular.element(obj).prepend($compile(layerHtml)(a));
      });
      $rootScope.$on('dragStart', function() {
        b.addClass('drop-target');
      });
      $rootScope.$on('dragEnd', function() {
        b.removeClass('drop-target');
      });
    }
  };
}]);




app.directive('ta', ['$document' , function() {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    scope:{},
    template:'<div class="{{$parent.data[index].type}}_{{index}} eButton active" index="{{index}}" style="position:absolute;left:{{$parent.data[index].position.left}}px;top:{{$parent.data[index].position.top}}px;width:{{$parent.data[index].size.width}}px;height:{{$parent.data[index].size.height}}px;background-color:#0f0;">{{index}}{{$parent.data[index]}}</div>',
    link:function(a,b){
      a.index=a.$parent.getOrder();
      a.$parent.data.push({
         'id':a.index,
         'zindex':a.index,
         'name':'热点层',
         'type':'area',
         'position':{'left':200,'top':100},
         'size':{'width':200,'height':300},
         'link':''
      });
      console.log(a.$parent.data);
      function removeData(){
        delete a.$parent.data[a.index];
      }
      b.on('$destroy',removeData);
    }
  };
}]);



app.directive('ceDrag', function($document) {
  return function(a, b, c) {
    var startX = 0, startY = 0;
    var newElement = angular.element('<div class="draggable"></div>');
    b.append(newElement);
    newElement.on('mousedown', function($event) {
      event.preventDefault();
        // To keep the last selected box in front
        //angular.element(document.querySelectorAll(".contentEditorBox")).css("z-index", "0");
        // b.css("z-index", "1"); 
      startX = $event.pageX - b[0].offsetLeft;
      startY = $event.pageY - b[0].offsetTop;
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);
    });
    function mousemove($event) {
      var y = $event.pageY - startY;
      var x = $event.pageX - startX;
      var width = parseInt(b.css('width'));
      var height = parseInt(b.css('height'));
      if(x+width > window.innerWidth ){
        x = window.innerWidth - width;
      }else if(x<0){
        x = 0;
      }
      if(y+height > window.innerHeight ){
        y = window.innerHeight - height;
      }else if(y<0){
        y = 0;
      }
      a.$apply(function(){
        a.data[c.index].position.left=x;
        a.data[c.index].position.top=y;
      });
      b.css({
        top: y + 'px',
        left:  x + 'px',
        opacity: 0.8
      });
    }
    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
      b.css('opacity',1);
    }
  };
});
app.directive('ceResize', function($document) {
  return function(a, b, c) {
    var resizeUp = function($event) {
      var top = $event.pageY;
      var height = b[0].offsetTop + b[0].offsetHeight - $event.pageY;
      if ($event.pageY < b[0].offsetTop + b[0].offsetHeight - 10) {
        a.data[c.index].position.top=top;
        a.data[c.index].size.height=height;
      } else {
        a.data[c.index].position.top=b[0].offsetTop + b[0].offsetHeight - 10;
        a.data[c.index].size.height=10;
      }
    };
    var resizeRight = function($event) {
      var width = $event.pageX - b[0].offsetLeft;
      if ($event.pageX > b[0].offsetLeft + 10) {
        a.data[c.index].size.width=width;
      } else {
        a.data[c.index].size.width=10;
      }
    };
    var resizeDown = function($event) {
      var height = $event.pageY - b[0].offsetTop;
      if ($event.pageY > b[0].offsetTop + 10) {
        a.data[c.index].size.height=height;
      } else {
        a.data[c.index].size.height=10;
      }
    };
    var resizeLeft = function($event) {
      var left = $event.pageX;
      var width = b[0].offsetLeft + b[0].offsetWidth - $event.pageX;

      if ($event.pageX < b[0].offsetLeft + b[0].offsetWidth - 10) {
        a.data[c.index].position.left=left;
        a.data[c.index].size.width=width;
      } else {
        a.data[c.index].position.left=b[0].offsetLeft + b[0].offsetWidth - 10;
        a.data[c.index].size.width=10;
      }
    };
    var newElement = angular.element('<div class="resizehandle n-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeUp($event));
      }
      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);
    });
    newElement = angular.element('<div class="resizehandle e-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeRight($event));
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);

      
    });
    newElement = angular.element('<div class="resizehandle s-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeDown($event));
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);

      
    });
    newElement = angular.element('<div class="resizehandle w-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeLeft($event));
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);

      
    });
    newElement = angular.element('<div class="resizehandle nw-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeUp($event),resizeLeft($event));
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);

      
    });
    newElement = angular.element('<div class="resizehandle ne-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
      
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeUp($event),resizeRight($event));
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);

    });
    newElement = angular.element('<div class="resizehandle se-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeDown($event),resizeRight($event));
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);

      
    });
    newElement = angular.element('<div class="resizehandle sw-resize"></div>');
    b.append(newElement);
    newElement.on('mousedown', function() {
       function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeDown($event),resizeLeft($event));
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);
      
     
    });
  };
});
app.directive('eButton',function(){
  return {
    restrict : 'C',
    link:function(a,b,c){
      function addAct(){
        angular.element(document.querySelectorAll('.eButton')).removeClass('active');
        angular.element(document.getElementsByClassName(c.class.split(' ')[0])).addClass('active');
        a.order=c.index;    
      }
      angular.element(document.querySelectorAll('.eButton')).removeClass('active');
      b.on('mousedown',addAct);
    }
  }; 
});


app.directive('layercontrol',function(){
  return {
    restrict : 'A',
    link : function(a,b){ 
      b.bind('mousedown',function(){
        b.parent().children().removeClass('active');
        b.addClass('active');
        a.order=b.attr('class').replace(/[^0-9]/ig,'');
      });
    }
  };
});
app.directive('actChangeZindex',['$animate',function($animate){
  return {
    restrict : 'C',
    link : function(a,b){ 
      
      function changeZindex(){
        var obj = b.parent(),nextObj;
        nextObj = b.hasClass('fi-arrow-down')?obj.next():angular.element(obj[0].previousSibling);
        if(nextObj.length===1&&angular.element(obj.children()[3]).hasClass('fi-unlock')){
          $animate.addClass(nextObj, 'ts', function(){
            obj.parent().children().removeClass('active');
            if(b.hasClass('fi-arrow-down')){
              nextObj.after(obj);
            }else{
              obj.parent()[0].insertBefore(obj[0],nextObj[0]);
            }
            $animate.removeClass(nextObj, 'ts',function(){
              obj.addClass('active');
            });
          });
          var order = obj.attr('class').replace(/[^0-9]/ig,'');
          var nextOrder = nextObj.attr('class').replace(/[^0-9]/ig,'');
          var tempOrder = a.data[order].zindex;
          a.data[order].zindex = nextOrder;
          a.data[nextOrder].zindex = tempOrder;
        }
      }
      b.bind('mousedown',changeZindex);
    }
  };
}]);

app.directive('actLock',function(){
  return {
    restrict : 'C',
    link : function(a,b){ 
      b.bind('mousedown',function(){
        if(b.hasClass('fi-unlock')){
          b.removeClass('fi-unlock').addClass('fi-lock');
        }else{
          b.removeClass('fi-lock').addClass('fi-unlock');
        }
      });
    }
  };
});



/*
app.directive("actRemove",function(){
  return {
    restrict : 'C',
    link : function(a,b,c){ 
      b.bind('mousedown',function(){
        //a.order=b.parent().attr('class').replace(/[^0-9]/ig,"");
        b.attr('tooltip','');
      })
    }
  }
})*/
