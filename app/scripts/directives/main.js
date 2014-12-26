'use strict';

/**
 * @ngdoc function
 * @name toolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the toolApp
 */
app.directive('rsHandle', function($document) {
  return {
    restrict : 'C',
    link : function(a,b,c) {
      b.bind("mousedown",mousedown);
      function move(event){
        left = event.clientX-44;
        left<=0?left=0:'';
        left>=181?left=181:'';
        b.css('left',left+'px');
        percent = Math.ceil(left/181*100);
        angular.element(document.getElementsByClassName('gridbg')[0]).css('opacity',percent/100);
        angular.element(document.getElementById(c.display)).text(percent);
      }
      function mousedown() {
        $document.bind("mousemove",move)
        $document.bind('mouseup', mouseup);
      }
      function mouseup() {
        $document.unbind('mousemove', move);
        $document.unbind('mouseup', mouseup);
      }
    }
  }
})
app.directive('draggable', ['$rootScope',function($rootScope) {
  return {
    restrict: 'A',
    link: function(a,b,c) {
      angular.element(b).attr("draggable", "true");
      b.bind("dragstart", function(e) {
        e.dataTransfer.setData('text', c.directive);
        $rootScope.$emit("dragStart");
      });
      b.bind("dragend", function(e) {
        $rootScope.$emit("dragEnd");
      });
    }
  }
}])
app.directive('droppable', ['$rootScope','$compile',function($rootScope,$compile) {
  return {
    restrict: 'A',
    link: function(a,b,c) {
      var startX, startY, initialMouseX, initialMouseY;
      b.bind("dragover", function(e) {
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
      b.bind("drop", function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (e.stopPropogation) {
          e.stopPropogation(); 
        }
        var dx = e.clientX,dy = e.clientY,data = e.dataTransfer.getData("text");
        b.append($compile('<div ta ce-drag ce-resize></div>')(a));
        a.data[a.order].position.left=dx;
        a.data[a.order].position.top=dy;

        var obj=document.getElementById("layer_list");
        var layerHtml = '<p class="'+a.data[a.order].type+'_'+a.order+' active eButton" index="'+a.order+'">'
        +'<i class="icon fi-x size-14" ng-click="openWindow()" ></i>'
        +'<i class="icon fi-arrow-down size-14 actChangeZindex" tooltip="下移"></i>'
        +'<i class="icon fi-arrow-up size-14 actChangeZindex" tooltip="上移"></i>'
        +'<i class="icon fi-unlock size-14 actLock" tooltip="锁定"></i>'
        +'<span>'+a.data[a.order].name+(a.order+1)+'</span>'
        +'</p>';
        angular.element(obj).prepend($compile(layerHtml)(a));
      });
      $rootScope.$on("dragStart", function() {
        b.addClass("drop-target");
      });
      $rootScope.$on("dragEnd", function() {
        b.removeClass("drop-target");
      });
    }
  }
}])




app.directive('ta', ['$document' , function($document) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    scope:{},
    template:'<div class="{{$parent.data[index].type}}_{{index}} eButton active" index="{{index}}" style="position:absolute;left:{{$parent.data[index].position.left}}px;top:{{$parent.data[index].position.top}}px;width:{{$parent.data[index].a_size.width}}px;height:{{$parent.data[index].a_size.height}}px;background-color:#0f0;">{{index}}{{$parent.data[index]}}</div>',
    link:function(a,b,c){
      a.index=a.$parent.getOrder();
      a.$parent.data.push({
         "id":a.index,
         "z_index":a.index,
         "name":"热点层",
         "type":"area",
         "position":{"left":200,"top":100},
         "a_size":{"width":200,"height":300},
         "link":""
      });
      b.on('$destroy',removeData);
      function removeData(){
        delete a.$parent.data[a.index];
      }
    }
  }
}])



