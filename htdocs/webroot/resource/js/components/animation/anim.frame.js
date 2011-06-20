/*
 *	http://qwrap.com
 *	version: $version$ $release$ released
 *	author: akira.cn@gmail.com
 */

/**
 * @helper AnimationTimingH 动画Helper
 * @namespace QW
 * @support http://www.w3.org/TR/animation-timing/
 */

(function(){

var mix = QW.ObjectH.mix,
	EventTargetH = QW.EventTargetH,
	forEach = Array.forEach || QW.ArrayH.forEach;

var requestAnimationFrame = window.requestAnimationFrame,
	cancelRequestAnimationFrame = window.cancelRequestAnimationFrame;

var handlers = [];

function getAnimationFrame(){
	if(requestAnimationFrame){
		return {
			request :requestAnimationFrame,
			cancel : cancelRequestAnimationFrame
		}
	}else if(window.webkitRequestAnimationFrame){
		return {
			request : window.webkitRequestAnimationFrame,
			cancel : window.webkitCancelRequestAnimationFrame
		}
	}else if(window.mozRequestAnimationFrame){
		return {
			request : function(callback){
				if(false !== callback.__cancelled__){
					callback.__cancelled__ = false;
					var _step = function(evt){
						return callback(evt.timeStamp);
					}
					_step.handler = callback;
					handlers.push(_step);
					EventTargetH.addEventListener(window, "MozBeforePaint", _step);
				}
				window.mozRequestAnimationFrame();
				return handlers.length;
			},
			cancel : function(id){
				var _step = handlers[id-1];
				handlers[id] = "cancelled";
				_step.handler.__cancelled__ = true;
				EventTargetH.removeEventListener(window, "MozBeforePaint", _step);
			}
		}
	}else{
		return AnimationTimingManager;
	}
};

if(!(window.requestAnimationFrame || 
	 window.webkitRequestAnimationFrame ||
	 window.mozRequestAnimationFrame))
{
	var AnimationTimingManager = (function(){
		var millisec = 25;	 //40fps;
		var request_handlers = [];
		var id = 0, cursor = 0;

		function playAll(){
			var clone_request_handlers = request_handlers.slice(0);
			cursor += request_handlers.length;
			request_handlers.length = 0; //clear handlers;
			
			forEach(clone_request_handlers, function(o){
				if(o != "cancelled")
					return o(new Date());
			});
		}

		var interval = window.setInterval(playAll, millisec);

		return {
			request : function(handler){
				request_handlers.push(handler);
				//return request_handlers.length;
				return id++;
			},
			cancel : function(id){
				request_handlers[id-cursor] = "cancelled";
			}
		};
	
	})();
}

var AnimationTimingH = {
	/*long*/ requestAnimationFrame : function(/*window*/ owner, /*in FrameRequestCallback*/ callback){
		var raf = getAnimationFrame();
		return raf.request.call(owner, callback);
	},
	cancelRequestAnimationFrame : function(/*window*/ owner, /*in long*/ handle){
		var raf = getAnimationFrame();
		return raf.cancel.call(owner, handle);
	}
};

var ah = QW.HelperH.methodize(AnimationTimingH);
mix(window, ah);
})();