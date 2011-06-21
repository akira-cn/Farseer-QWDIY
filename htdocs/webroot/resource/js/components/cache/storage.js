/*
 *	Copyright (c) 2010, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: quguangyu@baidu.com
*/

/**
 * @class Storage Storage类
 * @namespace QW
 */
 (function() { 
	var Dom = QW.Dom,
		mix = QW.ObjectH.mix,
		extend = QW.ClassH.extend,
		$ = Dom.g;

	var BaseStorage = function(){};
	BaseStorage.prototype = (function(){
		return {
			test : function(){
				return true;
			},
			init : function(){
			},
			set : function(key, value){
			},
			get : function(key, callback){
				callback && callback("");
			},
			remove : function(key){
			}
		};
	})();

	var FlashStorage = extend(function(){}, BaseStorage);
	mix(FlashStorage.prototype, (function() {
		var flashId = "_Flash_Storage_";

		var insertFlash = function(path){
			var container = document.createElement("div"), html = [];
			if(QW.Browser.ie){
				html.push('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"',
					'codebase="http://download.macromedia.com/pub/shockwave/cabs',
					'/flash/swflash.cab#version=10,0,0,0" width="1" height="1" id="',flashId,'">',
					'<param name="allowScriptAccess" value="always" />',
					'<param name="movie" value="',path,'" /></object>');
			}else{
				html.push('<embed src="',path,'" width="1" height="1" id="',flashId,'" ',
					'align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" ',
					'pluginspage="http://www.adobe.com/go/getflashplayer_cn"/>');
			}
			var style = container.style;
			style.position = "absolute";
			style.top = "-9999px";
			style.top = "-9999px";
			var body = document.body;
			body.insertBefore(container, body.firstChild );
			container.innerHTML = html.join("");
			document.title=document.title.split("#")[0];
		};

		var periodicalExecuter = function(timerEvent,callback){
			callback = callback || function(){};
			var timer = setInterval(function(){
				try{
					var ret = timerEvent();
					clearInterval(timer);
					timer = null;
					callback(ret);
				}catch(e){}
			},50);
			setTimeout(function(){
				if(!timer) return;
				clearInterval(timer);
				callback("");
			},5000);
		};

		return {
			test : function(){
				var f = "-1", n = navigator;
				if(n.plugins && n.plugins.length) {
					for (var ii = 0; ii < n.plugins.length; ii++) {
						if (n.plugins[ii].name.indexOf("Shockwave Flash") != -1) {
							f = n.plugins[ii].description.split("Shockwave Flash")[1];
							break;
						}
					}
				}else if (window.ActiveXObject) {
					for (var ii = 10; ii >= 2; ii--) {
					  try{
						if(new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + ii)){
							f = parseInt(ii);
							break;
						}
					  }catch(ex){}
					}
				}
				return parseInt(f) > 7;
			},
			init : function(){
				this.path = "http://co.youa.baidu.com/picture/r/mall/js/cache.swf";
				try {
					if (external.max_language_id != undefined){  
						this.path += "?random=" + Math.random();
					}
				}catch (e){}
				var path = this.path;
				Dom.ready(function(){
					insertFlash(path);
				});
			},
			set : function(key, value){
				periodicalExecuter(function(){
					$(flashId).set(key,value);
				});
			},
			get : function(key, callback){
				periodicalExecuter(function(){
					return $(flashId).get(key);
				},function(ret){
					if(callback) {
						callback.call(this, ret);
					}
					return ret;
				});
			},
			remove : function(key){
				periodicalExecuter(function(){
					$(flashId).remove(key);
				});
			}
		};
	})(), true);
	
	var LocalStorage = extend(function(){}, BaseStorage);
	mix(LocalStorage.prototype, (function() {
		return {
			test : function(){
				return !!window.localStorage;
			},
			init : function(){
				this.store = localStorage;
			},
			set : function(key, value){
				this.store.setItem(key, value);
			},
			get : function(key, callback){
				var val = this.store.getItem(key) || "";
				if (callback) {
					callback.call(this, val);
				}
				return val;
			},
			remove : function(key){
				this.store.removeItem(key);
			}
		};
	})(), true);

	function Storage(){
		var list = arguments.length>0?Array.toArray(arguments):["localStorage","flash"];
		list.push("none");
		var instance = null;
		for(var i = 0; i < list.length; i++) {
			switch(list[i]){
				case "localStorage":
					instance = LocalStorage;
					break;
				case "flash":
					instance = FlashStorage;
					break;
				default:
					instance = BaseStorage;
			}
			instance = new instance();
			if(instance.test()){
				instance.init();
				instance.storageType = list[i];
				break;
			}
		}
		return instance;
	};

	mix(Storage, (function() {
		var storage = new Storage();
		return {
			storageType : storage.storageType,

			set : function(key, value) {
				storage.set(key, value);
			},

			get : function(key, callback) {
				return storage.get(key, callback);
			},

			remove : function(key) {
				storage.remove(key);
			}
		}
	})());

	window.Storage = Storage;
 })();