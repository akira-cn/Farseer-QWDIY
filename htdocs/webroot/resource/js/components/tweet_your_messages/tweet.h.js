/*
 * @fileoverview send events like twitter
 * @author　Akira
 * @version $version
 */
(function(){

	var EventTarget = QW.CustEventTarget,
		mix = QW.ObjectH.mix,
		g = QW.Dom.g;

	var eventTarget = CustEvent.createEvents({},[]);
	//var timeout = 200; //default timeout
	var receiveMap = {};
	
	eventTarget.on("*", function(evt){
		var type = evt.type;
		var sender = evt.sender;
		var receiveList = receiveMap[type] || [];

		for (var i = 0, len = receiveList.length; i < len; i++){
			var r = receiveList[i];
			mix(evt, {target:r.receiver}, true);
			r.callback.call(r.receiver, evt);
		}
	});

	var TweetH = {
		tweet : function(el, type, data){
			data = data || {};
			el = g(el);
			eventTarget.createEvents([type]);	//如果有需要，创建对应类型的事件
			setTimeout(
				function(){
					eventTarget.fire(type, mix(data, {sender:el}));
				}
			);
		},
		receive : function(el, type, callback){
			el = g(el);
			var list = receiveMap[type] = receiveMap[type] || []; //创建对应事件的hash表
			list.push({receiver:el, callback:callback}); //将接收者存入列表
		}
	}

	QW.TweetH = TweetH;
})();