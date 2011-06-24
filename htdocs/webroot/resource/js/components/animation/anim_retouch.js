(function() {
	var QW = window.QW, 
		mix = QW.ObjectH.mix, 
		HH = QW.HelperH, 
		W = QW.W,
		Dom = QW.Dom,
		Anim = QW.ElAnim;

	var AnimElH = (function(){
		return {
			fadeIn : function(el, dur, callback) {
				var anim = new Anim(el, {		
					"opacity" : {
						from  : 0,
						to    : 1
					}
				}, dur);
				
				W(el).show();
				if(callback) anim.on("end", callback);
				anim.start();
			},
			fadeOut : function(el, dur, callback) {
				var anim = new Anim(el, {
					"opacity" : {
						from  : 1,
						to    : 0
					}
				}, dur);

				anim.on("end", function(){
					W(el).hide(); 
				});
				if(callback) anim.on("end", callback);
				anim.start();
			},
			/* 淡入/淡出切换 */
			fadeToggle: function(el, dur, callback) {
				AnimElH[el.offsetHeight ? 'fadeOut' : 'fadeIn'](el, dur, callback);
			},
			slideUp : function(el, dur, callback) {
				var anim = new Anim(el, {
					"height" : {
						to  : 0
					}
				}, dur);

				anim.on("end", function(){
						W(el).hide();
				});
				if(callback) anim.on("end", callback);
				anim.start();
			},
			slideDown : function(el, dur, callback) {
				el = W(el);
				el.show();
				el.setStyle("height", "");
				var height = el.getCurrentStyle("height");
				el.setStyle("height","0");

				var anim = new Anim(el, {
					"height" : {
						from : 0,
						to : height
					}
				}, dur);

				if(callback) anim.on("end", callback);
				anim.start();
			},
			shine4Error : function(el, dur, callback) {
				var anim = new Anim(el, {
					"backgroundColor" : {
						from : "#f33",
						to	 : "#fff"
					}
				}, dur);

				anim.on("end", function(){
					W(el).setStyle("backgroundColor", "");
				});
				if(callback) anim.on("end", callback);
				anim.start();
			}
		};
	})();


	QW.NodeW.pluginHelper(AnimElH, 'operator');
	if (QW.Dom) {
		QW.ObjectH.mix(QW.Dom, AnimElH);
	}
})();