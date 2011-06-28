(function() {
	var CustEvent = QW.CustEvent,
		mix = QW.ObjectH.mix;
	
	var millisec = 50; //定时器每50ms触发一次

	/*
		指定时间之后执行某个动作，当中可以cancel
	*/
	function Timing(dur, action){ 
		this.dur = dur || 300; //默认300ms
		this.action = action;
		this.startTime = 0;
		this.cancelTime = 0;
		this.successTime = 0;

		CustEvent.createEvents(this, TIMING_EVENTS);
	}
	
	var TIMING_EVENTS = ["beforestart","succeed","cancelled","waiting"];

	function _start(timing){
		if(timing._timerId) return false; //已经开始了，不能重复开始

		timing.fire("beforestart");

		var startTime = new Date();  //开始执行的时间

		var _timer = function(now){
			var per = Math.min(1.0, (now - startTime)/timing.dur);
			
			if(per >= 1.0){ //等待结束，执行action
				timing.successTime = new Date();
				if(timing.action) timing.action();
				timing.fire("succeed");
				clearInterval(timing._timerId);
				delete timing._timerId;
			}else{ //继续执行
				timing.fire("waiting");
			}
		}

		timing.startTime = startTime;
		timing.cancelTime = 0;
		timing.successTime = 0;
		
		timing._timerId = setInterval(
			function(){
				_timer(new Date());
			}, millisec);

		return true;
	}

	function _cancel(timing){
		if(!timing._timerId) return false;
		
		clearInterval(timing._timerId);
		delete timing._timerId;		//清除掉timerId
		timing.cancelTime = new Date();
		timing.fire("cancelled");

		return true;
	}


	mix(Timing.prototype, {
		start: function(){
			return _start(this);
		},
		cancel: function(){
			return _cancel(this);
		}
	});

	QW.provide("Timing", Timing);
})();