(function() {
	var Ajax = QW.Ajax;
	describe('Ajax', {
		'get': function() {
			value_of(Ajax).should_have_method('get').line;
			Ajax.get('php.js', function() {
				var ajax=this;
				describe('get-async', {
					'get result': function() {
						value_of(ajax.requester.responseText.indexOf('PhpJsData')).should('>',0);
						QW.StringH.evalJs(ajax.requester.responseText);
						value_of(window.AjaxPhpJsData).should_be('PhpJsData');
					}
				});
			});
		},
		/*'post': function() {
			value_of(Ajax).should_have_method('post').line;
			Ajax.post('php.js', function() {
				var ajax=this;
				describe('post-async', {
					'post result': function() {
						value_of(ajax.requester.responseText.indexOf('PhpJsData')).should('>',0);
						QW.StringH.evalJs(ajax.requester.responseText);
						value_of(window.AjaxPhpJsData).should_be('PhpJsData');
					}
				});
			});
		},//nginx server not allowed*/
		'request': function() {
			delete window.AjaxPhpJsData;
			var ajax=Ajax.request({
				url: 'php.js',
				async: false
			});
			
			value_of(ajax.requester.responseText.indexOf('PhpJsData')).should('>',0);
			QW.StringH.evalJs(ajax.requester.responseText);
			value_of(window.AjaxPhpJsData).should_be('PhpJsData');
		}
	});
}());