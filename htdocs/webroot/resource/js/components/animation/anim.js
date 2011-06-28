(function() {
	var els = document.getElementsByTagName('script'),
		srcPath = '';
	for (var i = 0; i < els.length; i++) {
		var src = els[i].src.split(/[\\\/]components[\\\/]/g);
		if (src[1]) {
			srcPath = src[0] + '/';
			break;
		}
	}
	document.write(
		  '<script type="text/javascript" src="'+srcPath+'components/animation/anim.frame.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/animation/anim.base.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/animation/anim.el.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/animation/anim.easing.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/animation/anim_retouch.js"></script>'
	);
}());