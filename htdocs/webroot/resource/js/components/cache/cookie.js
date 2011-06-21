/*
 *	Copyright (c) 2010, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: quguangyu@baidu.com
*/

/**
 * @class Cookie Cookie类
 * @namespace QW
 * @cfg {string} path 
 * @cfg {string} domain 
 * @cfg {number} expires 
 * @cfg {string} secure 
 */

(function() {
	function Cookie(){
		return this.init.apply(this,arguments);
	}

	Cookie.prototype = (function(){
		return{
			/**
			 * 初始化
			 *
			 * @method init
			 * @public
			 * @param {options}  配置
			 * @return void
			 */
			init:function(opt){
				opt = opt || {};
				this.path	 = opt.path || "/";
				this.domain	 = opt.domain || "";
				this.expires = opt.expires || 1000 * 60 * 60 * 24 * 365;
				this.secure	 = opt.secure || "";
			},
			/**
			 * 存储
			 * @method set
			 * @public
			 * @param {string} key
			 * @param {string} value
			 * @return void
			 */
			set:function(key, value){
				var now = new Date();
				if(typeof(this.expires)=="number"){
					now.setTime(now.getTime() + this.expires);
				}
				
				document.cookie =
					key + "="+ escape(value)
					+ ";expires=" + now.toGMTString()
					+ ";path="+ this.path
					+ (this.domain == "" ? "" : ("; domain=" + this.domain))
					+ (this.secure ? "; secure" : "");
			},
			/**
			 * 读取
			 * @method get
			 * @public
			 * @param {string} key
			 * @return string
			 */
			get:function(key){
				var a, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");

				if(a = document.cookie.match(reg)){
					return unescape(a[2]);
				}else{
					return "";
				}
			},
			/**
			 * 移除
			 * @method remove
			 * @public
			 * @param {string} key
			 * @return void
			 */
			remove:function(key){
			  var old=this.expires;
			  this.expires = -1 * 1000 * 60 * 60 * 24 * 365;
			  this.set(key,"expired");
			  this.expires=old;
			}
		};
	})();


	/**
	 * 存储
	 * @method set
	 * @static
	 * @param {string} key
	 * @param {string} value
	 * @param {object} option
	 * @return void
	 */
	Cookie.set=function(key,value,option){
		var cookie = new Cookie(option); 
		cookie.set(key,value);
	};

	/**
	 * 读取
	 * @method get
	 * @static
	 * @param {string} key
	 * @param {object} option
	 * @return string
	 */
	Cookie.get=function(key,option){
		var cookie = new Cookie(option);
		var ret = cookie.get(key);
		return ret;
	};

	/**
	 * 移除
	 * @method set
	 * @static
	 * @param {string} key
	 * @param {object} option
	 * @return void
	 */
	Cookie.remove=function(key,option){
		var cookie = new Cookie(option);
		cookie.remove(key);
	};

	QW.provide('Cookie', Cookie);
})();