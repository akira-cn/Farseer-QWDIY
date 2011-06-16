//	document.write('<script type="text/javascript" src="' + srcPath + 'wagang/ajax/ajax.js"></script>');

/*
 * @fileoverview Encapsulates common operations of Ajax
 * @author��JK ,���󲿷ִ�������BBLib/util/BBAjax(1.0��),������Ϊ��Miller����л
 * @version 0.1
 * @create-date : 2009-02-20
 * @last-modified : 2009-02-20
 */


(function() {
	var mix = QW.ObjectH.mix,
		encodeURIJson = QW.ObjectH.encodeURIJson,
		encodeURIForm = QW.NodeH.encodeURIForm,
		CustEvent = QW.CustEvent;

	/**
	* @class Ajax Ajax��Ĺ��캯��
	* @param {json} options �������
		*----------------------------------------------------------------------------------------
		*| options����		|		˵��					|	Ĭ��ֵ							|
		*----------------------------------------------------------------------------------------
		*| url: 			|	�����·��					|	���ַ���						|
		*| method: 			|	����ķ���					|	get								|
		*| async: 			|	�Ƿ��첽����				|	true							|
		*| user:			|	�û���						|	���ַ���						|
		*| pwd:				|	����						|	���ַ���						|
		*| requestHeaders:	|	����ͷ����					|	{}								|
		*| data:			|	���͵�����					|	���ַ���						|
		*| useLock:			|	�Ƿ�ʹ��������				|	0								|
		*| timeout:			|	��������ʱ��ʱ�䣨ms��	|	30000							|
		*| onsucceed:		|	����ɹ���� (�ɹ�ָ��200-300�Լ�304)							|
		*| onerror:			|	����ʧ�ܼ��													|
		*| oncancel:		|	����ȡ�����													|
		*| oncomplete:		|	���������� (success��error����complete)						|
		*----------------------------------------------------------------------------------------
	* @return {Ajax} 
	*/

	function Ajax(options) {
		this.options = options;
		this._initialize();
	}

	mix(Ajax, {
		/*
		 * ����״̬
		 */
		STATE_INIT: 0,
		STATE_REQUEST: 1,
		STATE_SUCCESS: 2,
		STATE_ERROR: 3,
		STATE_TIMEOUT: 4,
		STATE_CANCEL: 5,
		/** 
		 * defaultHeaders: Ĭ�ϵ�requestHeader��Ϣ
		 */
		defaultHeaders: {
			'Content-type': 'application/x-www-form-urlencoded UTF-8', //�������
			'com-info-1': 'QW' //������Ӧ���йص�header��Ϣ
		},
		/** 
		 * EVENTS: Ajax��CustEvents��'succeed','error','cancel','complete'
		 */
		EVENTS: ['succeed', 'error', 'cancel', 'complete'],
		/**
		 *XHRVersions: IE��XMLHttpRequest�İ汾
		 */
		XHRVersions: ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'Msxml2.XMLHTTP', 'MSXML.XMLHttp', 'Microsoft.XMLHTTP'],
		/* 
		 * getXHR(): �õ�һ��XMLHttpRequest����
		 * @returns {XMLHttpRequest} : ����һ��XMLHttpRequest����
		 */
		getXHR: function() {
			var versions = Ajax.XHRVersions;
			if (window.ActiveXObject) {
				while (versions.length > 0) {
					try {
						return new ActiveXObject(versions[0]);
					} catch (ex) {
						versions.shift();
					}
				}
			} else if (window.XMLHttpRequest) {
				return new XMLHttpRequest();
			}
			return null;
		},
		/**
		 * ��̬request����
		 * @method request
		 * @static
		 * @param {String|Form} url ����ĵ�ַ����Ҳ������Json����ΪJsonʱ����ֻ�д˲�����Ч���ᵱ��Ajax�Ĺ����������
		 * @param {String|Json|Form} data (Optional)���͵�����
		 * @param {Function} callback ������ɺ�Ļص�
		 * @param {String} method (Optional) ����ʽ��get��post
		 * @returns {Ajax}
		 * @example 
			QW.Ajax.get('http://demo.com',{key: 'value'},function(data){});
		 */
		request: function(url, data, callback, method) {
			if (url.constructor == Object) {
				var a = new Ajax(url);
			} else {
				if (typeof data == 'function') {
					method = callback;
					callback = data;
					if (url && url.tagName == 'FORM') {
						method = method || url.method;
						data = url;
						url = url.action;
					} else {
						data = '';
					}
				}
				a = new Ajax({
					url: url,
					method: method,
					data: data,
					oncomplete: callback
				});
			}
			a.send();
			return a;
		},
		/**
		 * ��̬get����
		 * @method get
		 * @static
		 * @param {String|Form} url ����ĵ�ַ
		 * @param {String|Json|Form} data (Optional)���͵�����
		 * @param {Function} callback ������ɺ�Ļص�
		 * @returns {Ajax}
		 * @example
		 QW.Ajax.get('http://demo.com',{key: 'value'},function(e){alert(this.requester.responseText);});
		 */
		get: function(url, data, callback) {
			var args = [].slice.call(arguments, 0);
			args.push('get');
			return Ajax.request.apply(null, args);
		},
		/**
		 * ��̬post����
		 * @method post
		 * @static
		 * @param {String|Form} url ����ĵ�ַ
		 * @param {String|Json|Form} data (Optional)���͵�����
		 * @param {Function} callback ������ɺ�Ļص�
		 * @returns {Ajax}
		 * @example
		 QW.Ajax.post('http://demo.com',{key: 'value'},function(e){alert(this.requester.responseText);});
		 */
		post: function(url, data, callback) {
			var args = [].slice.call(arguments, 0);
			args.push('post');
			return Ajax.request.apply(null, args);
		}
	});

	mix(Ajax.prototype, {
		//����
		url: '',
		method: 'get',
		async: true,
		user: '',
		pwd: '',
		requestHeaders: null, //��һ��json����
		data: '',
		/*
		 * �Ƿ�������������������������֮ǰ��������ɺ���ܽ�����һ������
		 * Ĭ�ϲ�������
		 */
		useLock: 0,
		timeout: 30000, //��ʱʱ��

		//˽�б�����readOnly����
		isLocked: 0, //��������״̬
		state: Ajax.STATE_INIT, //��δ��ʼ����
		/** 
		 * send( url, method, data ): ��������
		 * @param {string} url �����url
		 * @param {string} method ���ͷ�����get/post
		 * @param {string|jason|FormElement} data �������ַ�����Ҳ������Json����Ҳ������FormElement
		 * @returns {void} 
		 */
		send: function(url, method, data) {
			var me = this;
			if (me.isLocked) throw new Error('Locked.');
			else if (me.isProcessing()) {
				me.cancel();
			}
			var requester = me.requester;
			if (!requester) {
				requester = me.requester = Ajax.getXHR();
				if (!requester) {
					throw new Error('Fail to get HTTPRequester.');
				}
			}
			url = url || me.url;
			method = (method || me.method || '').toLowerCase();
			if (method != 'post') method = 'get';
			data = data || me.data;

			if (typeof data == 'object') {
				if (data.tagName = 'FORM') data = encodeURIForm(data); //data��Form HTMLElement
				else data = encodeURIJson(data); //data��Json����
			}

			//�����get��ʽ������������ݱ�����'key1=value1&key2=value2'��ʽ�ġ�
			if (data && method != 'post') url += (url.indexOf('?') != -1 ? '&' : '?') + data;
			if (me.user) requester.open(method, url, me.async, me.user, me.pwd);
			else requester.open(method, url, me.async);
			//��������ͷ
			for (var i in me.requestHeaders) {
				requester.setRequestHeader(i, me.requestHeaders[i]);
			}
			//����
			me.isLocked = 0;
			me.state = Ajax.STATE_INIT;
			//send�¼�
			if (me.async) {
				me._sendTime = new Date();
				if (me.useLock) me.isLocked = 1;
				this.requester.onreadystatechange = function() {
					var state = me.requester.readyState;
					if (state == 4) {
						me._execComplete();
					}
				};
				me._checkTimeout();
			}
			if (method == 'post') {
				if (!data) data = ' ';
				requester.send(data);
			} else {
				requester.send(null);
			}
			if (!me.async) {
				me._execComplete('timeout');
			}

		},
		/** 
		 * isSuccess(): �ж����ڵ�״̬�Ƿ��ǡ�������ɹ���
		 * @returns {boolean} : ����XMLHttpRequest�Ƿ�ɹ�����
		 */
		isSuccess: function() {
			var status = this.requester.status;
			return !status || (status >= 200 && status < 300) || status == 304;
		},
		/** 
		 * isProcessing(): �ж����ڵ�״̬�Ƿ��ǡ����������С�
		 * @returns {boolean} : ����XMLHttpRequest�Ƿ���������
		 */
		isProcessing: function() {
			var state = this.requester ? this.requester.readyState : 0;
			return state > 0 && state < 4;
		},
		/** 
		 * get(url,data): ��get��ʽ��������
		 * @param {string} url: �����url
		 * @param {string|jason|FormElement} data: �������ַ�����Ҳ������Json����Ҳ������FormElement
		 * @returns {void} : ��
		 * @see : send ��
		 */
		get: function(url, data) {
			this.send(url, 'get', data);
		},
		/** 
		 * get(url,data): ��post��ʽ��������
		 * @param {string} url: �����url
		 * @param {string|jason|FormElement} data: �������ַ�����Ҳ������Json����Ҳ������FormElement
		 * @returns {void} : ��
		 * @see : send ��
		 */
		post: function(url, data) {
			this.send(url, 'post', data);
		},
		/** 
		 * cancel(): ȡ������
		 * @returns {boolean}: �Ƿ���ȡ��������������Ϊ��ʱ�����Ѿ��������������Ѿ��ɹ���
		 */
		cancel: function() {
			var me = this;
			if (me.requester && me.isProcessing()) {
				me.state = Ajax.STATE_CANCEL;
				me.requester.abort();
				me._execComplete();
				me.fire('cancel');
				return true;
			}
			return false;
		},
		/** 
		 * _initialize(): ��һ��Ajax���г�ʼ��
		 * @returns {void}: 
		 */
		_initialize: function() {
			var me = this;
			CustEvent.createEvents(me, Ajax.EVENTS);
			mix(me, me.options, 1);
			me.requestHeaders = mix(me.requestHeaders || {}, Ajax.defaultHeaders);

		},
		/** 
		 * _checkTimeout(): ����Ƿ�����ʱ
		 * @returns {void}: 
		 */
		_checkTimeout: function() {
			var me = this;
			if (me.async) {
				clearTimeout(me._timer);
				this._timer = setTimeout(function() {
					// Check to see if the request is still happening
					if (me.requester && !me.isProcessing()) {
						// Cancel the request
						me.state = Ajax.STATE_TIMEOUT;
						me.requester.abort(); //Firefoxִ�и÷�����ᴥ��onreadystatechange�¼�������state=4;���Իᴥ��oncomplete�¼�����IE��Safari����
						me._execComplete('timeout');
					}
				}, me.timeout);
			}
		},
		/** 
		 * _execComplete(): ִ��������ɵĲ���
		 * @returns {void}: 
		 */
		_execComplete: function() {
			var me = this;
			var requester = me.requester;
			requester.onreadystatechange = new Function; //��ֹIE6�µ��ڴ�й©
			me.isLocked = 0; //����
			clearTimeout(this._timer);
			if (me.state == Ajax.STATE_CANCEL || me.state == Ajax.STATE_TIMEOUT) {
				//do nothing. ����Ǳ�ȡ��������ִ�лص�
			} else if (me.isSuccess()) {
				me.state = Ajax.STATE_SUCCESS;
				me.fire('succeed');
			} else {
				me.state = Ajax.STATE_ERROR;
				me.fire('error');
			}
			me.fire('complete');
		}
	});

	QW.provide('Ajax', Ajax);
}());


