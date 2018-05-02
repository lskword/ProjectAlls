var $ = require('jquery');
var ajax = require('./ajax.js');
var preview = require('./preview.js');
var shear = require('./shear.js');
/**
 * 自定义头像
 * @constructor
 */
function CustomerImg() {
 this.isSupport = null;
 this.previewBox = null;
 this.warp = null;
}
/**
 * 入口
 * @param warp 操作区域 jquery节点
 */
CustomerImg.prototype.start = function (warp) {
 var info,me,warpBox;
 me = this;
 this.isSupport = this.__isSupport();
 if(!this.isSupport) {
  info = $('<p>你的浏览器不支持自定义头像，可更换高版本的浏览器自定义头像</p>');
  $('body').html(info);
  return this;
 }
 //判断操作区域示范存在
 if(warp && warp.length > 0){
  this.warp = warp;
 }else{
  return this;
 }
 //预览
 preview.start(warp,shear.start.bind(shear,warp));
 this.previewBox = warp.find('#preview');
 //确定
 warp
  .find('#submit')
  .unbind('click')
  .on('click',me.__submit.bind(me));
};
/**
 * 提交
 * @private
 */
CustomerImg.prototype.__submit = function () {
 var cvsMove,data,fd;
 cvsMove = this.previewBox.find('#cvsMove');
 data = cvsMove[0].toDataURL('image/jpg',1);
 fd = {
  'customerImg':data
 };
 ajax.upload(fd);
};
/**
 * 判断是否支持自定义头像
 * @returns {boolean}
 * @private
 */
CustomerImg.prototype.__isSupport = function () {
 var canvas,context;
 canvas= document.createElement('canvas');
 if(typeof FileReader === 'function'&& canvas.getContext && canvas.toDataURL){
  return true;
 }else{
  return false;
 }
};
var customerImg = new CustomerImg();
module.exports = customerImg;
