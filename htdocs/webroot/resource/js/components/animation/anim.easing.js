/*
 *	Copyright (c) 2009, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: quguangyu@baidu.com
*/

 (function() {
	var Easing  = {
		
		easeNone: function(p,d) {
			return d*p;
		},
		easeIn: function(p,d) {
			return d*p*p;
		},
		easeOut: function(p,d) {
			return -d*p*(p-2);
		},
		easeBoth: function(p,d) {
			if((p/=0.5)<1)return d/2*p*p;
			return -d/2*((--p)*(p-2)-1);
		},
		easeInStrong: function(p,d) {
			return d*p*p*p*p;
		},
		easeOutStrong: function(p,d) {
			return -d*((p-=1)*p*p*p-1);
		},
		easeBothStrong: function(p,d) {
			if((p/=0.5)<1)return d/2*p*p*p*p;
			return -d/2*((p-=2)*p*p*p-2);
		},
		elasticIn: function(p,d) {
			if(p==0)return 0;
			if(p==1)return d;
			var x=d*.3,y=d,z=x/4;
			return -(y*Math.pow(2,10*(p-=1))*Math.sin((p*d-z)*(2*Math.PI)/x));
		},
		elasticOut: function(p,d) {
			if(p==0)return 0;
			if(p==1)return d;
			var x=d*.3,y=d,z=x/4;
			return y*Math.pow(2,-10*p)*Math.sin((p*d-z)*(2*Math.PI)/x)+d;
		},
		elasticBoth: function(p,d) {
			if(p==0)return 0;
			if ((p/=0.5)==2)return d;
			var x=.3*1.5,y=d,z=x/4;
			if(p<1)return -.5*(y*Math.pow(2,10*(p-=1))*Math.sin((p-z)*(2*Math.PI)/x));
			return y*Math.pow(2,-10*(p-=1))*Math.sin((p-z)*(2*Math.PI)/x )*.5+d;
		},
		backIn: function(p,d) {
			var s=1.70158;
			return d*p*p*((s+1)*p-s);
		},
		backOut: function(p,d) {
			var s=1.70158;
			return d*((p=p-1)*p*((s+1)*p+s)+1);
		},
		backBoth: function(p,d) {
			var s=1.70158;
			if((p/=0.5)<1)return d/2*(p*p*(((s*=(1.525))+1)*p-s));
			return d/2*((p-=2)*p*(((s*=(1.525))+1)*p+s)+2);
		},
		bounceIn: function(p,d) {
			return d-Easing.bounceOut(1-p,d);
		},
		bounceOut: function(p,d) {
			if(p<(1/2.75)) {
				return d*(7.5625*p*p);
			}else if(p<(2/2.75)) {
				return d*(7.5625*(p-=(1.5/2.75))*p + .75);
			}else if(p<(2.5/2.75)) {
				return d*(7.5625*(p-=(2.25/2.75))*p + .9375);
			}
			return d*(7.5625*(p-=(2.625/2.75))*p + .984375);
		},
		bounceBoth: function(p,d) {
			if(p<0.5)return Anim.Easing.bounceIn(p*2,d)*.5;
			return Easing.bounceOut(p*2-1,d)*.5 + d*.5;
		}
	};

	QW.ElAnim.Easing = Easing;
 })();