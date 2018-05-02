/**
 * Created by star on 2017/3/7.
 */
var $ = require('jquery');
/**
 * 预览类
 * @constructor
 */
function Preview() {
 this.boxElem = null;
 this.callback = null;
 this.type = null;
}
/**
 * 入口
 * @param boxElem 操作区域
 * @param callback 预览结束的回调函数
 */
Preview.prototype.start = function (boxElem,callback) {
 var chooseFile,me;
 me = this;
 if(! boxElem || boxElem.length <= 0) return this;
 this.boxElem = boxElem;
 if(typeof callback === 'function'){
  this.callback = callback;
 }
 if(this.__isSupport()){
  chooseFile = boxElem.find('input[type="file"]');
  chooseFile
   .on('change',me.fileChange.bind(me))
 }
};
/**
 * 选择图片的事件处理程序
 * @param event
 */
Preview.prototype.fileChange = function (event) {
 var target,reader,file,me,type;
 target = event.target;
 me = this;
 file = target.files[0];
 type = file.type;
 this.type = type;
 if(type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg'){
  alert('文件格式不正确');
  return this;
 }
 reader = new FileReader();
 if(file){
  reader.readAsDataURL(file);
 }
 reader.onload = function () {
  me.show(reader);
 }
};
/**
 * 显示从本地选择的图片
 * @param reader fileReader对象
 */
Preview.prototype.show = function (reader) {
 var preView,img,me;
 preView = this.boxElem.find('#preview');
 img = preView.find('#preImg');
 me = this;
 if(img.length <= 0){
  preView.append($('<img id="preImg">'));
 }
 img = preView.find('#preImg');
 //确保图片加载完成后再执行回调
 img.on('load',function () {
  if(me.callback){
   me.callback(me.type);
  }
 });
 img.attr('src',reader.result);
};
/**
 * 是否支持预览
 * @returns {boolean}
 * @private
 */
Preview.prototype.__isSupport = function () {
 return typeof FileReader === 'function';
};
var preview = new Preview();
module.exports = preview;
