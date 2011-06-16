/*
 *	Copyright (c) QWrap
 *	version: $version$ $release$ released
 *	author:Jerry(������)��JK���ӿ�
 *  description: Anim�Ƽ�retouch....
*/

(function() {
	var NodeH = QW.NodeH,
		Anim = QW.Anim,
		g = NodeH.g,
		show = NodeH.show,
		hide = NodeH.hide,
		setStyle = NodeH.setStyle,
		dump = QW.ObjectH.dump,
		mix = QW.ObjectH.mix,
		rwrap = QW.HelperH.rwrap;
	
	function newAnim(el, opt, callback, dur, type) {
		el = g(el);
		var ElAnim = QW.ElAnim;
		switch (type) {
		case "color":
			ElAnim = QW.ColorAnim;
			break;
		case "scroll":
			ElAnim = QW.ScrollAnim;
			break;
		}
		var anim = new ElAnim(el, opt, dur || 800);
		if (callback) {
			anim.on("suspend", function() {
				callback();
			});
		}
		anim.play();
		return anim;
	}

	var AnimElH = { 
		/* ���� */
		fadeIn: function(el, dur, callback) {
			el = g(el);
			show(el);
			return newAnim(el, {
				"opacity": {
					from: 0,
					to: 1
				}
			}, callback, dur);
		},
		/* ���� */
		fadeOut: function(el, dur, callback) {
			el = g(el);
			return newAnim(el, {
				"opacity": {
					from: 1,
					to: 0
				}
			}, callback || function() {
				hide(el);
			}, dur);
		},
		/* ����/�����л� */
		fadeToggle: function(el, dur) {
			AnimElH[el.offsetHeight ? 'fadeOut' : 'fadeIn'](el, dur);
		},
		/* ���� */
		slideUp: function(el, dur, callback) {
			el = g(el);
			show(el);
			setStyle(el, "height", "auto");
			return newAnim(el, {
				"height": {
					from: el.offsetHeight,
					to: 0
				}
			}, callback || function() {
				hide(el);
			}, dur);
		},
		/* չ�� */
		slideDown: function(el, dur, callback) {
			el = g(el);
			show(el);
			setStyle(el, "height", "auto");
			var height = el.offsetHeight;
			setStyle(el, "height", "0");
			return newAnim(el, {
				"height": {
					from: 0,
					to: height
				}
			}, callback, dur);
		},
		/* ����/չ���л� */
		slideToggle: function(el, dur) {
			el = g(el);
			AnimElH[el.offsetHeight ? 'slideUp' : 'slideDown'](el, dur);
		},
		/* ��ɫ��������ע�� */
		shine4Error: function(el, dur, callback) {
			return newAnim(el, {
				"backgroundColor": {
					from: "#f33",
					to: "#fff",
					end: ""
				}
			}, callback, dur, "color");
		}
	};

	NodeW.pluginHelper(AnimElH, 'operator');
	
	mix(QW.Dom, AnimElH);
}());