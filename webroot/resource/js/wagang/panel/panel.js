/*
 * @QWrap
 * @author: JK(JK_10000@yahoo.com.cn)
 * @create-date : 2008-10-27
 * @remark: ���ִ�������Baidu C2C,��л
 */




(function() {


	var mix = QW.ObjectH.mix,
		remove = QW.ArrayH.remove,
		format = QW.StringH.format,
		ie6 = QW.Browser.ie6,
		DomU = QW.DomU,
		createElement = DomU.createElement,
		getDocRect = DomU.getDocRect,
		NodeH = QW.NodeH,
		on = QW.EventTargetH.addEventListener,
		un = QW.EventTargetH.removeEventListener,
		fire = NodeH.fire,
		hide = NodeH.hide,
		setStyle = NodeH.setStyle,
		getXY = NodeH.getXY,
		setCenter = function(el, w, h, x, y) {
			var rect = DomU.getDocRect();
			if (x == null) x = (rect.width - w) / 2 + rect.scrollX;
			x = Math.max(Math.min(x, rect.scrollX + rect.width - w), rect.scrollY);
			if (y == null) y = (rect.height - h) / 2 + rect.scrollY;
			y = Math.max(Math.min(y, rect.scrollX + rect.height - h), rect.scrollY);
			NodeH.setXY(el, x, y);
		},
		contains = NodeH.contains,
		removeNode = NodeH.removeNode,
		EventH = QW.EventH,
		target = EventH.getTarget,
		keyCode = EventH.getKeyCode,
		preventDefault = EventH.preventDefault,
		CustEvent = QW.CustEvent;


	/**
	 * IPanel: Panel�Ľӿڣ��乹�캯���Ĳ���Ϊһ��json����
	 QW.IPanel=function(opts){};
	 QW.IPanel.prototype={
	 oWrap:"el",
	 keyEsc:"bl",
	 withMask:"bl",
	 posCenter:"bl",
	 posAdjust:"bl",
	 isVisible:"bl",
	 render:function(){},
	 show:function(x, y, w, h, el){},//����boolean���Ƿ�ɹ�ִ��show
	 hide:function(){},//����boolean���Ƿ�ɹ�ִ��hide
	 dispose:function(){}
	 }
	 */

	/**
	 * PanelManager:Panel�Ĺ���������ֻ��panel.oWrap��oMask������ʾ���صĹ���
	 */
	var PanelManager = {
		VERSION: "0.0.1"
	};

	(function() {

		var zIdx = 100;
		var vPnls = [];
		var oMask, maskInterval = 0;

		function createMask() {
			var el = createElement("div", {
				className: "mask",
				tabIndex: -1,
				unselectable: "on"
			});
			if (ie6) {
				el.innerHTML = '<div unselectable="on"></div><iframe src="' + PanelManager.bgIframeSrc + '"></iframe>';
			}
			document.body.insertBefore(el, document.body.firstChild);
			return el;
		}

		function adjustMask() {
			var bd = oMask.offsetParent,
				de = document.documentElement,
				stl = oMask.style;
			if (parseInt(stl.top) != bd.scrollTop || parseInt(stl.left) != bd.scrollLeft) {
				stl.top = bd.scrollTop;
				stl.left = bd.scrollLeft;
			}
			if (de.clientHeight != oMask.offsetHeight) {
				stl.height = de.clientHeight;
			}
			if (de.clientWidth != oMask.offsetWidth) {
				stl.width = de.clientWidth;
			}
		}

		function refreshObserve(panel) { //���»�����¼����
		
			if (panel.keyEsc) {
				un(document, "keydown", PanelManager.keydownHdl);
				on(document, "keydown", PanelManager.keydownHdl);
			}
		}
		mix(PanelManager, {
			showPanel: function(panel, x, y, w, h, el) {
				if (panel._rendered) panel.render();
				remove(vPnls, panel);
				vPnls.push(panel);
				var style = panel.oWrap.style;
				if (panel.isVisible) {
					if (style.zIndex != zIdx) {
						style.zIndex = (zIdx += 2);
					}
				} else {
					style.zIndex = (zIdx += 2);
				}
				if (panel.withMask) {
					oMask = oMask || createMask();
					setStyle(oMask, {
						zIndex: zIdx - 1,
						display: "block"
					});
					if (ie6) {
						adjustMask(oMask);
						clearInterval(maskInterval);
						maskInterval = setInterval(adjustMask, 1000);
					}
				}
				//���/��
				if (w != null) {
					style.width = w + "px";
				}
				if (h != null) {
					style.height = h + "px";
				}
				//��λ��
				if (panel.posCenter) {
					var wh = PanelManager.getWrapSize(panel); //�õ�ʵ�ʴ�С
					setCenter(panel.oWrap, wh[0], wh[1], x, y);
				} else {
					x = x || 0;
					y = y || 0;
					if (el) {
						var xy = getXY(el);
						x += xy[0];
						y += xy[1];
					}
					if (panel.posAdjust) {//���������û��ȫ����ʾ���������λ��
						var wh = PanelManager.getWrapSize(panel); //�õ�ʵ�ʴ�С
						var rect = getDocRect();
						x = Math.min(x, rect.scrollX + rect.width - wh[0]);
						x = Math.max(x, rect.scrollX);
						y = Math.min(y, rect.scrollY + rect.height - wh[1]);
						y = Math.max(y, rect.scrollY);
					}
					style.left = x + "px";
					style.top = y + "px";
				}
				if ((panel.posAdjust || panel.posCenter) && vPnls.length > 1) {//��������panel�ص�
				
					var prevPS = vPnls[vPnls.length - 2].oWrap.style;
					if (prevPS.top == style.top && prevPS.left == style.left) {
						style.top = (parseInt(style.top) + 10) + "px";
						style.left = (parseInt(style.left) + 10) + "px";
					}
				}
				style.display = "block";
				panel.isVisible = true;
				refreshObserve(panel);
			},
			hidePanel: function(panel) {
				hide(panel.oWrap);
				panel.isVisible = false;
				remove(vPnls, panel);
				var needMask = false;
				for (var i = vPnls.length - 1; i > -1; i--) {
					var pnl = vPnls[i];
					if (pnl.withMask) {
						needMask = true;
						oMask.style.zIndex = pnl.oWrap.style.zIndex - 1;
						break;
					}
				}
				if (!needMask && oMask) {
					hide(oMask);
					clearInterval(maskInterval);
				}
			},
			disposePanel: function(panel) {
				removeNode(panel.oWrap); //JK��IE6�»����ڴ�й©��(�������¼��󶨵�Ԫ�أ����ֶ��Ƴ����Ļ������ڴ�й©����)
				//DomU.sendTrash(panel.oWrap)
				for (var i in panel) panel[i] = null;
				//if('function'==typeof CollectGarbage)CollectGarbage();
			},
			risePanel: function(panel) { //����ж��panel�ɼ�������ǰpanel�ᵽ���ϲ�
			
				if (panel.isVisible) {
					var style = panel.oWrap.style;
					if (style.zIndex != zIdx) {
						style.zIndex = (zIdx += 2);
						remove(vPnls, panel);
						vPnls.push(panel);
						if (panel.withMask) {
							var sMask = oMask.style;
							sMask.zIndex = zIdx - 1;
						}
					}
				} else {
					alert("�������.");
					throw "���󣺻�û�д�panel��.";
				}
			},

			keydownHdl: function(e) {//document onkeydown
				if (vPnls.length && keyCode(e) == EventH.KEY_ESC) {
					var pnl = vPnls[vPnls.length - 1];
					if (pnl.keyEsc) {
						pnl.hide();
						preventDefault(e);
					}
				}
				if (!vPnls.length) un(document, "keydown", PanelManager.keydownHdl);
			},
			getWrapSize: function(panel, w, h) {
				var oWrap = panel.oWrap,
					style = oWrap.style;
				var oldS = [style.display, style.width, style.height];
				style.display = "block";
				if (w) style.width = w;
				if (h) style.height = h;
				var size = [oWrap.offsetWidth, oWrap.offsetHeight];
				style.display = oldS[0];
				if (oldS[1]) style.width = oldS[1];
				if (oldS[2]) style.height = oldS[2];
				return size;
			},
			bgIframeSrc: "about:blank" //'+QW.JSPATH+'util/panel/assets/Blank.html';//�ڱ�Ҫ��ʱ������https��Ҫ��Blank.htmlҳ�棬���ƹ���ȫ���
		});
	}());



	/** 
	 * BasePanel: Ƕ���.
	 * @version: 0.0.1
	 */

	function BasePanel(opts) {
		mix(this, opts, 1);
		if (!this.lazyRender) this.render();
		return this;
	}

	(function() {
		BasePanel.EVENTS = ["beforeshow", "aftershow", "beforehide", "afterhide"];

		function setInner(el, sub) {
			sub = sub || "";
			if (sub.tagName) {
				el.innerHTML = "";
				el.appendChild(sub);
			} else {
				el.innerHTML = sub;
			}
		}

		BasePanel._elHtml = {
			content: '<div class="panel-content" remark="oContent"><div class="hd"></div><div class="bd"></div><div class="ft"></div></div>',
			closeHdl: '<span class="close"></span>',
			resizeHdl: '<span class="resize"><span></span></span>',
			corner1: '<span class="co1"><span></span></span>',
			corner2: '<span class="co2"><span></span></span>',
			cue: '<span class="cue"></span>',
			shadow: '<span class="sd"></span>',
			bgIframe: '<iframe class="panel-iframe" src="' + PanelManager.bgIframeSrc + '" FRAMEBORDER=0 height="100%"></iframe>'
		};


		BasePanel.prototype = {
			defaultClassName: "panel",
			//����
			wrapId: "",
			className: "",
			title: "",
			header: "",
			body: "Panel Body",
			footer: "",
			withCorner: 0,
			withCue: 0,
			withShadow: 0,
			withClose: 0,
			withBgIframe: ie6,
			withMask: 0,

			dragable: 0,
			resizable: 0,
			keyEsc: 0,
			posCenter: 0,
			posAdjust: 0,

			//public����
			isVisible: false,
			oWrap: null,
			oContent: null,
			oHeader: null,
			oBody: null,
			oFooter: null,
			oCloseHdl: null,
			oResizeHdl: null,
			oShadow: null,
			oCue: null,
			oCorner1: null,
			oCorner2: null,
			oBgIframe: null,

			/**
			 *render(): ��ʼ��
			 *@return {void}: 
			 */
			render: function() {
				var me = this;
				if (me._rendered) return;

				//render panel structure
				{
					var oWrap = createElement("div", {
						className: me.defaultClassName + " " + (me.className || "")
					});
					oWrap.style.display = "none";
					me.oWrap = oWrap;
					if (me.wrapId) oWrap.id = me.wrapId;
					hide(oWrap);
					var elHtml = BasePanel._elHtml;
					var html = [
						elHtml.content, me.withClose ? elHtml.closeHdl : "", 
						me.resizable ? elHtml.resizeHdl : "", 
						me.withCorner ? (elHtml.corner1 + elHtml.corner2) : "", 
						me.withCue ? elHtml.cue : "", 
						me.withShadow ? elHtml.shadow : "", 
						(me.withBgIframe && ie6) ? elHtml.bgIframe : ""
					];
					oWrap.innerHTML = html.join("");
					var els = oWrap.childNodes;
					me.oContent = els[0];
					var i = 1;
					if (me.withClose) {
						me.oCloseHdl = els[i++];
					}
					if (me.resizable) {
						me.oResizeHdl = els[i++];
					}
					if (me.withCorner) {
						me.oCorner1 = els[i++];
						me.oCorner2 = els[i++];
					}
					if (me.withCue) {
						me.oCue = els[i++];
					}
					if (me.withShadow) {
						me.oShadow = els[i++];
					}
					if (me.withBgIframe && ie6) {
						me.oBgIframe = els[i++];
					}
					var els = me.oContent.childNodes;
					me.oHeader = els[0];
					me.oBody = els[1];
					me.oFooter = els[2];

					me.isVisible = false;
				}
				//render arguments
				{
					var header = (me.title && "<h3>" + me.title + "</h3>") || me.header;
					if (header) setInner(me.oHeader, header);
					if (me.body) setInner(me.oBody, me.body);
					if (me.footer) setInner(me.oFooter, me.footer);
				}
				//observe events
				{
					if (me.withClose) {
						on(me.oCloseHdl, "click", function() {
							me.hide();
						});
					}
					if (me.dragable) {
						me.initDrag();
					}
					if (me.resizable) {
						me.initResize();
					}
				}
				document.body.insertBefore(oWrap, document.body.firstChild);
				CustEvent.createEvents(me, BasePanel.EVENTS);
				me._rendered = true;
			},
			/**
			 *show(x, y, w, h, el): ��ʾһ��panel
			 *@param {int} x: left������Ϊ��
			 *@param {int} y: top������Ϊ��
			 *@param {int} w: width�����oWrapû�п�ȣ������һ��������
			 *@param {int} h: height������Ϊ��
			 *@param {Element} el: λ�òο�Ԫ�ء�
			 *@return {boolean}: �Ƿ�˳��show������Ϊonbeforeshow�п�����ֹ��show��
			 */
			show: function(x, y, w, h, el) {
				if (this._rendered) this.render();
				if (this.fire('beforeshow') == false) return false;
				PanelManager.showPanel(this, x, y, w, h, el);
				this.fire('aftershow');
				return true;
			},
			/**
			 *hide(): ����һ��panel
			 *@return {boolean}: �Ƿ�˳��hide������Ϊonbeforehide�п�����ֹ��hide��
			 */
			hide: function() {
				if (this.fire('beforehide') == false) return false;
				PanelManager.hidePanel(this);
				this.fire('afterhide');
				return true;
			},
			/**
			 *dispose(): ����һ��panel
			 *@return {boolean}: �Ƿ�˳��dispose����ֻ�������ص�panel���ܱ����٣�
			 */
			dispose: function() {
				if (this.isVisible) return false;
				else PanelManager.disposePanel(this);
			},
			/**
			 *rise(): �ᵽ����
			 *@return {void}: 
			 */
			rise: function() {
				PanelManager.risePanel(this);
			},
			/**
			 *initDrag(): ��ʼ���϶�����Ĭ��ֵ
			 */
			initDrag: function() {
				var panel = this;
				var oDrag = new QW.SimpleDrag({
					oSrc: this.oWrap,
					oHdl: this.oHeader,
					minXAttr: 1,
					minYAttr: 1,
					withProxy: true
				});
				oDrag.on('dragstart', function() {
					panel.rise();
				});
				//this.oDrag=oDrag;//��һ��ᵼ��IE6�µ��ڴ�й©
			},
			/**
			 *initResize(): ��ʼ���϶�����Ĭ��ֵ
			 */
			initResize: function() {
				var panel = this;
				var oResize = new QW.SimpleResize({
					oSrc: this.oWrap,
					oHdl: this.oResizeHdl,
					minXAttr: 150,
					yFixed: true,
					withProxy: true
				});
				oResize.on('dragstart', function() {
					panel.rise();
				});
				//this.oResize=oResize;//��һ��ᵼ��IE6�µ��ڴ�й©
			}
		}
	}());

	/**
	 * LayerPopup: һ���ر��˵�BasePanel����ģ��window.pupup��
	 * ���BasePanel���һ��������{Array} relatedEls: ��ϵ���������ڵĵ�����ᵼ��popup��ʧ
	 */

	function LayerPopup(opts) {
		mix(this, opts, 1);
		if (!this.lazyRender) this.render();
		return this;
	}

	(function() {
		LayerPopup.MENTOR_CLASS = BasePanel;
		LayerPopup.prototype = {

			/**
			 * @public {HTMLElement||Array} relatedEls: �����element(s). �����е�keydown/mousedown���ᵼ��popup�Զ�hide.
			 * @type {String|HTMLElement}
			 * @default {���ַ���}
			 */
			posAdjust: 1,
			defaultClassName: "panel panel-popup",
			relatedEls: null,
			_refreshBlurHdl: function(keepObserving) {
				if (this._fnBlur) {
					un(document, "keydown", this._fnBlur);
					un(document, "keyup", this._fnBlur);
					un(document, "mousedown", this._fnBlur);
					if (keepObserving) {
						on(document, "keydown", this._fnBlur);
						on(document, "keyup", this._fnBlur);
						on(document, "mousedown", this._fnBlur);
					}
				}
			},
			show: function(x, y, w, h, el) {
				var me = this;
				if (me._rendered) me.render();
				me._fnBlur = me._fnBlur || function(e) {
					var el = target(e) || document.body; //JK:��ʱ�¼�����fireEvent��������ʱIE�Ҳ���target�����ԼӸ���||��
					if (!me.oWrap) return;
					var relatedEls = me.relatedEls || [];
					relatedEls.push(me.oWrap);
					for (var i = 0; i < relatedEls.length; i++) {
						var elI = relatedEls[i];
						if (elI == el || contains(elI, el)) return;
					}
					me.hide();
				};
				if (me.fire('beforeshow') == false) return false;
				PanelManager.showPanel(me, x, y, w, h, el);
				me._refreshBlurHdl(true);
				me.fire('aftershow');
				return true;
			},
			hide: function() {
				if (this.fire('beforehide') == false) return false;
				PanelManager.hidePanel(this);
				this._refreshBlurHdl(false);
				this.fire('afterhide');
				return true;
			}
		};
		mix(LayerPopup.prototype, BasePanel.prototype);
	}());


	/**
	 * LayerDialog: һ���ر��˵�BasePanel����ģ��window.showModalDialog������callback,��Ҫ���onafterhide�¼�.
	 */

	function LayerDialog(opts) {
		mix(this, opts, 1);
		if (!this.lazyRender) this.render();
		return this;
	}
	(function() {
		LayerDialog.MENTOR_CLASS = BasePanel;
		LayerDialog.prototype = {
			defaultClassName: "panel panel-dialog",
			withMask: 1,
			withClose: 1,
			dragable: !!QW.SimpleDrag
		};
		mix(LayerDialog.prototype, BasePanel.prototype);
	}());

	/**
	 * @static QW.Panel: ����һЩ�����������û�����.
	 * @param {json} opts: ������Ĳ���������֧��BasePanel�����в����⣬��֧�֣�
	 {int} width:���������ȣ�Ĭ��Ϊ300
	 {height} height: ������߶ȣ�����Ĭ��ֵ.
	 *QW.Panel.alert(msg,callback,opts);
	 *QW.Panel.confirm(msg,callback,opts);
	 *QW.Panel.prompt(msg,defaultValue,callback,opts);
	 *QW.Panel.msgbox(msg,callback,opts);
	 */
	var Panel = (function() {
		var bodyHtml = {
			alert: '<div class="panel-dialog-sys panel-alert cls"><div class="msg">{0}</div><div class="btn-ctn"><button>ȷ��</button></div></div>',
			confirm: '<div class="panel-dialog-sys panel-confirm cls"><div class="msg">{0}</div><div class="btn-ctn"><button>ȷ��</button><button>ȡ��</button></div></div>',
			prompt: '<div class="panel-dialog-sys panel-prompt cls"><div class="msg">{0}</div><div class="ipt-ctn"><input type="text-input"></div><div class="btn-ctn"><button>ȷ��</button><button>ȡ��</button></div></div>',
			msgbox: '<div class="panel-dialog-sys panel-msgbox cls"><div class="msg">{0}</div><div class="btn-ctn"><button>��(Yes)</button><button>��(No)</button><button>ȡ��</button></div></div>'
		};

		var Panel = {
			getSysDialog: function(type, msg, callback, opts) {
				opts = opts || {};
				mix(opts, {
					posCenter: 1,
					keyEsc: 1,
					title: "ϵͳ��ʾ",
					dragable: !!QW.SimpleDrag,
					body: format(bodyHtml[type] || "error", msg) //JK:����error��ʾ����������
				});
				var panel = new LayerDialog(opts);
				var btns = panel.oWrap.getElementsByTagName("button");
				panel.dialogButtons = btns;
				switch (type) {
				case "alert":
					on(btns[0], "click", function(e) {
						panel.hide();
					})
					break;
				case "confirm":
					on(btns[0], "click", function(e) {
						panel.returnValue = true;
						panel.hide();
					});
					on(btns[1], "click", function(e) {
						panel.hide();
					});
					panel.returnValue = false;
					break;
				case "prompt":
					var input = panel.oWrap.getElementsByTagName("input")[0];
					panel.dialogInput = input;
					on(input, "keydown", function(e) {
						if (keyCode(e) == EventH.KEY_ENTER) {
							setTimeout(function() {
								fire(btns[0], "click");
							}, 10);
						}
					}); //Opera��,������������,�ᴥ�����غ�����µ�button��onclick�¼�.
					on(btns[0], "click", function(e) {
						panel.returnValue = input.value;
						panel.hide();
					});
					on(btns[1], "click", function(e) {
						panel.hide();
					});
					break;
				case "msgbox":
					on(btns[0], "click", function(e) {
						panel.returnValue = true;
						panel.hide();
					});
					on(btns[1], "click", function(e) {
						panel.returnValue = false;
						panel.hide();
					});
					on(btns[2], "click", function(e) {
						panel.hide();
					});
					break;
				}
				panel.on('aftershow', function() {
					var el = (input || btns[0]);
					try {
						el.focus();
						el.select();
					} catch (ex) {}
				});
				panel.on('afterhide', function() {
					try {
						callback && callback(this.returnValue);
					} finally {}
				});
				return panel;
			},
			_sysDialog: function(type, msg, defaultValue, callback, opts) {
				opts = opts || {};
				var dlg = QW.Panel.getSysDialog(type, msg, callback, opts);
				if (type == "prompt") dlg.dialogInput.value = defaultValue || "";
				dlg.show(null, null, opts.width || 300, opts.height)
				//dlg.on('afterhide',function(){dlg.dispose();});
			},
			alert: function(msg, callback, opts) {
				QW.Panel._sysDialog("alert", msg, null, callback, opts)
			},
			confirm: function(msg, callback, opts) {
				QW.Panel._sysDialog("confirm", msg, null, callback, opts)
			},
			prompt: function(msg, defaultValue, callback, opts) {
				QW.Panel._sysDialog("prompt", msg, defaultValue, callback, opts)
			},
			msgbox: function(msg, callback, opts) {
				QW.Panel._sysDialog("msgbox", msg, null, callback, opts)
			}
		};
		return Panel;
	}());

	QW.provide({
		PanelManager: PanelManager,
		BasePanel: BasePanel,
		LayerPopup: LayerPopup,
		LayerDialog: LayerDialog,
		Panel: Panel
	});

}());