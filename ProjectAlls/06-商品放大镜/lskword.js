(function () {
  var lsk = {
    /*吸顶轮子效果
    str 传选择器，最好是ID*/
    scroll: function (str) {
      var oDom = document.querySelector(str);
      var getAllTop = getAllTop(oDom);
      function getAllTop(oDom) {
        var strTop = oDom.offsetTop;
        while (oDom = oDom.offetParent) {
          strTop += oDom.offsetTop
        }
        return strTop
      }
      window.onscroll = function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop >= getAllTop) {
          oDom.style.position = "fixed";
          oDom.style.marginTop = 0;
        } else {
          oDom.style.position = "relative";
          oDom.style.marginTop = getAllTop + 'px'
        }
      }
    },
      /**
      id 返回顶部元素的id字符串，默认值为#backtotop
      scrolltop 滑动多少px时显示返回顶部，默认为500
      target 目标值，默认为0，回到顶部
      animatetime 动画时间，默认为1000
      */
    backtotop: function (id, scrolltop, target, animatetime) {
      id         = id || '#backtotop';
      scrolltop  = scrolltop || 500;
      target     = target || 0;
      animatetime = animatetime || 1000;
      var oBack = document.querySelector(id);
      window.onscroll = function(){
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop > scrolltop) {
          oBack.style.display = 'block';
        } else {
          oBack.style.display = 'none';
        }
      }

      oBack.onclick = function() {
        scrollAnimate(target, animatetime);
      }

      function scrollAnimate(target, time) {
        if (navigator.userAgent.indexOf('MSIE') != -1) {
          var interval = 50;
        } else {
          var interval = 20;
        }
        var frame = 0;
        var frames = time / interval;
        var start = document.body.scrollTop || document.documentElement.scrollTop;
        var distance = target - start;
        var timer;
        clearInterval(timer);
        timer = setInterval(function(){
          frame++;
          if (frame >= frames) {
            clearInterval(timer);
          }
          //第一个参数t表示当前帧
          //第二个b表示起始位置
          //第三个c表示变化量
          //第四个d表示总帧数
          document.body.scrollTop = document.documentElement.scrollTop = CubicEaseInOut(frame, start, distance, frames);
        }, interval);

        function CubicEaseInOut(t,b,c,d){
          if ((t/=d/2) < 1) return c/2*t*t*t + b;
          return c/2*((t-=2)*t*t + 2) + b;
        }
      }
    },
    zoom: function (bigImgPath) {
      var oSmallPic = document.querySelector('#smallPic');
      var oBigPic = document.querySelector('#bigPic');
      var oZoom = document.querySelector('#zoom');
      oBigPic.style.backgroundImage = 'url(' + bigImgPath + ')';
      oBigPic.style.backgroundRepeat = 'no-repeat';

      //大图800*800 大图盒子 400*400
      //小图盒子350*350 放大镜175*175
      //所以放大镜总行程是350-175 = 175,  大图的总行程 800 - 400 = 400
      // var rate = 400 / 175;//可以用这句话代替下面的四行，下面四行是更通用的代码
      var bigPicWidth = parseFloat(fetchComputedStyle(oBigPic, 'width'));
      var smallPicWidth = parseFloat(fetchComputedStyle(oSmallPic, 'width'));
      var zoomWidth = parseFloat(fetchComputedStyle(oZoom, 'width'));
      var rate = (800 - bigPicWidth) / (smallPicWidth - zoomWidth) ;

      oSmallPic.onmouseover = function() {
        oZoom.style.display = 'block';
        oBigPic.style.display = 'block';
      }
      oSmallPic.onmouseout = function () {
        oZoom.style.display = 'none';
        oBigPic.style.display = 'none';
      }

      oSmallPic.onmousemove = function(event) {
        event = event || window.event;

        //event.offsetX不能用
        //因为onmousemove事件冒泡，鼠标碰到zoom这个放大镜时事件将往上传播
        //会触发oSmallPic的onmousemove事件。因此event.offsetX的坐标，以zoom左上角为准
        // var x = event.offsetX;
        // var y = event.offsetY;

        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        var x = event.clientX - (getAllLeft(oSmallPic) - scrollLeft) - oZoom.clientWidth / 2;
        var y = event.clientY - (getAllTop(oSmallPic) - scrollTop) - oZoom.clientHeight / 2;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > oSmallPic.clientWidth - oZoom.clientWidth) {
          x = oSmallPic.clientWidth - oZoom.clientWidth;
        }
        if (y > oSmallPic.clientHeight - oZoom.clientHeight) {
          y = oSmallPic.clientHeight - oZoom.clientHeight;
        }

        oZoom.style.top = y + 'px';
        oZoom.style.left = x + 'px';

        oBigPic.style.backgroundPosition = -x * rate + 'px ' + -y * rate + 'px';
      }
      function fetchComputedStyle(obj, property) {
        if (window.getComputedStyle) {
          property = property.replace(/[A-Z]/g, function(match){
            return '-' + match.toLowerCase();
          });
          return window.getComputedStyle(obj)[property]; //中括号里面可以是变量
        } else {
          property = property.replace(/-([a-z])/g, function(match, $1){
            return $1.toUpperCase();
          });
          return obj.currentStyle[property];
        }
      }
      function getAllTop(obj) {
        var allTop = obj.offsetTop;
        var currentObj = obj;
        while (currentObj = currentObj.offsetParent) {
          allTop += currentObj.offsetTop;
        }
        return allTop;
      }
      function getAllLeft(obj) {
        var allLeft = obj.offsetLeft;
        var currentObj = obj;
        while(currentObj = currentObj.offsetParent) {
          allLeft += currentObj.offsetLeft;
        }
        return allLeft;
      }

    }

  }
  window.lsk = lsk
})()

