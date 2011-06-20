/**	
 * @class Valid Valid form��֤
 * @namespace QW
 * @singleton 
 */


(function() {
	var QW = window.QW,
		loadJs = QW.loadJs,
		mix = QW.ObjectH.mix,
		StringH = QW.StringH,
		trim = StringH.trim,
		tmpl = StringH.tmpl,
		dbc2sbc = StringH.dbc2sbc,
		byteLen = StringH.byteLen,
		evalExp = StringH.evalExp,
		formatDate = QW.DateH.format,
		NodeH = QW.NodeH,
		g = NodeH.g,
		query = NodeH.query,
		getValue = NodeH.getValue,
		getAttr2 = function(el, attr) {
			return el[attr] || el.getAttribute(attr) || getJsAttr(el, attr);
		},
		createElement = QW.DomU.create,
		CustEvent = QW.CustEvent;

	var Valid = {
		VERSION: '0.0.1',
		EVENTS: 'hint,blur,pass,fail,beforecheckall,checkall,initall'.split(','),
		REQ_ATTR: 'reqMsg',
		//Ĭ�ϵı���������������
		_curReqAttr: 'reqMsg' //��ǰ����������������(����,����"���涩���ݸ�"��"�¶���"������ť,������������ֵ���ܲ�һ��)
	};

/* 
* ��JsData�л�ȡelement���������
* @method	getJsAttr
* @param	{HTMLElement} el Ŀ�����
* @param	{string} attribute ��������
* @return	{any}
*/
	var getJsAttr = function(el, attribute) {
		var CheckRules = Valid.CheckRules;
		if (!CheckRules) return null;
		attribute = attribute.toLowerCase();
		el = g(el);
		var keys = []; //���ȶ�:id>name>className>tagName
		if (el.id) keys.push('#' + el.id); //id
		if (el.name) keys.push('@' + el.name); //name
		keys = keys.concat(el.className.match(/\.[\w\-]+/g) || [], (el.tagName + '').toLowerCase()); //className>tagName
		for (var i = 0, len = keys.length; i < len; i++) {
			var key = keys[i];
			if ((key in CheckRules) && (attribute in CheckRules[key])) return CheckRules[key][attribute];
		}
		return null;
	};
	/**
	 * CheckRules һ�������ռ䣬����������Ԫ�ض�Ӧ����.
	 * @property	{Json} CheckRules ����������Ԫ�ض�Ӧ��ĳЩ������
	 Valid.CheckRules={
	 'input':{datatype:'d'},
	 '#myid':{minValue:'2010-01-01'},
	 '@myname':{maxValue:'2011-01-01'},
	 '.myclass':{minValue:'2010-01-01'}
	 };
	 */
	CustEvent.createEvents(Valid, Valid.EVENTS);

	mix(Valid, {
		/** 
		 * ����Ԫ��
		 * @method hint
		 * @static
		 * @param {Element} el ��Ԫ�� 
		 * @return {void}
		 */
		hint: function(el) {
			Valid.fire(new CustEvent(el, 'hint')); //onhint
		},
		/** 
		 * �뿪Ԫ��
		 * @method blur
		 * @static
		 * @param {Element} el ��Ԫ�� 
		 * @return {void}
		 */
		blur: function(el) {
			Valid.fire(new CustEvent(el, 'blur')); //onblur
		},
		/** 
		 * Ԫ��ͨ����֤
		 * @method pass
		 * @static
		 * @param {Element} el ��Ԫ�� 
		 * @return {void}
		 */
		pass: function(el) {
			Valid.fire(new CustEvent(el, 'pass')); //onpass
		},
		/** 
		 * Ԫ��δͨ����֤
		 * @method fail
		 * @static
		 * @param {Element} el ��Ԫ�� 
		 * @param {string} errMsg δͨ����ʾ��Ϣ 
		 * @param {boolean} needFocus �Ƿ���Ҫfocus 
		 * @return {void}
		 */
		fail: function(el, errMsg, needFocus) {
			if (needFocus) Valid.focusFailEl(el);
			var ce = new CustEvent(el, 'fail');
			ce.errMsg = errMsg;
			Valid.fire(ce); //onfail
		},

		checkAll_stamp: 1,
		//checkAll�Ĵ���
		isChecking: false,
		//�Ƿ�����checkAll��
		/** 
		 * ��֤һ����������Ԫ��
		 * @method checkAll
		 * @static
		 * @param {Element} oForm �� 
		 * @param {boolean} needFocus �Ƿ���Ҫfocus 
		 * @param {json} opts����������ֹǰ֧�����²�����
		 reqAttr: String,�ǿձ�ʶ���ԣ�Ĭ��ֵ��Valid.REQATTR,��"reqMsg".
		 myValidator: Function,�Լ�����֤�������Դ���ǿ���֤��dataType��֤�޷����������������֤��checkAll���Ԫ�ؽ��б�����ÿ�����������myValidator(el)������ú�������false�����ʾ��Ԫ��δͨ����֤ 
		 * @return {boolean} 
		 */
		checkAll: function(oForm, needFocus, opts) {
			needFocus = (needFocus != false);
			var ce = new CustEvent(oForm, 'beforecheckall');
			ce.opts = opts || {};
			Valid.fire(ce); //onbeforecheckall
			Valid.isChecking = true;
			var els = oForm.elements,
				failEls = [];
			for (var i = 0, el; el = els[i++];) {
				if (!getAttr2(el, "forceVld") && (el.disabled || el.readOnly || !el.offsetWidth)) continue;
				if (!Valid.check(el, false, opts)) failEls.push(el);
			}
			var isOk = !failEls.length;
			var ce2 = new CustEvent(oForm, 'checkall');
			ce2.result = isOk;
			ce2.failEls = failEls;
			Valid.fire(ce2); //oncheckall
			Valid.isChecking = false;
			Valid.checkAll_stamp++;
			if (!isOk && needFocus) window.setTimeout(function() {
				Valid.check(failEls[0], true, opts);
			}, 10);
			return isOk;
		},

		/** 
		 * ��֤һ����Ԫ��
		 * @method check
		 * @static
		 * @param {Element} el ��Ԫ�� 
		 * @param {boolean} needFocus �Ƿ���Ҫfocus 
		 * @param {json} opts����������ֹǰ֧�����²�����
		 myValidator: Function,�Լ�����֤�������Դ���ǿ���֤��dataType��֤�޷����������������֤��checkAll���Ԫ�ؽ��б�����ÿ�����������myValidator(el)������ú�������false�����ʾ��Ԫ��δͨ����֤ 
		 * @return {boolean} 
		 */
		check: function(el, needFocus, opts) {
			if (!Validators.required(el) //�ǿ���֤
					|| getAttr2(el, "datatype") && !Validators.datatype(el) || (opts && opts.myValidator && !opts.myValidator(el)) //�û��Զ�����֤
					) {
				if (needFocus) {
					Valid.focusFailEl(el);
					Valid.check(el, false, opts);
				}
				return false;
			}
			return true;
		},

		/** 
		 * ����֤�����Ⱦ��ҳ��
		 * @method renderResult
		 * @static
		 * @param {Element} el ��Ԫ�� 
		 * @param {boolean} result �Ƿ�ͨ����֤ 
		 * @param {string} errMsg δͨ����֤ʱ����ʾ��Ϣ 
		 * @param {boolean} needFocus �Ƿ���Ҫfocus 
		 * @return {void} 
		 */
		renderResult: function(el, result, errMsg, needFocus) {
			if (result) Valid.pass(el);
			else Valid.fail(el, errMsg, needFocus);
		},

		/** 
		 * ���㼯�е�δͨ����֤��Element��
		 * @static
		 * @method focusFailEl
		 * @param {Element} el ��Ԫ�� 
		 * @return {void} 
		 */
		focusFailEl: function(el) {
			var fEl = getAttr2(el, "focusEl");
			fEl = fEl && g(fEl) || el;
			try {
				fEl.focus();
				if (!fEl.tagName) return;
				if (QW.NodeW && QW.NodeW.shine4Error) QW.NodeW.shine4Error(fEl);
				fEl.select();
			} catch (e) {}
		},

		/** 
		 * ��ʼ����֤�����������Ԫ�ص�onfocus/onblur���Լ����ں������������ť
		 * @method initAll
		 * @static
		 * @param {Element} container ����HTMLElement 
		 * @return {void} 
		 */
		initAll: function(container) {
			if (!Valid._isInitialized) {
				Valid._isInitialized = true;
				if (document.addEventListener) { //ie
					document.addEventListener('focus', function(e) {
						var el = e.target;
						if (el && ',INPUT,SELECT,TEXTAREA,OBJECT'.indexOf(',' + el.tagName) > -1) {
							Valid.hint(el);
						}
					}, true);
					document.addEventListener('blur', function(e) {
						var el = e.target;
						if (el && ',INPUT,SELECT,TEXTAREA,OBJECT'.indexOf(',' + el.tagName) > -1) {
							Valid.blur(el);
						}
					}, true);
				} else {
					document.attachEvent('onfocusin', function(e) {
						Valid.hint(e.srcElement);
					})
					document.attachEvent('onfocusout', function(e) {
						Valid.blur(e.srcElement);
					})
				}
			}
			var els = query(container, "input");
			for (var i = 0; i < els.length; i++) {
				Valid.initEl(els[i]);
			}
			var ce = new CustEvent(container, 'initall');
			Valid.fire(ce); //oninitall

		},
		/** 
		 * ��ʼ����֤�����������Ԫ�ص�onfocus/onblur���Լ����ں������������ť
		 * @method initEl
		 * @static
		 * @param {Element} container ����HTMLElement 
		 * @return {void} 
		 */
		initEl: function(el) {
			var dataType = getAttr2(el, "datatype");
			if (dataType == "d" || dataType == "daterange") {//Date���ڵĺ���������ڰ�ť
				var nextEl = el.nextSibling;
				if (nextEl && nextEl.tagName == "IMG") return;
				var img = Utils.getCalendarImg().cloneNode(true);
				img.onclick = function(e) {
					Utils.pickDate(el);
				};
				el.parentNode.insertBefore(img, nextEl);
			}
		},

		/** 
		 * �����еĴ�����֤��Ϣ��ա�
		 * @method resetAll
		 * @static
		 * @param {Element} oForm FormHTMLElement 
		 * @return {void} 
		 */
		resetAll: function(oForm) {
			var els = oForm.elements;
			for (var i = 0, el; el = els[i++];) {
				Valid.pass(el);
			}
		}
	});


	/**
	 * @class Msgs ��ʾ��Ϣ����,�����ṩһ���õ���ʾ��Ϣ�ķ���(��getMsg).
	 * @singleton
	 * @namespace QW.Valid
	 */

	var Msgs = Valid.Msgs = {
		n_integer: '������С��{$0}����������',
		n_format: '���������ʽΪ"{$0}"��',
		n_upper: '����ֵ̫���������<strong>{$0}</strong>��',
		//ע�⣺{$0}��ʾ����ֵ��{$1}��ʾʵ��ֵ
		n_lower: '����ֵ̫С����С����<strong>{$0}</strong>��',
		nrange_from: '������ķ�Χ������',
		nrange_to: '������ķ�Χ������',
		n_useless_zero: '����ǰ������ж����"0"��',
		d_format: '���������ʽΪ"YYYY-MM-DD"��',
		d_upper: '����̫����������<strong>{$0}</strong>��',
		d_lower: '����̫�磬��������<strong>{$0}</strong>��',
		daterange_from: '��ʼ���ڲ��ܴ��ڽ�ֹ���ڡ�',
		daterange_to: '��ֹ���ڲ���С����ʼ���ڡ�',
		daterange_larger_span: "ʱ���Ȳ��ó���<strong>{$0}</strong>�졣",
		text_longer: '����̫�࣬�������<strong>{$0}</strong>�֡�',
		//'{$1}��̫�࣬�������<strong>{$0}</strong>��'
		text_shorter: '����̫�٣���������<strong>{$0}</strong>�֡�',
		//'{$1}��̫�٣���������<strong>{$0}</strong>��'
		bytetext_longer: '����̫�࣬�������<strong>{$0}</strong>�ֽڡ�',
		//'{$1}�ֽ�̫�࣬�������<strong>{$0}</strong>�ֽ�'
		bytetext_shorter: '����̫�٣���������<strong>{$0}</strong>�ֽڡ�',
		//'{$1}�ֽ�̫�٣���������<strong>{$0}</strong>�ֽ�'
		richtext_longer: '����̫�࣬�������<strong>{$0}</strong>�֡�',
		richtext_shorter: '����̫�٣���������<strong>{$0}</strong>�֡�',
		_reconfirm: '�������벻һ�¡�',
		_time: '�����������ʱ���ʽ��',
		_minute: '�����������ʱ���ʽ��',
		_email: '�����������Email��ʽ��',
		_mobilecode: '������������ֻ����롣',
		_phone: '����������ĵ绰���롣',
		_phonewithext: '����������ĵ绰���롣',
		_phonezone: '����������ĵ绰���š�',
		_phonecode: '����������ĵ绰���롣',
		_phoneext: '����������ĵ绰�ֻ����롣',
		_zipcode: '������������������롣',
		_idnumber: '��������������֤���룬Ŀǰֻ֧��15λ����18λ��',
		_bankcard: '����������������˺š�',
		_cnname: '�����������������',
		_vcode: '�������������֤�롣',
		_imgfile: '������ѡ���ͼƬ�ļ�·����ֻ֧��jpg��jpeg��png��gif��tif��bmp��ʽ��',
		_regexp: '�����������롣',
		_magic: '�����������롣',
		_req_text: '����д{$0}��',
		_req_select: '��ѡ��{$0}��',
		_req_file: '���ϴ�{$0}��',
		_logicrequired: '{$0}���벻����.',
		/** 
		 * ����msgKey��ȡ��ʾ��Ϣ��
		 * @method getMsg
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {string} msgKey msgKey.
		 * @return {string}  
		 */
		getMsg: function(el, msgKey) {
			return getAttr2(el, msgKey) || getAttr2(el, 'errmsg') || Msgs[msgKey] || msgKey;
		}
	};

	/**
	 * @class Utils һЩ��valid��صĺ���.
	 * @class singleton
	 * @namespace QW.Valid
	 */

	var Utils = Valid.Utils = {
		/** 
		 * ��ȡ������ťСͼƬ��
		 * @method getCalendarImg
		 * @static
		 * @return {Element}  
		 */
		getCalendarImg: (function() {
			var calendarImg = null;
			return function() {
				return calendarImg = calendarImg || createElement('<img src="' + QW.PATH + 'wagang/valid/assets/Calendar.gif" align="absMiddle" class="calendar-hdl-img" style="cursor:pointer">');
			};
		}()),
		/** 
		 * ������������������һ�����ڡ�
		 * @method pickDate
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @return {void}  
		 */
		pickDate: function(el) {
			if (QW.Calendar) {
				QW.Calendar.pickDate(el);
			} else {
				var calendarJsUrl = QW.PATH + "wagang/valid/calendar.js?v={version}"; //to get the calendarUrl Url.
				loadJs(calendarJsUrl, function() {
					QW.Calendar.pickDate(el);
				});
			}
		},
		/** 
		 * ��һ���������ֵ��For IE: To keep Undo after change value.
		 * @method setTextValue
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {string} value value
		 * @return {void}  
		 */
		setTextValue: function(el, value) {// For IE: To keep Undo after change value.
			if (el.createTextRange) el.createTextRange().text = value;
			else el.value = value;
		},
		/** 
		 * trimһ����������ֵ.
		 * @method trimTextValue
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @return {void}  
		 */
		trimTextValue: function(el) {
			var s = trim(el.value);
			if (s != el.value) Utils.setTextValue(el, s);
		},
		/** 
		 * ��һ��text��ֵ���ȫ���ַ�ת�ɰ����ַ�
		 * @method dbc2sbcValue
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @return {void}  
		 */
		dbc2sbcValue: function(el) {
			var s = dbc2sbc(getValue(el));
			if (s != getValue(el)) Utils.setTextValue(el, s);
		},
		/** 
		 * datatype��֤֮,����׼������
		 * @method prepare4Vld
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @return {void}  
		 */
		prepare4Vld: function(el) {
			if (el.getAttribute("ignoredbc")) Utils.dbc2sbcValue(el);
			if (el.type == "text" || el.type == "textarea") Utils.trimTextValue(el); //����ᵼ������û����ÿո��Ű�Ļ�����һ�е��Ű�����
		}
	};

	/**
	 * @class Validators У�麯���ļ���.
	 * @singleton
	 * @namespace QW.Valid
	 */
	var Validators = Valid.Validators = {};
	mix(Validators, [{
		/** 
		 * �ǿ�У��
		 * @method required
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		required: function(el, renderResult) {
			Utils.prepare4Vld(el);
			var reqAttr = Valid._curReqAttr || Valid.REQ_ATTR;
			var sReq = getAttr2(el, reqAttr);
			if (sReq) {//�����reqMsg���ԣ����ʾΪ�ǿ�
				var reqlogic = getAttr2(el, "reqlogic");
				if (reqlogic) {//�ǿ��߼���֤
					return Validators.logicrequired(el, renderResult, reqlogic);
				} else {
					var isOk = false;
					var msgKey = "_req_text";
					if (el.tagName == "SELECT") {
						isOk = (el.value != "" || el.length < 2 || (el.length == 2 && el.options[1].value == ""));
						msgKey = "_req_select";
					} else if (el.type == "checkbox" || el.type == "radio") {
						var els = document.getElementsByName(el.name);
						for (var i = 0; i < els.length; i++) {
							if (isOk = els[i].checked) break;
						}
						msgKey = "_req_select";
					} else {
						isOk = (getValue(el) != "");
						if (el.type == "file") msgKey = "_req_file";
					}
					if (renderResult != false) Valid.renderResult(el, isOk, !isOk && sReq.indexOf(" ") == 0 ? sReq.substr(1) : tmpl(Msgs[msgKey], [sReq])); //Ǳ�������reqmsg���Կո�ͷ��������������
					return isOk;
				}

			}
			return true;
		},
		/** 
		 * ����У�飬У��һ��Ԫ�ص������Ƿ�Ϸ�
		 * @method datatype
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @param {string} datatype ��������
		 * @return {boolean}  
		 */
		datatype: function(el, renderResult, datatype) {
			datatype = datatype || getAttr2(el, 'datatype');
			if (!datatype) {
				Valid.pass(el, renderResult);
				return true;
			}
			var dt = datatype.split('-')[0].toLowerCase(),
				pattern = datatype.substr(dt.length + 1),
				cb = Validators[dt];
			if (!cb) throw 'Unknown datatype: ' + datatype; //�Ҳ�����Ӧ��datatype�������쳣
			return pattern ? cb(el, renderResult, pattern) : cb(el, renderResult);
		},
		/** 
		 * ��ֵУ��
		 * @method n
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @param {string} pattern ��ֵ��ʽ����'7','7.2'
		 * @return {boolean}  
		 */
		n: function(el, renderResult, pattern) {
			Utils.prepare4Vld(el);
			Utils.dbc2sbcValue(el);
			var val = getValue(el);
			var isOk = (val == "");
			var msg = null;

			if (!isOk) {
				var patternArr = (pattern || getAttr2(el, 'n-pattern') || '10').split('.');
				var len = patternArr[0] | 0 || 10,
					precision = patternArr[1] | 0;
				if (precision < 1) {
					if ((/\D/).test(val) || val.length > len) msg = tmpl(Msgs.getMsg(el, "n_integer"), [1 + new Array(len + 1).join("0")]);
				} else {
					var s = "^\\d{1,100}(\\.\\d{1," + precision + "})?$";
					if (!(new RegExp(s)).test(val)) msg = tmpl(Msgs.getMsg(el, "n_format"), [(new Array(len - precision + 1)).join("X") + "." + (new Array(precision + 1)).join("X")]);
				}
				if ((/^0\d/).test(val)) {
					msg = Msgs.getMsg(el, "n_useless_zero");
				}
				if (!msg) {
					var maxV = getAttr2(el, "maxValue") || Math.pow(10, len-precision)-Math.pow(10, -precision);
					if (maxV && (parseFloat(val, 10) > maxV - 0)) {
						msg = tmpl(Msgs.getMsg(el, "n_upper"), [maxV, val]);
					}
					var minV = getAttr2(el, "minValue");
					if (minV && parseFloat(val, 10) < minV - 0) {
						msg = tmpl(Msgs.getMsg(el, "n_lower"), [minV, val]);
					}
				}
				if (msg) isOk = false;
				else isOk = true;
			}
			if (renderResult != false) Valid.renderResult(el, isOk, msg);
			return isOk;
		},

		/** 
		 * ��ֵ��ΧУ��
		 * @method nrange
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @param {string} pattern ��ֵ��ʽ����'7','7.2'
		 * @return {boolean}  
		 */
		nrange: function(el, renderResult, pattern) {
			var isOk = Validators.n(el, renderResult, pattern);
			if (isOk) {
				var fromNEl = g(getAttr2(el, 'fromNEl'));
				var toNEl = g(getAttr2(el, 'toNEl'));
				if (fromNEl) {
					toNEl = el;
				} else if (toNEl) {
					fromNEl = el;
				} else { //Ĭ����ͬһ�������������inputΪһ����ֹʱ��
					var els = el.parentNode.getElementsByTagName("input");
					if (els[0] == el) {
						fromNEl = el;
						toNEl = els[1];
					} else {
						fromNEl = els[0];
						toNEl = el;
					}
				}
				var relEl = el == fromNEl ? toNEl : fromNEl;
				var isOk2 = Validators.n(relEl, renderResult, pattern);
				if (isOk2) {
					if (getValue(relEl) && getValue(el)) {
						if (getValue(fromNEl) * 1 > getValue(toNEl) * 1) {
							isOk = false;
							if (el == fromNEl) Valid.fail(fromNEl, Msgs.getMsg(fromNEl, "nrange_from"));
							if (el == toNEl) Valid.fail(toNEl, Msgs.getMsg(toNEl, "nrange_to"));
						}
					}
				}
			}
			return isOk;
		},


		/** 
		 * ����У��
		 * @method d
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		d: function(el, renderResult) {
			Utils.prepare4Vld(el);
			Utils.dbc2sbcValue(el);
			var val = getValue(el);
			var isOk = (val == "");
			var msg = null;
			if (!isOk) {
				val = val.replace(/(^\D+)|(\D+$)/g, "").replace(/\D+/g, "/");
				if (!(/\D/).test(val)) {
					if (val.length == 8) val = val.substr(0, 4) + "/" + val.substr(4, 2) + "/" + val.substr(6, 2);
				}
				var tempD = new Date(val);
				if (!isNaN(tempD)) {
					var nStrs = val.split(/\D+/ig);
					if (nStrs.length == 3 && nStrs[0].length == 4 && nStrs[2].length < 3) { //���ڸ�ʽֻ����ΪYYYY/MM/DD,���¸�ʽ���Ϸ���MM/DD/YYYY
						isOk = true;
						if (formatDate(tempD) != getValue(el)) {
							Utils.setTextValue(el, formatDate(tempD));
							val = getValue(el);
						}
					}
				}
				if (!isOk) {
					msg = Msgs.getMsg(el, "d_format");
				} else {
					var maxV = el.getAttribute("maxValue") || "2049-12-31";
					if (tempD > new Date(maxV.replace(/\D+/g, "/"))) {
						isOk = false;
						msg = tmpl(Msgs.getMsg(el, "d_upper"), [maxV, val]);
					}
					var minV = el.getAttribute("minValue") || "1900-01-01";
					if (tempD < new Date(minV.replace(/\D+/g, "/"))) {
						isOk = false;
						msg = tmpl(Msgs.getMsg(el, "d_lower"), [minV, val]);
					}
				}
			}
			if (renderResult != false) Valid.renderResult(el, isOk, msg);
			return isOk;
		},
		/** 
		 * ���ڷ�ΧУ��
		 * @method daterange
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		daterange: function(el, renderResult) {
			var isOk = Validators.d(el, renderResult);
			if (isOk) {
				var fromDateEl = g(getAttr2(el, 'fromDateEl'));
				var toDateEl = g(getAttr2(el, 'toDateEl'));
				if (fromDateEl) {
					toDateEl = el;
				} else if (toDateEl) {
					fromDateEl = el;
				} else { //Ĭ����ͬһ�������������inputΪһ����ֹʱ��
					var els = el.parentNode.getElementsByTagName("input");
					if (els[0] == el) {
						fromDateEl = el;
						toDateEl = els[1];
					} else {
						fromDateEl = els[0];
						toDateEl = el;
					}
				}
				var relEl = el == fromDateEl ? toDateEl : fromDateEl;
				var isOk2 = Validators.d(relEl, renderResult);
				if (isOk2) {
					if (getValue(relEl) && getValue(el)) {
						if (getValue(fromDateEl) > getValue(toDateEl)) {
							isOk = false;
							if (el == fromDateEl) Valid.fail(fromDateEl, Msgs.getMsg(fromDateEl, "daterange_from"));
							if (el == toDateEl) Valid.fail(toDateEl, Msgs.getMsg(toDateEl, "daterange_to"));
						}
						if (getValue(fromDateEl) && getValue(toDateEl)) {
							var maxDateSpan = getAttr2(fromDateEl, 'maxDateSpan') || getAttr2(toDateEl, 'maxDateSpan'); //ʱ����
							if (maxDateSpan && (new Date(getValue(toDateEl).replace(/-/g, '/')) - new Date(getValue(fromDateEl).replace(/-/g, '/'))) > (maxDateSpan - 1) * 24 * 3600000) {
								Valid.fail(el, tmpl(Msgs.getMsg(el, "daterange_larger_span"), [maxDateSpan]));
								isOk = false;
							}
						}

					}
				}
			}
			return isOk;
		},

		/** 
		 * �ַ�������У��
		 * @method _checkLength
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @param {function} getLengthFun �ַ������ȼ��㺯��
		 * @param {string} dataType �������ͣ��磺text/bytetext/richtext
		 * @return {boolean}  
		 */
		_checkLength: function(el, renderResult, getLengthFun, dataType) {
			Utils.prepare4Vld(el);
			var val = getValue(el);
			var isOk = (val == "");
			var msg = null;
			if (!isOk) {
				var maxLen = (getAttr2(el, "maxLength") || 1024) | 0;
				var minLen = getAttr2(el, "minLength")  | 0;
				var curLen = getLengthFun(el);
				if (curLen > maxLen) {
					msg = tmpl(Msgs.getMsg(el, "text_longer") || Msgs[dataType + "_longer"], [maxLen, curLen]);
				} else if (curLen < minLen) {
					msg = tmpl(Msgs.getMsg(el, "text_shorter") || Msgs[dataType + "_shorter"], [minLen, curLen]);
				} else {
					isOk = true;
				}
			}
			if (renderResult != false) Valid.renderResult(el, isOk, msg);
			return isOk;
		},

		/** 
		 * �ı�������֤
		 * @method text
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		text: function(el, renderResult) {
			return Validators._checkLength(el || this, renderResult, function(a) {
				return getValue(a).length;
			}, "text");
		},

		/** 
		 * �ֽڳ�����֤
		 * @method bytetext
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		bytetext: function(el, renderResult) {
			return Validators._checkLength(el || this, renderResult, function(a) {
				return byteLen(getValue(a));
			}, "text");
		},

		/** 
		 * ���ı�������֤
		 * @method richtext
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		richtext: function(el, renderResult) {
			return Validators._checkLength(el || this, renderResult, function(a) {
				var s = getValue(a);
				if (a.getAttribute("ignoreTag")) return s.replace(/<img[^>]*>/g, "a").replace(/<[^>]*>/g, "").length;
				else return s.length;
			}, "richtext");
		},
		/** 
		 * ���֤������֤
		 * @method idnumber
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		idnumber: function(el, renderResult) {
			Utils.prepare4Vld(el);
			Utils.dbc2sbcValue(el);
			var val = getValue(el);
			var isOk = (val == "");
			if (!isOk) {
				if ((/^\d{15}$/).test(val)) {
					isOk = true; 
				} else if ((/^\d{17}[0-9xX]$/).test(val)) {
					var vs = "1,0,x,9,8,7,6,5,4,3,2".split(","),
						ps = "7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2".split(","),
						ss = val.toLowerCase().split(""),
						r = 0;
					for (var i = 0; i < 17; i++) {
						r += ps[i] * ss[i];
					}
					isOk = (vs[r % 11] == ss[17]);
				}
			}
			if (renderResult != false) Valid.renderResult(el, isOk, !isOk && Msgs.getMsg(el, "_idnumber"));
			return isOk;
		},
		/** 
		 * ����������֤
		 * @method cnname
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		cnname: function(el, renderResult) {
			Utils.prepare4Vld(el);
			var val = getValue(el);
			var isOk = (val == "");
			if (!isOk) {
				isOk = byteLen(val) <= 32 && /^[\u4e00-\u9fa5a-zA-Z.\u3002\u2022]{2,32}$/.test(val);

			}
			if (renderResult != false) Valid.renderResult(el, isOk, !isOk && Msgs.getMsg(el, "_cnname"));
			return isOk;
		},

		/** 
		 * ���ٴ����롱��֤
		 * @method reconfirm
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		reconfirm: function(el, renderResult) {
			Utils.prepare4Vld(el);
			var oriEl = g(el.getAttribute("reconfirmFor"));
			var isOk = (getValue(el) == getValue(oriEl));
			if (renderResult != false) Valid.renderResult(el, isOk, !isOk && Msgs.getMsg(el, "_reconfirm"));
			return isOk;
		},

		/** 
		 * ͼƬ�ļ���֤
		 * @method imgfile
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		imgfile: function(el, renderResult) {
			var val = getValue(el);
			var isOk = (val == "");
			if (!isOk) {
				var fExt = val.substring(val.lastIndexOf(".") + 1);
				isOk = (/^(jpg|jpeg|png|gif|tif|bmp)$/i).test(fExt);
			}
			if (renderResult != false) Valid.renderResult(el, isOk, !isOk && Msgs.getMsg(el, "_imgfile"));
			return isOk;
		},

		/** 
		 * ������ʽ��֤
		 * @method reg
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		reg: function(el, renderResult, pattern, msg, ignoreDBC) {
			if (ignoreDBC) Utils.dbc2sbcValue(el);
			Utils.prepare4Vld(el);
			var val = getValue(el);
			var isOk = (val == "");
			if (!isOk) {
				msg = msg || "_regexp";
				pattern = pattern || getAttr2(el, "reg-pattern");
				if ('string' == typeof pattern) {
					pattern.replace(/^\/(.*)\/([ig]*)$/g, function(a, b, c) {
						pattern = new RegExp(b, c || '');
					});
				}
				isOk = pattern.test(val);
			}
			if (renderResult != false) Valid.renderResult(el, isOk, !isOk && Msgs.getMsg(el, msg));
			return isOk;
		},

		/** 
		 * ����datatype��֤
		 * @method magic
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @param {string} pattern ����datatype���ʽ���� "mobile || phone"
		 * @return {boolean}  
		 */
		magic: function(el, renderResult, pattern) {
			Utils.prepare4Vld(el);
			pattern = pattern || getAttr2(el, 'magic-pattern');
			var isOk = (getValue(el) == "" || !pattern);
			if (!isOk) {
				var opts = {
					el: el,
					Validators: Validators
				};
				var sJs = pattern.replace(/(\w+)/ig, 'opts.Validators.datatype(opts.el,false,"$1")'); //ע�⣺������û������dataType�������п��ܻ�ע�롣----to be fixed
				isOk = evalExp(sJs, opts);
			}
			if (renderResult != false) Valid.renderResult(el, isOk, !isOk && Msgs.getMsg(el, '_magic'));
			return isOk;
		},

		/** 
		 * �Զ���datatype��֤
		 * @method uv
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		uv: function(el, renderResult) {
			if (el.onblur && !el.onblur()) return false;
			return true;
		},
		/** 
		 * �򵥷ǿ���֤
		 * @method notempty
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @return {boolean}  
		 */
		notempty: function(el) {
			Utils.prepare4Vld(el);
			return !!getValue(el);
		},
		/** 
		 * ����required��֤
		 * @method magic
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @param {string} reqlogic ����required���ʽ
		 * @return {boolean}  
		 */
		logicrequired: function(el, renderResult, reqlogic) {
			el = el || this;
			reqlogic = reqlogic || getAttr2(el, "reqlogic");
			var reqAttr = Valid._curReqAttr || Valid.REQATTR,
				sReq = getAttr2(el, reqAttr),
				opts = {
					el: el,
					Validators: Validators
				},
				sJs = reqlogic.replace(/\$([\w\-]+)/ig, 'opts.Validators.notempty(g("$1"))').replace(/this/ig, "opts.Validators.notempty(opts.el)"); //ע�⣺������û������dataType�������п��ܻ�ע�롣----to be fixed
			var isOk = evalExp(sJs, opts);
			if (renderResult != false) Valid.renderResult(el, isOk, !isOk && sReq.indexOf(" ") == 0 ? sReq.substr(1) : tmpl(Msgs["_logicrequired"], [sReq]));
			return !!isOk;
		}
	}, {
		/** 
		 * ʱ����֤
		 * @method magic
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		time: function(el, renderResult) {
			return Validators.reg(el, renderResult, /^(([0-1]\d)|(2[0-3])):[0-5]\d:[0-5]\d$/, "_time", true);
		},
		//ʱ��
		/** 
		 * ʱ����֤
		 * @method minute
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		minute: function(el, renderResult) {
			return Validators.reg(el, renderResult, /^(([0-1]\d)|(2[0-3])):[0-5]\d$/, "_minute", true);
		},
		//����
		/** 
		 * �����ʼ�
		 * @method email
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		email: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, "_email", true);
		},
		/** 
		 * �ֻ���
		 * @method mobilecode
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		mobilecode: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^(13|15|18|14)\d{9}$/, "_mobilecode", true);
		},
		/** 
		 * �����ŵ绰����
		 * @method phone
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		phone: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^0(10|2\d|[3-9]\d\d)[1-9]\d{6,7}$/, "_phone", true);
		},
		//�����ֻ��ĵ绰��
		/** 
		 * �����ŵ绰����
		 * @method phone
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		phonewithext: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^0(10|2\d|[3-9]\d\d)[1-9]\d{6,7}(-\d{1,7})?$/, "_phonewithext", true);
		},
		//���ֻ��ĵ绰��
		/** 
		 * �绰����
		 * @method phonezone
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		phonezone: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^0(10|2\d|[3-9]\d\d)$/, "_phonezone", true);
		},
		/** 
		 * �绰����
		 * @method phonecode
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		phonecode: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^[1-9]\d{6,7}$/, "_phonecode", true);
		},
		/** 
		 * �ֻ���
		 * @method phoneext
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		phoneext: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^\d{1,6}$/, "_phoneext", true);
		},
		/** 
		 * �ʱ�
		 * @method zipcode
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		zipcode: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^\d{6}$/, "_zipcode", true);
		},
		/** 
		 * �ʱ�
		 * @method vcode
		 * @static
		 * @param {Element} el ��Ԫ��
		 * @param {boolean} renderResult �Ƿ񽫽��չʾ
		 * @return {boolean}  
		 */
		vcode: function(el, renderResult) {
			return Validators.reg(el || this, renderResult, /^\w{4}$/, "_vcode", true);
		}
	}]);

	QW.provide('Valid', Valid);

}());




