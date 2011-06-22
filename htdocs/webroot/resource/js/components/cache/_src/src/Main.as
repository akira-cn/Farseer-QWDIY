﻿package 
{
	import flash.display.Sprite;
	import flash.events.*;
	import flash.net.SharedObject;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.system.Security;
	import flash.external.ExternalInterface;
	 
	public class Main extends Sprite {
		
		Security.allowDomain("*");
		
		private const storageName:String = "flash_storage_key";
		private const whitelistName:String = "storage-whitelist.xml";

		public function Main():void {
			loadWhitelist();
		}
		
		private function showError(event:* = ''):void {
			ExternalInterface.call("function(){alert('flashstorage错误：本域不在白名单，或白名单未配置！');}");
		}
		
		private function loadWhitelist():void {
			var urlLoader:URLLoader = new URLLoader();
            urlLoader.addEventListener(IOErrorEvent.IO_ERROR, showError);
            urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, showError);
			urlLoader.addEventListener(Event.COMPLETE, function (event:Event):void {
				try{
					var contentXML:XML = new XML(event.target.data);
					var pageDomain:String = ExternalInterface.call("function(){return location.hostname;}");
					var urls:XMLList = contentXML["allow-access-from"];
					//trace(urls);
					var valid:Boolean = false;
					
					var item:XML;
					for each(item in urls) {
						//trace(item, pageDomain);
						var url:String = item.@url;
						if (pageDomain.indexOf(url) > -1) {
							valid = true;
							break;
						}
					}
					
					if (valid) {
						addExternalInterface();
					} else {
						showError();
					}
				} catch (err:TypeError) {
					showError();
				}
			});
			
			var currentUrl:String = loaderInfo.url;
			if (currentUrl.charAt(currentUrl.length - 1) == '/') {
				currentUrl = currentUrl.slice(0. -1);
			}
			
			var whitelistUrl:String = currentUrl.slice(0, currentUrl.lastIndexOf('/')) + '/' + this.whitelistName;
			urlLoader.load(new URLRequest(whitelistUrl));
		}
		
		private function addExternalInterface():void {
			ExternalInterface.addCallback("set", set);
			ExternalInterface.addCallback("get", get);
			ExternalInterface.addCallback("remove", remove);
			
			ExternalInterface.call("flashReadyHandler");
		}
		
		private function set(key:String, val:String = ""):void {
			var sobj:SharedObject = SharedObject.getLocal(storageName, "/", false);
			sobj.data[key] = val;
			sobj.flush();
		}
		
		private function get(key:String):String{
			var sobj:SharedObject = SharedObject.getLocal(storageName, "/", false);
			return(sobj.data[key] || "");
		}

		private function remove(key:String):void{
			var sobj:SharedObject = SharedObject.getLocal(storageName, "/", false);
			delete sobj.data[key];
			sobj.flush();
		}
		
	}
	
}