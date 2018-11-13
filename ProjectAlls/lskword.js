(function () {
  var lsk = {
	/**
	*针对数组进行拆分封装	                                    转变成
	*将数组中相同的 eg: [{key: a, value: b1},{key: a, value: b2}]   =>   [{key: a, list:[b1, b2]}]
	*/
	 // 快速抽取法
	/**
	*name :是你需要拆分出来的key 
	*data : 是你需要拆分的数组
	*obj : 是你拆分完过后的数据
	*注意*************************   使用这个 函数  必须运行的环境支持 es6语法   否则无效 *****************************
	*/
	extractSort({name, data}) {
	    var obj = []
	    for (var key of data) {
		var num = 0
		for (var item of obj) {
		    if (key[name] === item[name]) {
			item.list.push(key)
			num++
			break;
		    }
		}
		if (num === 0) {
		    obj.push({[name]: key[name], list: [key]})
		} 
	    }
	    console.log(obj)
	},
    /*吸顶轮子效果
    str 传选择器，最好是ID*/
    scroll: function (str) {
      var oDom = document.querySelector(str) || document.getElementById(str);
      var getAllTop = getAllTop(oDom);
      function getAllTop(oDom) {
        var strTop = oDom.offsetTop;
        while (oDom = oDom.offetParent) {
          strTop += oDom.offsetTop
        }
        return strTop
      }
      window.onscroll = function () {
        var scrollTop = document.documentElement.scrollTop;
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
      id          = id || '#backtotop';
      scrolltop   = scrolltop || 500;
      target      = target || 0;
      animatetime = animatetime || 1000;
      var oBack = document.querySelector(id) || document.getElementById(id);
      window.onscroll = function(){
        var scrollTop = document.documentElement.scrollTop;
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
        var start = document.documentElement.scrollTop;
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
          document.documentElement.scrollTop = CubicEaseInOut(frame, start, distance, frames);
        }, interval);

        function CubicEaseInOut(t,b,c,d){
          if ((t/=d/2) < 1) return c/2*t*t*t + b;
          return c/2*((t-=2)*t*t + 2) + b;
        }
      }
    },
    /*放大镜*/
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

    },

    ajax: function (obj) {
      var url = obj.url,
          data = obj.data,
          dataType = obj.dataType,
          type = obj.type,
          suc = obj.suc,
          xhr
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
      } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
      }
      if (type === 'POST') {
        xhr.open(type, url, true)
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(getStr(data))
      } else {
        xhr.open(type, url + "?" + getStr(data))
        xhr.send()
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == xhr.DONE) {
          if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            if (dataType === 'json') {
              if (typeof suc === 'function') {
                suc(JSON.parse(xhr.responseText))
              }
            }
          }
        }
      }
      function getStr(data) {
        var getStr =[]
        for (var k in data) {
          getStr.push(k + '=' + encodeURIComponent(data[k]))
        }
        return getStr.join('&')
      }
    },
    // input 只能数字输出，小数不能超过两位
    decimalMaxSecond: function(obj) {
      var objs = document.querySelector(obj);
      objs.onkeyup = function (e) {
        var that = this
        event = window.event || event;
        // 允许左右方向键移动
        if (event.keyCode == 37 || event.keyCode == 39) {
          return
        }
        that.value = that.value.replace(/[^\d.]/g, "")
          .replace(/^\./g, "")
          .replace(/\.{2,}/g, ".")
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".")
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
			// 限制文本的长度
          if (that.value.length > 5) {
            that.value = that.value.substring(0, that.value.length-1)
          }
      }
      objs.blur = function () {
        var that = this;
        that.value = that.value.replace(/\.$/g, "")
      }
  }
  }
  window.lsk = lsk
  lsk.author = 'lskword'
  lsk.version = '1.0.0'
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
/**
 * [BackToTop 返回顶部]
 * @param       {[type]} selector [元素对象id]
 * @param       {[type]} position [返回的位置]
 * @param       {[type]} delay    [延迟的时间]
 * @constructor
 */