//----valid_youa.js
/**	
 * @class Valid Valid form��֤
 * @namespace QW
 * @singleton 
 */
(function() {
	var Valid = QW.Valid,
		Validators = Valid.Validators,
		NodeH = QW.NodeH,
		g = NodeH.g,
		getAttr2 = function(el, attr) {
			return el.getAttribute(attr);
		},
		addClass = NodeH.addClass,
		removeClass = NodeH.removeClass,
		replaceClass = NodeH.replaceClass,
		show = NodeH.show,
		hide = NodeH.hide,
		getValue = NodeH.getValue,
		createElement = function(tag, opts) {
			opts = opts || {};
			var el = document.createElement(tag);
			for (var i in opts) el[i] = opts[i];
			return el;
		};
	/*
	 * _getHintEl: �õ�hintEl���������/�뿪ʱ��toggleClass('hint-dark', 'hint'); 
	 */
	Valid._getHintEl = function(el) {
		var hintEl = getAttr2(el, "hintEl");
		return hintEl && g(hintEl);
	};
	/*
	 * _getPlaceHolderEl: �õ�placeHolderEl����placeHolderЧ��Ԫ��
	 */
	Valid._getPlaceHolderEl = function(el) {
		var hintEl = getAttr2(el, "placeHolderEl");
		return hintEl && g(hintEl);
	};
	/*
	 * _getEmEl: �õ���ʾem�����ҹ������Ȳ���emEl���ԣ��ٴ�֮�����ĸ�nextSibling���ڵ�em���ٴ�֮����parentNode���ĸ�nextSibling���ڵ�em
	 */
	Valid._getEmEl = function(el) {
		var em = getAttr2(el, "emEl");
		if (em) return g(em);
		var refEls = [el, el.parentNode];
		for (var i = 0; i < 2; i++) {
			var tempEl = refEls[i];
			for (var j = 0; j < 5; j++) {
				tempEl = tempEl.nextSibling;
				if (!tempEl) break;
				if (tempEl.tagName == "EM") return tempEl;
			}
		}
		return null;
	};
	/*
	 * _getErrEmEl: ������ȷem,�ҵ�����em,�Ҳ����ͷ���null.
	 */
	Valid._getErrEmEl = function(okEm, autoCreate) {
		var errEm = okEm.nextSibling;
		if (errEm) {
			if (errEm.tagName == "EM" || !errEm.tagName && (errEm = errEm.nextSibling) && errEm.tagName == "EM") return errEm;
		}
		if (!autoCreate) return null;
		errEm = createElement('em', {
			className: 'error'
		});
		okEm.parentNode.insertBefore(errEm, okEm.nextSibling);
		return errEm;
	};


	Valid.onhint = function(ce) {
		var el = ce.target;
		if (!el || 'INPUT,TEXTAREA,SELECT,BUTTON,OBJECT'.indexOf(el.tagName) == -1) return; //IE�£�onfocusin����div��Ԫ�ش��� 
		var hintEl = Valid._getHintEl(el),
			placeHolderEl = Valid._getPlaceHolderEl(el);
		hintEl && replaceClass(hintEl, 'hint-dark', 'hint');
		if (placeHolderEl) {
			clearTimeout(el.__placeholderTimer || 0);
			addClass(placeHolderEl, 'placeholder-dark');
		}
		if (!Validators.required(el, false) && !getValue(el)) return; //������ڿ���ʾ������뽹��ʱ��������ʾ
		if (!Validators.datatype(el, false)) Validators.datatype(el, true); //ֻ�в�ͨ��datatype��֤ʱ������Ҫ�ڽ������ʱ��֤
	};
	Valid.onblur = function(ce) {
		var el = ce.target;
		if (!el || 'INPUT,TEXTAREA,SELECT,BUTTON,OBJECT'.indexOf(el.tagName) == -1) return; //IE�£�onfocusin����div��Ԫ�ش��� 
		var hintEl = Valid._getHintEl(el),
			placeHolderEl = Valid._getPlaceHolderEl(el);
		hintEl && replaceClass(hintEl, 'hint', 'hint-dark');
		Validators.datatype(el, true); //�뿪ʱֻ��datatypeУ��
		if (placeHolderEl) {
			(getValue(el) ? addClass : removeClass)(placeHolderEl, 'placeholder-dark');
			clearTimeout(el.__placeholderTimer || 0);
			el.__placeholderTimer = setTimeout(function() { //��360������£�autocomplete����blur֮��N�ٺ���֮����change
				(getValue(el) ? addClass : removeClass)(placeHolderEl, 'placeholder-dark');
			}, 600);
		}
	};
	Valid.onpass = function(ce) {
		var el = ce.target,
			okEm = Valid._getEmEl(el);
		removeClass(el, "error");
		if (okEm) {
			if ((okEm.__vld_fail_stamp | 0) != Valid.checkAll_stamp)  {//��Ҫrender
				show(okEm);
				var errEmEl = Valid._getErrEmEl(okEm);
				errEmEl && hide(errEmEl);
			}
		}
	};
	Valid.onfail = function(ce) {
		var el = ce.target,
			errMsg = ce.errMsg;
		addClass(el, "error");
		el.__vld_errMsg = errMsg;
		var okEm = Valid._getEmEl(el);
		if (okEm) {
			if ((okEm.__vld_fail_stamp | 0) != Valid.checkAll_stamp) { //��Ҫrender
				hide(okEm);
				var errEm = Valid._getErrEmEl(okEm, true);
				errEm.innerHTML = errMsg;
				show(errEm);
			}
			if (Valid.isChecking) {
				okEm.__vld_fail_stamp = Valid.checkAll_stamp;
			}
		}
	};

	var placeHolder_idx = 10000;
	Valid.oninitall = function(ce) {
		setTimeout(function() { //������ʱһ��
			if('placeholder' in document.createElement('input')){ //��������ԭ��֧��placeholder
				return ;
			}
			QW.NodeW('input,textarea', ce.target).forEach(function(el) {
				var placeholder = el.getAttribute('placeholder'),
					placeHolderEl = Valid._getPlaceHolderEl(el);
				if (placeholder && !placeHolderEl) {
					var placeHolderElId = 'placeHolder-' + placeHolder_idx++;
					placeHolderEl = createElement('span', {
						id: placeHolderElId,
						innerHTML: placeholder,
						className: 'placeholder'
					});
					placeHolderEl.onclick = function() {
						try {
							el.focus();
						} catch (ex) {}
					};
					el.parentNode.insertBefore(placeHolderEl, el);
					el.setAttribute('placeHolderEl', placeHolderElId);
				}
				if (placeHolderEl) {
					if ((getValue(el) || '').trim() || el==document.activeElement) {
						addClass(placeHolderEl, 'placeholder-dark');
					} else {
						removeClass(placeHolderEl, 'placeholder-dark');
					}
				}
			});
		}, 10);
	};
	/**
	 *�󶨵绰����/�绰����/�ֻ���/�ֻ���
	 * @method bindPhoneEls
	 * @param {Json} opts - ��group Json.Ŀǰ֧����������
	 ids:['telN1','telN2','telN3']	//����id������Ϊ:�绰���ţ��绰���룯�ֻ��ţ�Ҳ�������ĸ�Ԫ�أ����ĸ�Ԫ��Ϊ�ֻ���
	 reqMsgs:[' ������绰���š�','������绰���롣','',' �绰�������ֻ�������дһ�']		//----��������ʱ����ʾ��Ϣ
	 * @return {void} 
	 */
	Valid.bindPhoneEls = function(opts) {
		var dataTypes = ['phonezone', 'phonecode', 'phoneext', 'mobilecode'],
			maxLengths = [4, 8, 4, 11],
			defaultReqMsgs = [' ������绰���š�', ' ������绰���롣', '', ' �绰�������ֻ�������дһ�'],
			reqMsgs = opts.reqMsgs || defaultReqMsgs,
			ids = opts.ids;
		for (var i = 0; i < ids.length; i++) {
			QW.NodeW.g(ids[i]).attr('reqMsg', reqMsgs[i] || defaultReqMsgs[i]).attr('dataType', dataTypes[i]).set('maxLength', maxLengths[i]);
		}
		g(ids[0]).setAttribute('reqlogic', '(!$' + ids[1] + ' && !$' + ids[2] + ') || $' + ids[0]);
		g(ids[1]).setAttribute('reqlogic', '(!$' + ids[0] + ' && !$' + ids[2] + ') || $' + ids[1]);
		if (ids.length == 4) {
			g(ids[3]).setAttribute('reqlogic', '$' + ids[0] + ' || $' + ids[1] + '|| $' + ids[2] + '|| $' + ids[3]);
		}
	};

	QW.DomU.ready(function() {
		Valid.initAll();
	});
}());