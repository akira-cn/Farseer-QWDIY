(function() {
	var CustEvent = QW.CustEvent,
		mix = QW.ObjectH.mix;

	var Anim = function(action, dur, opts) {
		mix(this, opts);
		mix(this, {
			action: action,	//action，动画函数，
			dur: dur||800,	//动画时长
			_timeStamp: new Date()
		});
		CustEvent.createEvents(this, ANIM_EVENTS);
	};
	
	ANIM_EVENTS = ['beforestart','enterframe','pause','resume','end','reset'];

	function _request(anim, per){
		if(per == null) per = anim.per;
		anim.action(per);
		anim._timeStamp = new Date() - per * anim.dur; //从当前帧反算startTime
		anim.per = per;
	}

	function _cancel(anim){
		if(anim._requestID){
			window.cancelRequestAnimationFrame(anim._requestID);
			anim._requestID = 0;
		}		
	}

	function _play(anim, begin, end){
		if(!anim._requestID){
			if(null == begin) begin = 0;
			if(null == end) end = 1;
			
			var animate = function(time){
				var per = Math.min(1.0, (time - anim._timeStamp) / anim.dur);
				_request(anim, per);
				anim.fire('enterframe');
				if(per >= end){
					_cancel(anim);
					anim.fire('end');
				}else{	
					anim._requestID = window.requestAnimationFrame(animate);
				}
			};

			_request(anim, begin);
			anim._requestID = window.requestAnimationFrame(animate);	
		}
	}

	mix(Anim.prototype, {
		start : function(){
			_cancel(this);
			this.fire('beforestart');
			_play(this);
			return true;
		},
		reset : function(){
			_cancel(this);
			_request(this, 0);
			this.fire('reset');
			return true;
		},
		pause : function(){
			if(this._requestID){
				_cancel(this);
				this.fire('pause');
				return true;
			}
			return false;
		},
		resume : function(){
			if(!this._requestID && this.per){
				this.fire('resume');
				_play(this, this.per);
				return true;
			}
			return false;
		},
		cancel : function(){ //手工结束动画，会触发end事件
			if(this._requestID){
				_cancel(this);
				_play(this, 1);
				return true;
			}
			return false;
		}
	});

	QW.provide('Anim', Anim);
})();