function BackToTop(selector, position, delay) {
  this.dom = null;
  this.selector = selector;
  this.position = position || 0;
  this.delay = delay || 1000
  this.init();
  this.bindEvent();
  this.bindScrollEvent();
}
BackToTop.prototype.init = function() {
  this.dom = document.querySelector(this.selector) || document.getElementById(this.selector);
}
BackToTop.prototype.bindScrollEvent = function() {
  var self = this;
  window.onscroll = function(){
    var scrollTop = document.documentElement.scrollTop;
    if (scrollTop > 500) {
    self.dom.style.display = 'block';
    } else {
    self.dom.style.display = 'none';
    }
  }
}
BackToTop.prototype.bindEvent = function() {
  var self = this;
   this.dom.onclick = function() {
    scrollAnimate(self.position, self.delay);
  }

  function scrollAnimate(target, timer) {
    var interval = 20;
    var frame = 0;
    var frames = timer / interval;
    var start = document.documentElement.scrollTop;
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
/**
 * [Zoom 放大镜]
 * @param       {[type]} smallPicSelector [小图片元素]
 * @param       {[type]} bigPicSelector   [大图片元素]
 * @param       {[type]} zoomSelector     [放大镜元素]
 * @param       {[type]} bigImgPath       [需要放大图片位置]
 * @constructor
 */

function Zoom(smallPicSelector, bigPicSelector, zoomSelector, bigImgPath) {
  this.oSmallPic = document.querySelector(smallPicSelector);
  this.oBigPic = document.querySelector(bigPicSelector);
  this.oZoom = document.querySelector(zoomSelector);
  this.oBigPic.style.backgroundImage = 'url(' + bigImgPath + ')';
  this.oBigPic.style.backgroundRepeat = 'no-repeat';

  //大图800*800 大图盒子 400*400
  //小图盒子350*350 放大镜175*175
  //所以放大镜总行程是350-175 = 175,  大图的总行程 800 - 400 = 400
  // var rate = 400 / 175;//可以用这句话代替下面的四行，下面四行是更通用的代码
  this.bigPicWidth = parseFloat(this.fetchComputedStyle(this.oBigPic, 'width'));
  this.smallPicWidth = parseFloat(this.fetchComputedStyle(this.oSmallPic, 'width'));
  this.zoomWidth = parseFloat(this.fetchComputedStyle(this.oZoom, 'width'));
  this.rate = (800 - this.bigPicWidth) / (this.smallPicWidth - this.zoomWidth) ;
	this.bindMouseEvent();

  }
  Zoom.prototype.fetchComputedStyle = function (obj, property) {
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
  Zoom.prototype.getAllTop = function(obj) {
    var allTop = obj.offsetTop;
    var currentObj = obj;
    while (currentObj = currentObj.offsetParent) {
      allTop += currentObj.offsetTop;
    }
    return allTop;
  }
  Zoom.prototype.getAllLeft = function(obj) {
    var allLeft = obj.offsetLeft;
    var currentObj = obj;
    while(currentObj = currentObj.offsetParent) {
      allLeft += currentObj.offsetLeft;
    }
    return allLeft;
  }
  Zoom.prototype.bindMouseEvent = function(){
	 var self = this;
	this.oSmallPic.onmouseover = function() {
		self.oZoom.style.display = 'block';
		self.oBigPic.style.display = 'block';
	  }
	  this.oSmallPic.onmouseout = function () {
		self.oZoom.style.display = 'none';
		self.oBigPic.style.display = 'none';
	  }

	this.oSmallPic.onmousemove = function(event) {
		event = event || window.event;

		//event.offsetX不能用
		//因为onmousemove事件冒泡，鼠标碰到zoom这个放大镜时事件将往上传播
		//会触发oSmallPic的onmousemove事件。因此event.offsetX的坐标，以zoom左上角为准
		// var x = event.offsetX;
		// var y = event.offsetY;
		var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

		var x = event.clientX - (self.getAllLeft(self.oSmallPic) - scrollLeft) - self.oZoom.clientWidth / 2;
		var y = event.clientY - (self.getAllTop(self.oSmallPic) - scrollTop) - self.oZoom.clientHeight / 2;
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x > self.oSmallPic.clientWidth - self.oZoom.clientWidth) {
		  x = self.oSmallPic.clientWidth - self.oZoom.clientWidth;
		}
		if (y > self.oSmallPic.clientHeight - self.oZoom.clientHeight) {
		  y = self.oSmallPic.clientHeight - self.oZoom.clientHeight;
		}

		self.oZoom.style.top = y + 'px';
		self.oZoom.style.left = x + 'px';

		self.oBigPic.style.backgroundPosition = -x * self.rate + 'px ' + -y * self.rate + 'px';
	}
  }
/*面向对象选项卡
一定注意选项卡布局为
  eg：div#box
        div#tab_hd
          span元素
          ...
        div#tab_bd
          div元素
          ...
*/

function Tab(hdSelector, bdSelector) {
	this.oSpans = document.querySelector(hdSelector).getElementsByTagName('span');
	//得到body部分的所有div
	this.oDivs = document.querySelector(bdSelector).getElementsByTagName('div');
	this.bindEvent();
}
Tab.prototype.bindEvent = function() {
	//循环批量绑定事件
	var self = this;
	for (var i = 0; i < self.oSpans.length; i++) {
	  //IIFE将外部的i传递到内部的i
	  (function(i){
		//绑定鼠标移入事件
		self.oSpans[i].onmouseover = function () {
		  //排他模型，让所有的div隐藏，让当前对应的div显示
		  for (var j = 0; j < self.oDivs.length; j++) {
			self.oDivs[j].className = '';//将class属性的值设置为空
		  }
		  //当前的i对应的div显示
		  self.oDivs[i].className = 'current';
		  //把所有的span元素的class样式设置为空
		  for (j = 0; j < self.oSpans.length; j++) {
			self.oSpans[j].className = '';
		  }
		  //给最后一个span元素的 class名称设置为last
		  self.oSpans[self.oSpans.length - 1].className = 'last';
		  //给当前的span元素的类名 +是一个空格 current类名, 因为最后一个span默认有一个class为last, 添加后的为 last current。其他元素添加类名之后他的类名是 " current"
		  this.className += ' current'; //class的类名
		}
	  })(i);
	}
}

/*面向对象轮播图*/
function Carousel(selector) {
	this.index = 0;
	this.oRightBtn = document.querySelector(selector).querySelector('.carousel_rightBtn');
	this.oLeftBtn = document.querySelector(selector).querySelector('.carousel_leftBtn');
	this.oImagesLists = document.querySelector(selector).querySelector('.imagesList').getElementsByTagName('li');
	this.oCirclesLists = document.querySelector(selector).querySelector('.circles').getElementsByTagName('li');
	this.bindEvent();
}
Carousel.prototype.bindEvent = function() {
	var self = this;
	self.oRightBtn.onclick = function(){
	  self.index++;
	  if (self.index >= self.oImagesLists.length) {
		self.index = 0;
	  }
	  self.move();
	}
	self.oLeftBtn.onclick = function(){
	  self.index--;
	  if (self.index < 0) {
		self.index = self.oImagesLists.length-1;
	  }
	  self.move();
	}

	for (var i = 0; i < self.oCirclesLists.length; i++) {
	  (function(i){
		self.oCirclesLists[i].onmouseover = function() {
		  self.index = i;
		  self.move();
		}
	  })(i);
	}
}
Carousel.prototype.move = function() {
  for (var i = 0; i < this.oImagesLists.length; i++) {
    this.oImagesLists[i].className = '';
  }
  this.oImagesLists[this.index].className = 'current';

  for (var i = 0; i < this.oCirclesLists.length; i++) {
    this.oCirclesLists[i].className = '';
  }
  this.oCirclesLists[this.index].className = 'current';
}
// 图片上传  附带剪切 jcrop jq配合
/**
 * 图片剪切组件 2018-5-2 1.0
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
var imgCutFiled = function(obj) {
  var that = this;
  this.fileImg = obj.fileImg // 上传图片的input
  this.url = obj.url // 图片上传的地址
  this.fileImgShow = obj.fileImgShow // 显示图片的位置
  this.cutShow = obj.cutShow // 剪切图片的预览位置
  this.ImgName = this.fileImg.name //上传文件的名字
  this.ImgType = this.fileImg.type.replace("image/", '') //获取图片的类型（jpg/png/*）
  this.ImgSize = this.fileImg.size //上传图片的尺寸
  this.ImgBase64 = '' //初始化Base64地址储存容器
  this.upLoad = obj.upLoad //上传按钮
  this.upLoad.onclick = this.upLoadFile.bind(this) //间接点击事件
  this.success = obj.success //请求过后的函数
  this.JcropAspectRatio = obj.JcropAspectRatio || 1 //是否等比缩放
  this.JcropBoxWidth = obj.JcropBoxWidth || 500 //裁剪框默认宽度
  this.JcropBoxHeight = obj.JcropBoxHeight || 300 //裁剪框默认高度
  this.JcropMinSize = obj.JcropMinSize || [300, 300] //剪切最小尺寸
  this.JcropMaxSize = obj.JcropMaxSize || [400, 400] //剪切最小尺寸
  if (obj.ImgShow === null) {
    throw Error("ImgShow 缺少参数")
  }
  console.log(this.cutShow);
  this.ImgShow = obj.ImgShow
  this.init()
}
imgCutFiled.prototype = {
  init: function() {
    this.fileShow()
  },
  /**
   * 上传图片
   * @return {[type]} [description]
   */
  upLoadFile: function() {
    if (this.fileImg) {
      var formData = new FormData();
      formData.append("base64Str", this.ImgBase64)
      formData.append("name", this.ImgName)
      formData.append("type", "base64")
      $.ajax({
        url: this.url,
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function(res) {
          this.success(res)
        },
        error: function (res) {
          console.log(res);
        }
      })
    } else {
      alert("文件不能为空")
    }
  },
  /**
   * 图片剪切展示
   * @return {[type]} [description]
   */
  fileShow: function() {
    var that = this;
    var reader = new FileReader()
    reader.readAsDataURL(this.fileImg)
    reader.onload = function(e) {
      this.ImgBase64 = e.target.result.replace(/^data:image\/(jpg|png|jpeg);base64,/, "")
      var localimghtml = '<img id="cropbox" src="' + e.target.result + '" >';
      console.log($(that.fileImgShow));
      $(that.fileImgShow).html(localimghtml);
      that.initJcrop();
    }
  },
  /**
   * 剪切初始化
   * @return {[type]} [description]
   */
  initJcrop: function() {
    var that = this;
    $('#cropbox').Jcrop({
      onSelect: select,
      aspectRatio: that.JcropAspectRatio,
      boxWidth: that.JcropBoxWidth,
      boxHeight: that.JcropBoxHeight,
      minSize: that.JcropMinSize,
      maxSize: that.JcropMaxSize
    }, function() {
      //图片实际尺寸
      var bb = this.getBounds();
      var bWidth = Number(bb[0]);
      var bHeight = Number(bb[1]);
      this.setSelect([0, 0, bWidth, bHeight]);
      var ss = this.getWidgetSize();
      console.log(ss, bb)
      var imgdata = that.cutShow.toDataURL();
      that.ImgShow.src = imgdata;
    });
    function select(c) {
      var img = document.getElementById("cropbox"),
          ctx = that.cutShow.getContext("2d");
      $(that.cutShow).attr({
        width: c.w,
        height: c.h
      })
      // img,开始剪切的x,Y坐标宽高，放置图像的x,y坐标宽高。
      ctx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w, c.h);
      var imgdata = that.cutShow.toDataURL();
      that.ImgShow.src = imgdata;
    }
  }
}
