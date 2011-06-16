/*
 * @QWrap
 * @author: JK(JK_10000@yahoo.com.cn)
 * @create-date : 2008-10-18
 * @remark: ���ִ�������Baidu C2C,��л
 */
/*
 * Drag: �϶�
 * @version: 0.0.1
 */

(function() {

	var mix = QW.ObjectH.mix,
		lazyApply = QW.FunctionH.lazyApply,
		DomU = QW.DomU,
		createElement = DomU.createElement,
		NodeH = QW.NodeH,
		on = QW.EventTargetH.addEventListener,
		un = QW.EventTargetH.removeEventListener,
		getCurrentStyle = NodeH.getCurrentStyle,
		setStyle = NodeH.setStyle,
		getRect = NodeH.getRect,
		setRect = NodeH.setRect,
		addClass = NodeH.addClass,
		removeClass = NodeH.removeClass,
		marginWidth = NodeH.marginWidth,
		EventH = QW.EventH,
		target = EventH.getTarget,
		preventDefault = EventH.preventDefault,
		pageX = EventH.getPageX,
		pageY = EventH.getPageY,
		CustEvent = QW.CustEvent;

	/**
	 * DragManager��һ��ȫ�ֵ��϶���������
	 * ÿ��ֻ����һ���϶��ڽ��С�
	 * ����϶��Ķ���oDrag��
	 * DragManagerֻ��oDrag������Drag���������ã������������ǣ�
	 * ----dragstart
	 * ----drag
	 * ----dragend
	 * ����Ա����ͨ��startDrag(e,oDrag)��ί��DragManager��ʼ����һ���϶���ֱ����mouseupʱ��DragManager����ֹ�����oDrag�Ĺ���
	 * ���ļ���ʵ������oDrag,����
	 * ----SimpleDrag�����϶�������󡣣�SimpleResize��SimpleDrag�����죩
	 * ----RectSelector������ѡ����
	 * ----LayoutDrag�������϶�
	 */
	var DragManager = {
		isDragging: false,
		oDrag: null,
		//��ǰ���϶���Drag����
		startDate: null,
		//�϶���ʼʱ��
		startX: 0,
		//�϶�X����
		startY: 0,
		//�϶�Y����
		pageX: 0,
		//pageX
		pageY: 0,
		//pageY
		deltaX: 0,
		//�������ʼ��X�ı仯
		deltaY: 0,
		//�������ʼ��Y�ı仯
		deltaDeltaX: 0,
		//�������һ��mousemove��X�ı仯�������磬��ֵ����0,��ʾ����������ƣ�
		deltaDeltaY: 0,
		//�������һ��mousemove��Y�ı仯
		mouseDownTarget: null,
		//mouseDown�Ķ���
		startDrag: function(e, oDrag) {} //��һ��Drag����ί�и�DragManager����
	};

	(function() {
		var mouseD = function(e) {//mouseDown
			var obj = DragManager.oDrag;
			if (DragManager.isDragging || !obj) return;
			DragManager.isDragging = true;
			on(document, 'mousemove', mouseM);
			on(document, 'mouseup', mouseU);
			DragManager.startDate = new Date();
			DragManager.deltaX = DragManager.deltaY = DragManager.deltaDeltaX = DragManager.deltaDeltaY = 0;
			DragManager.startX = DragManager.pageX = pageX(e);
			DragManager.startY = DragManager.pageY = pageY(e);
			DragManager.mouseDownTarget = target(e);
			preventDefault(e);
			obj.dragstart(e); //����Drag�����dragstart����
		};
		var mouseU = function(e) {//mouseUp
			var obj = DragManager.oDrag;
			if (!DragManager.isDragging || !obj) return;
			obj.dragend(e); //����Drag�����dragend����
			DragManager.isDragging = false;
			DragManager.oDrag = null;
			un(document, 'mousemove', mouseM);
			un(document, 'mouseup', mouseU);
		};
		var mouseM = function(e) {//mouseMove
			//testIpt.value=Math.random();
			var obj = DragManager.oDrag;
			if (!DragManager.isDragging || !obj) return;
			var x = pageX(e);
			var y = pageY(e);
			DragManager.deltaDeltaX = x - DragManager.pageX;
			DragManager.deltaDeltaY = y - DragManager.pageY;
			DragManager.pageX = x;
			DragManager.pageY = y;
			DragManager.deltaX = x - DragManager.startX;
			DragManager.deltaY = y - DragManager.startY;
			//testIpt.value=[DragManager.deltaX,DragManager.deltaY];
			obj.drag(e); //����Drag�����drag����
		};
		DragManager.startDrag = function(e, oDrag) {
			DragManager.oDrag = oDrag;
			mouseD(e);
		};
	}());

	/**
	 * SimpleDrag ���϶�
	 */

	function SimpleDrag(opts) {
		mix(this, opts, 1);
		if (!this.lazyRender) this.render();
	}

	(function() {
		SimpleDrag.EVENTS = ['dragstart', 'drag', 'dragend'];
		var $F = function(s) {
			return parseFloat(s) || 0;
		};
		SimpleDrag.prototype = {
			oSrc: null,
			oHdl: null,
			oProxy: null,
			xAttr: 'left',
			yAttr: 'top',
			maxXAttr: null,
			minXAttr: null,
			maxYAttr: null,
			minYAttr: null,
			xFixed: false,
			yFixed: false,
			withProxy: false,
			getProxy: (function() {
				var proxy = null;
				return function() {
					var el = this.oProxy || proxy;
					if (!el) {
						el = createElement('div', {
							className: 'proxy-dd'
						});
						document.body.appendChild(el);
						el.style.display = 'none';
					}
					return this.oProxy = el;
				};
			}()),

			dragstart: function(e) {
				var me = this;
				if (me.oHdl.setCapture) me.oHdl.setCapture();
				me.startXAttr = $F(getCurrentStyle(me.oSrc, me.xAttr));
				me.startYAttr = $F(getCurrentStyle(me.oSrc, me.yAttr));
				if (me.withProxy) {
					var proxy = me.getProxy();
					var rect = getRect(me.oSrc);
					setRect(proxy, rect.left, rect.top, rect.width, rect.height, false);
					me.startXAttrProxy = $F(proxy.style[me.xAttr]);
					me.startYAttrProxy = $F(proxy.style[me.yAttr]);
					proxy.__deltaX = proxy.__deltaY = 0;
					lazyApply(
						function() {
							proxy.style.display = 'block';
						},
						null, 
						[], 
						20, 
						function() {
							if (me != DragManager.oDrag || proxy.style.display != 'none') return -1;
							if (DragManager.deltaX * DragManager.deltaX + DragManager.deltaY * DragManager.deltaY > 4 || (new Date() - DragManager.startDate) > 500) return 1;
							return 0;
						}
					);
				}
				me.fire('dragstart');
			},
			drag: function(e) {
				//����delta. 
				var me = this,
					dirs = {
						X: 1,
						Y: 1
					};
				for (var i in dirs) {
					var iLow = i.toLowerCase();
					if (!me[iLow + 'Fixed']) {
						var delta = DragManager['delta' + i];
						if (me['max' + i + 'Attr'] != null) delta = Math.min(delta, me['max' + i + 'Attr'] - me['start' + i + 'Attr']);
						if (me['min' + i + 'Attr'] != null) delta = Math.max(delta, me['min' + i + 'Attr'] - me['start' + i + 'Attr']);
						if (me.withProxy) {
							try { //����proxy��border,�����������proxy��Ȼ�߶��п���С��0������IE��������tryһ�¡�
								setStyle(me.oProxy, me[iLow + 'Attr'], (me['start' + i + 'AttrProxy'] + delta) + 'px');
							} catch (ex) {}
							me.oProxy['__delta' + i] = delta;
						} else {
							setStyle(me.oSrc, me[iLow + 'Attr'], (me['start' + i + 'Attr'] + delta) + 'px');
						}
					}
				}
				me.fire('drag');
			},
			dragend: function(e) {
				var me = this;
				if (me.oHdl.releaseCapture) me.oHdl.releaseCapture();
				if (me.withProxy) {
					var proxy = me.oProxy;
					proxy.style.display = 'none';
					if (!me.xFixed) setStyle(me.oSrc, me.xAttr, (me.startXAttr + proxy.__deltaX) + 'px');
					if (!me.yFixed) setStyle(me.oSrc, me.yAttr, (me.startYAttr + proxy.__deltaY) + 'px');
				}
				me.fire('dragend');
			},
			render: function() {
				var me = this;
				if (me._rendered) return;
				CustEvent.createEvents(me, SimpleDrag.EVENTS);
				me.oHdl = me.oHdl || me.oSrc;
				on(me.oHdl, 'mousedown', function(e) {
					DragManager.startDrag(e, me);
				});
				me._rendered = true;
			}
		};
	}());

/*
* SimpleResize ��Resize
*/

	function SimpleResize(opts) {
		SimpleDrag.call(this, opts);
	}

	(function() {
		SimpleResize.MENTOR_CLASS = SimpleDrag;
		SimpleResize.prototype = {
			xAttr: 'width',
			yAttr: 'height',
			minXAttr: 0,
			minYAttr: 0
		};
		mix(SimpleResize.prototype, SimpleDrag.prototype);
	}());

	/**
	 * RectSelector�� ������ѡ����
	 */

	function RectSelector(opts) {
		mix(this, opts, 1);
		if (!this.lazyRender) this.render();
	}

	(function() {
		RectSelector.EVENTS = ['dragstart', 'drag', 'dragend'];
		RectSelector.prototype = {
			oProxy: null,
			oHdl: null,
			getProxy: (function() {
				var proxy = null;
				return function() {
					var el = this.oProxy || proxy;
					if (!el) {
						el = createElement('div', {
							className: 'proxy-rectselector'
						});
						document.body.appendChild(el);
						el.style.display = 'none';
					}
					return this.oProxy = el;
				};
			}()),
			dragstart: function(e) {
				this.oProxy = this.getProxy();
				this.oProxy.style.display = "block";
				if (this.oHdl.setCapture) this.oHdl.setCapture();
				setRect(this.oProxy, DragManager.startX, DragManager.startY, 1, 1);
				this.fire('dragstart');
			},
			drag: function(e) {
				setRect(this.oProxy, Math.min(DragManager.startX, DragManager.pageX), Math.min(DragManager.startY, DragManager.pageY), Math.abs(DragManager.deltaX), Math.abs(DragManager.deltaY));
				this.fire('drag');
			},
			dragend: function(e) {
				if (this.oHdl.releaseCapture) this.oHdl.releaseCapture();
				this.oProxy.style.display = 'none';
				this.fire('dragend');
			},
			render: function() {
				var me = this;
				if (me._rendered) return;
				CustEvent.createEvents(me, RectSelector.EVENTS);
				on(me.oHdl, 'mousedown', function(e) {
					if (target(e) == me.oHdl) {
						DragManager.startDrag(e, me);
					}
				});
				me._rendered = true;
			}
		};
	}());


	/**
	 * LayoutDrag �����϶�������
	 * ���ڲ�ͬ�Ĳ��֣���new LayoutDrag�Ĳ���opts����Դ����������������ʹ������£�
	 *	adjustLayout:function(custEvent){
	 *		if(custEvent.type=='dragstart'){
	 *		}
	 *		else if(custEvent.type=='drag'){
	 *		}
	 *		else if(custEvent.type=='dragend'){
	 *		}
	 *	}
	 * ������ʵ�����������õģ�����
	 * ----ModuleLayout�϶���LayoutDrag.adjustModuleLayoutDrag
	 * ----���϶���LayoutDrag.adjustColumnDrag
	 */

	function LayoutDrag(opts) {
		SimpleDrag.call(this, opts);
	}

	(function() {
		LayoutDrag.MENTOR_CLASS = SimpleDrag;
		LayoutDrag.prototype = {
			withProxy: true,
			isInline: false,
			//�Ƿ���inline��Layout.
			dragstart: function(e) {
				addClass(this.oSrc, 'dragingModule');
				SimpleDrag.prototype.dragstart.call(this, e);
			},
			dragend: function(e) {
				removeClass(this.oSrc, 'dragingModule');
				SimpleDrag.prototype.dragend.call(this, e);
			},
/*
		//��ͬ��layoutDragֻ���޸�adjustLayout��һ��������
		//��ʾ������Ϊ��
		adjustLayout:function(custEvent){
			if(custEvent.type=='ondragstart'){
			}
			else if(custEvent.type=='ondrag'){
			}
			else if(custEvent.type=='ondragend'){
			}
		}
		//����ΪLayoutDrag��Ĭ��adjustLayout����
		*/
			/**
			 * adjustLayout(custEvent): Ĭ�ϵĵ���ģ��λ�ú�����
			 * ����ҪLayoutDrag���������ԣ�
			 * {array|collection} siblings ��Ŀ�ĵء��Ĳο�λ�ö��󣬱�ʾ��Ŀ�ĵء��Ǹö����ǰ������
			 * {array|collection} containers ��Ŀ�ĵء����������󣬱�ʾ��Ŀ�ĵء��Ǹö������档
			 */
			adjustLayout: function(custEvent) {
				var me = this,
					x = DragManager.pageX,
					y = DragManager.pageY,
					siblings = me.siblings,
					containers = me.containers,
					posAttr = me.isInline ? 'deltaDeltaX' : 'deltaDeltaY',
					rect;
				if (custEvent.type == 'dragstart') {
					if (me.__elAnim) { //����ж�������ֹͣ����
						me.__elAnim.stop();
					}
				} else if (custEvent.type == 'drag') {
					if (containers || siblings) {
						var adjusted = false;
						//��Լһ��CPU
						rect = getRect(me.oSrc);
						var margins = marginWidth(me.oSrc);
						if (x >= rect.left - margins[3] && x <= rect.right + margins[1] && y >= rect.top - margins[0] && y <= rect.bottom + margins[2]) {
							return;
						}
						for (var i = 0; siblings != null && i < siblings.length; i++) {
							var obj = siblings[i];
							if (obj == me.oSrc) continue;
							rect = getRect(obj);
							margins = marginWidth(obj);
							if (x >= rect.left - margins[3] && x <= rect.right + margins[1] && y >= rect.top - margins[0] && y <= rect.bottom + margins[2]) {
								if (DragManager[posAttr] > 0) obj.parentNode.insertBefore(me.oSrc, obj.nextSibling);
								else if (DragManager[posAttr] < 0) obj.parentNode.insertBefore(me.oSrc, obj);
								adjusted = true;
								break;
							}
						}
						for (var i = 0; !adjusted && containers != null && i < containers.length; i++) {
							obj = containers[i];
							rect = getRect(obj);
							if (x > rect.left + 1 && x < rect.right - 1 && y > rect.top + 1 && y < rect.bottom - 1) {
								if (obj.lastChild != me.oSrc) {
									obj.appendChild(me.oSrc);
									adjusted = true;
								}
								break;
							}
						}
						if (adjusted && me.oHdl.setCapture) me.oHdl.setCapture();
					}
				}
				if (custEvent.type == 'dragend') {
					if (me.needAnim && QW.ElAnim) {
						rect = getRect(me.oSrc);
						me.oProxy.style.display = 'block';
						var elAnim = new QW.ElAnim(me.oProxy, {
								width: {
									to: rect.width
								},
								height: {
									to: rect.height
								},
								left: {
									to: rect.left
								},
								top: {
									to: rect.top
								}
							}, 300);
						elAnim.on('suspend', function() {
							me.oProxy.style.display = 'none';
						});
						elAnim.play();
						me.oProxy.__elAnim = elAnim;
					}
				}
			},
			render: function() {
				var me = this;
				SimpleDrag.prototype.render.call(me);
				var adjustLayout = me.adjustLayout;
				if (adjustLayout) {
					me.on('dragstart', adjustLayout);
					me.on('drag', adjustLayout);
					me.on('dragend', adjustLayout);
				}
			}
		};
		mix(LayoutDrag.prototype, SimpleDrag.prototype);

	}());


	QW.provide({
		DragManager: DragManager,
		SimpleDrag: SimpleDrag,
		SimpleResize: SimpleResize,
		LayoutDrag: LayoutDrag,
		RectSelector: RectSelector
	});

}());