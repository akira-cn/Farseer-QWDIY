(function() {
	var mix = QW.ObjectH.mix,
		DomU = QW.DomU,
		createElement = DomU.createElement,
		EventH = QW.EventH,
		target = EventH.getTarget,
		keyCode = EventH.getKeyCode,
		preventDefault = EventH.preventDefault,
		CustEvent = QW.CustEvent,
		NodeH = QW.NodeH,
		addClass = NodeH.addClass,
		removeClass = NodeH.removeClass,
		setStyle = NodeH.setStyle,
		getXY = NodeH.getXY,
		ancestorNode = NodeH.ancestorNode,
		on = QW.EventTargetH.addEventListener,
		isIe = (/msie/i).test(navigator.userAgent);

	function encode4Html(s) {
		var o = [/&/g, /"/g, /'/g, /</g, />/g];
		var n = ["&amp;", "&quot;", "&#039;", "&lt;", "&gt;"];
		for (var i = 0; i < o.length; i++) {
			s = s.replace(o[i], n[i]);
		}
		return s;
	}

	/**
	 *@class ComboBox ������������ 
	 */
	function ComboBox(opts) {
		mix(this, opts, 1);
		if (!this.lazyRender) this.render();
	}

	ComboBox.EVENTS = ["enter", "selectitem"];

	ComboBox.prototype = {
/*
		*����
		*/
		width: 0,
		oText: null,
		//text-input����
		itemsData: null,
		//items���ݣ�array����Ҫ��refreshData�����������ֵ
		minFilterLen: 1,
		//��Сfilter���ȡ���oText.value��С�ڴ�ֵʱ���Ż���suggestЧ��
/*
		*���ŵı�����readOnly��
		*/
		oMenu: null,
		oToolbar: null,
		//�����У�Ŀǰֻ�йرհ�ť
		oWrap: null,
		selectedIndex: -1,
		//��ǰѡ����
		filteredValue: "",
		//����ֵ�����˶��������
		filteringValue: "",
		//����ֵ�����˶������ڽ��У���Ϊ��ʱ�������첽�ģ�
		acValue: "",
		//ͨ���Զ���ɵõ���ֵ 
		disabled: false,
		//suggest�Ƿ��ڽ�ֹ״̬��������ҳ���߼�����
		closed: false,
		//suggest�Ƿ��ڹر�״̬��������suggest�������
/*
		*����
		*/
		show: function() {
			if (this.oMenu.rows.length) {
				var xy = getXY(this.oText);
				setStyle(this.oWrap, {
					top: xy[1] + this.oText.offsetHeight + "px",
					left: xy[0] + "px",
					display: ""
				});
			}
		},
		hide: function() {
			this.oWrap.style.display = "none";
		},
		refreshItems: function() {
			var me = this;
			var data = me.itemsData;
			if (data && !data.__isItemsDataRendered) { //�������ԡ�__isItemsDataRendered���Ա�־data�Ƿ��Ѿ�render��html
				var html = [];
				for (var i = 0; i < data.length; i++) {
					var dataType = data[i].constructor;
					if (dataType == String) { //ΪStringʱ�����ַ�������value��Ҳ��html
						html.push('<tr acValue="' + encode4Html(data[i]) + '"><td>' + encode4Html(data[i]) + '</td></tr>');
					} else if (dataType == Array) { //ΪArrayʱ�����һ��Ԫ��Ϊvalue���ڶ���Ԫ��Ϊhtml
						html.push('<tr acValue="' + encode4Html(data[i][0]) + '"><td>' + data[i][1] + '</td></tr>');
					} else { //ΪObjectʱ�������ʽΪ{value:"aaab",html:"<b>aaa</b>b"}
						html.push('<tr acValue="' + encode4Html(data[i].value) + '"><td>' + data[i].html + '</td></tr>');
					}
					html.push("</tr>");
				}
				me._setMenuInnerHtml(html.join("").replace(/(<\w+)/g, '$1 unselectable="on"'));
				if (data.length) me.show();
				else me.hide();
				me.filteredValue = me.filteringValue;
				me.acValue = "";
				me.selectedIndex = -1;
				data.__isItemsDataRendered = true;
			}
		},
		refreshData: function() {
			this.itemsData = ["refreshDataһ��Ҫ��д��"];
		},
		setSelectedIndex: function(idx, needBlur) {
			var me = this;
			var rows = me.oMenu.rows;
			if (rows.length) {
				if (me.selectedIndex > -1) removeClass(rows[me.selectedIndex], "selected");
				idx = (idx + rows.length + 1) % (rows.length + 1);
				if (idx == rows.length) {
					me.acValue = me.oText.value = me.filteringValue; //������filteringValue��������filteredValue������Ϊ��ʱitemsData�Ǿ�̬�ģ����磬���ù��˹��ܵĵ���ComboBox��
					idx = -1;
				} else {
					me.acValue = me.oText.value = rows[idx].getAttribute("acValue");
					addClass(rows[idx], "selected");
				}
			} else {
				idx = -1;
			}
			me.selectedIndex = idx;
		},
		_setMenuInnerHtml: function(html) {
			var div = createElement("div", {
				innerHTML: "<table>" + html + "</table>"
			});
			var rows = div.firstChild.rows;
			var oMenu = this.oMenu;
			for (var i = oMenu.childNodes.length - 1; i >= 0; i--) oMenu.removeChild(oMenu.childNodes[i]);
			while (rows.length) {
				oMenu.appendChild(rows[0]);
			}
		},
		render: function() {
			var me = this;
			if (me._rendered) return;
			me._rendered = true;
			CustEvent.createEvents(me, ComboBox.EVENTS);
			var oWrap = createElement("div", {
				className: "ac_wrap",
				innerHTML: (isIe ? '<iframe class="ac_bgIframe"></iframe>' : '') + '<div class=ac_wrap_inner><div class=ac_menu_ctn><table cellspacing=0><tbody class=ac_menu></tbody></table></div><table><tbody class=ac_toolbar><tr><td><a href=# class=close>�ر�</a></div></td></tr></tbody></table></div>'.replace(/(<\w+)/g, '$1 unselectable="on"')
			});
			var b = document.body;
			b.insertBefore(oWrap, b.firstChild);
			var els = oWrap.getElementsByTagName("tbody");
			var oText = me.oText,
				oToolbar = me.oToolbar = els[1],
				oMenu = me.oMenu = els[0];
			oText.setAttribute("autoComplete", "off"); //һ��Ҫ��setAttrubute������ᵼ����firefox�������״̬��ִ��oText.blur()ʱ���׳��޷���׽���쳣��
			var w = (me.width || me.oText.offsetWidth) + "px";
			if (isIe) oWrap.style.width = w;
			else oWrap.style.minWidth = w;
			me.oWrap = oWrap;
			me.hide();
			on(me.oText, "dblclick", function(e) { //���oText���¼�
				if (me.disabled || oText.value.length < me.minFilterLen) return;
				if (me.closed = !me.closed) me.hide();
				else me.show();
			});
			on(me.oText, "keydown", function(e) { //���oText���¼�
				if (me.disabled) return;
				var kCode = keyCode(e);
				var dir = 0;
				switch (kCode) {
				case 40:
					dir = 1;
					break;
				case 38:
					dir = -1;
					break;
				case 27:
					if (!me.closed) {
						me.hide();
						me.closed = true;
						preventDefault(e);
					}
					break; //����suggest
				case 13:
					me.hide();
					me.fire('enter');
					break; //����suggest
				}
				if (dir && oText.value.length >= me.minFilterLen) {
					preventDefault(e);
					if (oWrap.style.display == "none") {
						me.show();
						me.closed = false;
					} else {
						me.setSelectedIndex(me.selectedIndex + dir);
					}
				}
			});
			on(me.oText, "focus", function(e) { //���oText���¼�
				if (me.disabled) return;
				if (me._refreshTimer) clearInterval(me._refreshTimer);
				me._refreshTimer = setInterval(function() {
					var val = oText.value;
					if (val.length < me.minFilterLen) {
						me.acValue = me.filteringValue = me.filteredValue = "";
						me.hide();
						me.closed = false; //����google suggest�Ĳ��ԣ����suggest���رգ��û���oText��գ���ʱ�Ὣsuggest�򿪡�
					} else if (!me.closed) {
						if (val != me.filteredValue && val != me.filteringValue && val != me.acValue) {
							me.filteringValue = val;
							me.refreshData();
						}
						if (me.itemsData) {
							me.refreshItems();
						}
					}
				}, 100);
			});
			on(me.oText, "blur", function(e) { //���oText���¼�
				me.hide();
				clearInterval(me._refreshTimer);
			});
			oWrap.onmousedown = function(e) { //���oWrap���¼�
				if (isIe) {
					oText.setCapture();
					setTimeout(function() {
						oText.releaseCapture();
					}, 10);
				} //�����IE�£�������״̬ʱ���ܵ��ѡ�������
				preventDefault(e);
			};
			oMenu.onclick = function(e) { //���oMenu���¼�
				var el = target(e);
				var tr = ancestorNode(el, "TR");
				if (tr) {
					oText.blur(); //Firefox�°����뷨����ʱ��ѡ��item��console�д��޷�catch�����Ҳ�Ӱ�����С�
					setTimeout(function() {
						oText.focus();
					}, 10); //�����������״̬ʱ���ܵ��ѡ�������
					me.setSelectedIndex(tr.rowIndex, true);
					me.hide();
					me.fire('selectitem');
				}
			};
			oMenu.onmouseover = function(e) { //���oMenu���¼�
				var el = target(e);
				var tr = ancestorNode(el, "TR");
				if (tr) addClass(tr, "mouseover");
			};
			oMenu.onmouseout = function(e) { //���oMenu���¼�
				var el = target(e);
				var tr = ancestorNode(el, "TR");
				if (tr) removeClass(tr, "mouseover");
			};
			oToolbar.getElementsByTagName("a")[0].onclick = function(e) { //���close��ť���¼�
				me.closed = true;
				me.hide();
				preventDefault(e);
			};
		}
	};

	QW.provide('ComboBox', ComboBox);
}());