//面向对象轮子
/*
面向对象吸顶效果
*/
function Scroll(str) {
  this.str = document.querySelector(str)
  this.A()
}
(function() {
Scroll.prototype = {
    A: function () {
    console.log(this);
    var C = this.str
    var B = getAllTop(this.str)
    console.log(this);
    document.onscroll = function (self) {
    var P =
        document.documentElement.scrollTop ||
        document.body.scrollTop
        if (B <= P) {
          C.style.position = 'fixed'
          C.style.marginTop = 0
        } else {
          C.style.position = 'relative'
          C.style.marginTop = B + 'px'
        }
    }
    function getAllTop(str) {
      var strTop = str.offsetTop
      while (str = str.offsetParent) {
        strTop += str.offsetParent
      }
      return strTop;
    }
  }
}
}());
//返回顶部面向对象
function BackToTop(selector) {
  this.dom = null;
  this.selector = selector;
  this.init();
  this.bindEvent();
  this.bindScrollEvent();
}
BackToTop.prototype.init = function() {
  this.dom = document.querySelector(this.selector);
}
BackToTop.prototype.bindScrollEvent = function() {
  var self = this;
  window.onscroll = function(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollTop > 500) {
    self.dom.style.display = 'block';
    } else {
    self.dom.style.display = 'none';
    }
  }
}
BackToTop.prototype.bindEvent = function() {
   this.dom.onclick = function() {
    scrollAnimate(0, 1000);
  }

  function scrollAnimate(target, timer) {
    var interval = 20;
    var frame = 0;
    var frames = timer / interval;
    var start = document.body.scrollTop || document.documentElement.scrollTop;
    var distance = target - start;
    var timer;
    clearInterval(timer);
    timer = setInterval(function(){
    frame++;
    if (frame >= frames) {
      clearInterval(timer);
    }
    //第一个参数t表示当前帧
    //第二个b表示起始位置
    //第三个c表示变化量
    //第四个d表示总帧数
    document.body.scrollTop = document.documentElement.scrollTop = CubicEaseInOut(frame, start, distance, frames);
    }, interval);

    function CubicEaseInOut(t,b,c,d){
      if ((t/=d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
    }
  }
}