//	document.write('<script type="text/javascript" src="' + srcPath + 'wagang/ajax/ajax_retouch.js"></script>');

/*
 *	Copyright (c) QWrap
 *	version: $version$ $release$ released
 *	author: JK
 *  description: ajax�Ƽ�retouch....
*/

(function() {
	var Ajax = QW.Ajax,
		NodeW = QW.NodeW,
		g = QW.NodeH.g;

	Ajax.Delay = 1000;
	/*
	 * Youa��Ŀ�д���json��ʽresponse���Ƽ�����
	 * @method opResults 
	 * ���磬�������ᴦͨһЩͨ�õĴ���Ajax.post(oForm,function(e){var status=this.opResults();})
	 */
	Ajax.prototype.opResults = function(url) {
		var ajax = this;
		if (ajax.isSuccess()) {
			var responseText = ajax.requester.responseText;
			try {
				var status = new Function('return (' + responseText + ');')();
			} catch (ex) {
				alert("ϵͳ�������Ժ����ԡ�");
				return {
					isop: true,
					err: "inter"
				};
			}
		} else {
			alert("ϵͳ�������Ժ����ԡ�");
			return {
				isop: true,
				err: "inter"
			};
		}

		status.isop = true; //��¼�Ƿ��Ѿ���������
		var Valid_fail = window.Valid && Valid.fail || function(el, msg, needFocus) {
				alert(msg);
				el.focus();
			};
		switch (status.err) {
		case "mcphp.ok":
			if (url != false) {
				if (url) {
					if (url === true) {
						setTimeout(function() {
							location.reload(true);
						}, Ajax.Delay);
					} else {
						setTimeout(function() {
							location.href = url;
						}, Ajax.Delay);
					}
				} else {
					if (status.data && status.data.url) {
						setTimeout(function() {
							location.href = status.data.url;
						}, Ajax.Delay);
					} else {
						setTimeout(function() {
							location.reload(true);
						}, Ajax.Delay);
					}
				}
			} else {
				status.isop = false;
			}
			break;
		case "gmap.internal":
			alert("��֤����ڣ���ˢ��ҳ������ԣ�");
			break;
		case "mcphp.u_vcode":
			var els = document.getElementsByName('_vcode'),
				elKeys = document.getElementsByName('_vcode_key');
			if (els.length > 0 && elKeys.length > 0) {
				var el = els[0],
					elKey = elKeys[0];
				Valid_fail(el, "�������������֤�롣", true);
				if (g('_vcode_img')) {
					g('_vcode_img').src = '/vcode?k=' + elKey.value + '&random=' + Math.random();
				}
			}
			break;
		case "mcphp.u_input":
			for (var i in status.data) {
				var tempEl = document.getElementsByName(i);
				try {
					if (tempEl.length > 0) {
						if (tempEl.length == 1) {
							Valid_fail(tempEl[0], "����������ݸ�ʽ���Ի򳬳��������Ƿ���������ַ���", true);
						} else {
							for (var x = 0; x < tempEl.length; x++) {
								if (status.fields[i] == tempEl[x].value.encode4Html()) {
									Valid_fail(tempEl[x], "����������ݸ�ʽ���Ի򳬳��������Ƿ���������ַ���", true);
									break;
								}
							}
						}
					}
				} catch (e) {
					alert("����������ݸ�ʽ���Ի򳬳��������Ƿ���������ַ���");
				}
			}
			break;
		case "mcphp.u_notfound":
			alert("�������ҳ�治���ڣ�");
			break;
		case "mcphp.u_antispam":
			alert("���ύ�����ݰ������дʻ㣬����������ύ��");
			break;
		case "mcphp.u_deny":
			alert("���Ĳ���������");
			break;
		case "mcphp.u_bfilter":
			alert("���Ĳ���̫Ƶ����");
			break;
		case "login":
		case "mcphp.u_login":
			try {
				User.Login.show();
				User.Login.hint("����Ҫ��¼����ܼ����ղŵĲ���");
			} catch (e) {
				try {
					top.User.Login.show();
					top.User.Login.hint("����Ҫ��¼����ܼ����ղŵĲ���");
				} catch (e1) {
					alert('����Ҫ��¼����ܼ����ղŵĲ�����');
				}
			}
			break;
		case "mcphp.u_power":
			window.location = "http://co.youa.baidu.com/content/misc/err/nopower/index.html";
			break;
		case "mcphp.fatal":
		case "mar.sys_inter":
			alert("ϵͳ�������Ժ����ԡ�");
			break;
		default:
			status.isop = false;
		}
		return status;
	};

	/*
	 * Youa��Ŀ�д���javascript��ʽresponse���Ƽ�����
	 * @method execJs 
	 * ���磬��������ִ�з��ؽ����Ajax.post(oForm,function(e){var status=this.execJs();})
	 */
	Ajax.prototype.execJs = function() {
		QW.StringH.execJs(this.requester.responseText);
	};

	/*
	 * ��չNodeW
	 * @method ajaxForm 
	 * @example W('#formId').ajaxForm();
	 */
	var FormH = {
		ajaxForm: function(oForm, opts) {
			if (typeof opts == 'function') {
				var o = {
					data: oForm,
					oncomplete: opts
				};
			} else {
				o = {
					data: oForm,
					oncomplete: Ajax.opResults
				};
				QW.ObjectH.mix(o, opts || {}, true);
			}
			new Ajax(o).require();
		}
	};

	NodeW.pluginHelper(FormH, 'operator');
}());