app.directive("ceDrag", function($document) {
  return function(a, b, c) {
    var startX = 0, startY = 0;
    var newElement = angular.element('<div class="draggable"></div>');
    b.append(newElement);
    newElement.on("mousedown", function($event) {
      event.preventDefault();
        // To keep the last selected box in front
        //angular.element(document.querySelectorAll(".contentEditorBox")).css("z-index", "0");
        // b.css("z-index", "1"); 
      startX = $event.pageX - b[0].offsetLeft;
      startY = $event.pageY - b[0].offsetTop;
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);
    });
    function mousemove($event) {
      y = $event.pageY - startY;
      x = $event.pageX - startX;
      width = parseInt(b.css('width'));
      height = parseInt(b.css('height'));
      if(x+width > window.innerWidth ){
        x = window.innerWidth - width;
      }else if(x<0){
        x = 0
      }
      if(y+height > window.innerHeight ){
        y = window.innerHeight - height;
      }else if(y<0){
        y = 0
      }
      a.$apply(function(){
        a.data[c.index].position.left=x;
        a.data[c.index].position.top=y;
      });
      b.css({
        top: y + "px",
        left:  x + "px",
        opacity: .8
      });
    }
    function mouseup() {
      $document.unbind("mousemove", mousemove);
      $document.unbind("mouseup", mouseup);
      b.css('opacity',1)
    }
  };
})
app.directive("ceResize", function($document) {
  return function(a, b, c) {
    var resizeUp = function($event) {
      var top = $event.pageY;
      var height = b[0].offsetTop + b[0].offsetHeight - $event.pageY;
      if ($event.pageY < b[0].offsetTop + b[0].offsetHeight - 10) {
        a.data[c.index].position.top=top;
        a.data[c.index].a_size.height=height;
      } else {
        a.data[c.index].position.top=b[0].offsetTop + b[0].offsetHeight - 10;
        a.data[c.index].a_size.height=10;
      }
    };
    var resizeRight = function($event) {
      var width = $event.pageX - b[0].offsetLeft;
      if ($event.pageX > b[0].offsetLeft + 10) {
        a.data[c.index].a_size.width=width;
      } else {
        a.data[c.index].a_size.width=10;
      }
    };
    var resizeDown = function($event) {
      var height = $event.pageY - b[0].offsetTop;
      if ($event.pageY > b[0].offsetTop + 10) {
        a.data[c.index].a_size.height=height;
      } else {
        a.data[c.index].a_size.height=10;
      }
    };
    var resizeLeft = function($event) {
      var left = $event.pageX;
      var width = b[0].offsetLeft + b[0].offsetWidth - $event.pageX;

      if ($event.pageX < b[0].offsetLeft + b[0].offsetWidth - 10) {
        a.data[c.index].position.left=left;
        a.data[c.index].a_size.width=width;
      } else {
        a.data[c.index].position.left=b[0].offsetLeft + b[0].offsetWidth - 10;
        a.data[c.index].a_size.width=10;
      }
    };
    var newElement = angular.element('<div class="resizehandle n-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeUp($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
    newElement = angular.element('<div class="resizehandle e-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeRight($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
    newElement = angular.element('<div class="resizehandle s-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeDown($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
    newElement = angular.element('<div class="resizehandle w-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeLeft($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
    newElement = angular.element('<div class="resizehandle nw-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeUp($event),resizeLeft($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
    newElement = angular.element('<div class="resizehandle ne-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeUp($event),resizeRight($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
    newElement = angular.element('<div class="resizehandle se-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);

      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeDown($event),resizeRight($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
    newElement = angular.element('<div class="resizehandle sw-resize"></div>');
    b.append(newElement);
    newElement.on("mousedown", function() {
      $document.bind("mousemove", mousemove);
      $document.bind("mouseup", mouseup);
      
      function mousemove($event) {
        event.preventDefault();
        a.$apply(resizeDown($event),resizeLeft($event));
      }

      function mouseup() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
      }
    });
  };
})
app.directive("eButton",function($document){
  return {
    restrict : 'C',
    link:function(a,b,c){
      angular.element(document.querySelectorAll(".eButton")).removeClass("active");
      b.on("mousedown",addAct) 
      function addAct($event){
        angular.element(document.querySelectorAll(".eButton")).removeClass("active");
        angular.element(document.getElementsByClassName(c.class.split(" ")[0])).addClass('active');
        a.order=c.index;    
      }
    }
  } 
})


app.directive("layercontrol",function(){
  return {
    restrict : 'A',
    link : function(a,b,c){ 
      b.bind("mousedown",function(){
        b.parent().children().removeClass('active');
        b.addClass('active');
        a.order=b.attr('class').replace(/[^0-9]/ig,"");
      })
    }
  }
})
app.directive("actChangeZindex",['$animate',function($animate){
  return {
    restrict : 'C',
    link : function(a,b,c){ 
      b.bind("mousedown",changeZindex);
      function changeZindex(){
        var obj = b.parent(),next_obj;
        next_obj = b.hasClass('fi-arrow-down')?obj.next():angular.element(obj[0].previousSibling)
        if(next_obj.length==1&&angular.element(obj.children()[3]).hasClass('fi-unlock')){
          $animate.addClass(next_obj, 'ts', function(){
            obj.parent().children().removeClass('active');
            if(b.hasClass('fi-arrow-down')){
              next_obj.after(obj);
            }else{
              obj.parent()[0].insertBefore(obj[0],next_obj[0]);
            }
            $animate.removeClass(next_obj, 'ts',function(){
              obj.addClass('active');
            });
          });
          var order = obj.attr('class').replace(/[^0-9]/ig,"");
          var next_order = next_obj.attr('class').replace(/[^0-9]/ig,"");
          var temp_order = a.data[order].z_index;
          a.data[order].z_index = next_order;
          a.data[next_order].z_index = temp_order;
        }
      }
    }
  }
}])

app.directive("actLock",function(){
  return {
    restrict : 'C',
    link : function(a,b,c){ 
      b.bind("mousedown",function(){
        b.hasClass('fi-unlock')?b.removeClass('fi-unlock').addClass('fi-lock'):b.removeClass('fi-lock').addClass('fi-unlock')
      })
    }
  }
})


/*
app.directive("actRemove",function(){
  return {
    restrict : 'C',
    link : function(a,b,c){ 
      b.bind("mousedown",function(){
        //a.order=b.parent().attr('class').replace(/[^0-9]/ig,"");
        b.attr('tooltip','');
      })
    }
  }
})*/
