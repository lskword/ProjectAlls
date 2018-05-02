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
