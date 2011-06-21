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