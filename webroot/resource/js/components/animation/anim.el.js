(function() {	
	var Anim = QW.Anim,
		extend = QW.ClassH.extend,
		g = QW.Dom.g,
		mix = QW.ObjectH.mix,
		isElement = QW.Dom.isElement,
		setStyle = QW.NodeH.setStyle,
		getStyle = QW.NodeH.getCurrentStyle,
		map = Array.map || ArrayH.map;
	
	function AnimAgent(el, opts, attr){ //用来辅助对opts进行标准化操作的私有类
		this.el = el;
		this.attr = attr;
		mix(this, opts[attr]);
		this.init();
	}

	mix(AnimAgent.prototype, { 
		setValue : function(value){   //获得属性
			setStyle(this.el, this.attr, value);
		},
		getValue : function(){
			return getStyle(this.el, this.attr);
		},
		getUnits : function(attr){
			return this.units ? this.units : this.getValue().toString().replace(/^[+-]?[\d\.]+/g,'');
		},
		init : function(){ //初始化数据
			var from, to, by, units;
			if(null != this.from){
				from = parseFloat(this.from);			
			}else{
				from = parseFloat(this.getValue());
			}

			to = parseFloat(this.to);
			by = this.by != null ? parseFloat(this.by) : (to - from);	

			this.from = from;
			this.by = by;
			this.units = this.getUnits();
		},
		action : function(per, easing){
			var units = this.units;
			var value = this.from + easing(per , this.by);
			//console.log([this.from, per, this.by, value, easing(per , this.by)]);
			value = value.toFixed(6);
			this.setValue(value + units);
		}
	});

	var RectAgent = extend(function(){
		RectAgent.$super.apply(this, arguments);
	},AnimAgent);

	mix(RectAgent.prototype, {
		getUnits : function(attr){
			return this.units ? this.units : (this.getValue().toString().replace(/^[+-]?[\d\.]+/g,'') || 'px');
		}	
	}, true);

	var ScrollAgent = extend(
		function(){
			ScrollAgent.$super.apply(this, arguments);
	},AnimAgent);

	mix(ScrollAgent.prototype, {
		getValue : function() {
			return this.el[this.attr] | 0;
		},
		setValue : function(value) {
			this.el[this.attr] = Math.round(value);
		}
	}, true);

	var ColorAgent = extend(function(){
		ColorAgent.$super.apply(this,arguments);
	}, AnimAgent);

	mix(ColorAgent.prototype, {
		/**
		 * 处理颜色
		 * 
		 * @method parseColor
		 * @public
		 * @param {string} 颜色值，支持三种形式：#000/#000000/rgb(0,0,0)
		 * @return {array} 包含r、g、b的数组
		 */
		parseColor : function(s){
			/**
			 * ColorAnim用到的一些正则
			 * 
			 * @public
			 */
			var patterns = {
				rgb         : /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
				hex         : /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
				hex3        : /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i
			};

			if (s.length == 3) { return s; }
			
			var c = patterns.hex.exec(s);
			
			if (c && c.length == 4) {
				return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
			}
		
			c = patterns.rgb.exec(s);
			if (c && c.length == 4) {
				return [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
			}
		
			c = patterns.hex3.exec(s);
			if (c && c.length == 4) {
				return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
			}
			
			return [0, 0, 0];
		},
		/**
		 * 初始化数据
		 * 
		 * @method initData
		 * @public
		 * @return void
		 */
		init : function(){
			var from, to, by, units;
			var parseColor = this.parseColor;

			if(null != this.from){
				from = this.from;			
			}else{
				from = this.getValue();
			}

			from = parseColor(from);

			to = this.to || [0,0,0];
			to = parseColor(to);

			by = this.by ? parseColor(this.by) : 
				map(to, function(d,i){
					return d - from[i];
				});

			this.from = from;
			this.by = by;
			this.units = this.getUnits();
		},

		/**
		 * 获取CSS颜色
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} 属性名
		 * @return {string} 颜色值
		 */
		getValue : function() {
			return getStyle(this.el, this.attr);
		},

		/**
		 * 设置CSS颜色
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} 属性名
		 * @param {string} 值
		 * @return void
		 */
		setValue : function(value) {
			if(typeof value == "string") {
				setStyle(this.el, this.attr, value);
			} else {
				setStyle(this.el, this.attr, "rgb("+value.join(",")+")");
			}
		},
		action : function(per, easing){
			var me = this;
			var value = this.from.map(function(s, i){
				return Math.max(Math.floor(s + easing(per, me.by[i])),0);
			});
			this.setValue(value);
		}
	}, true);

	/*
	 * 相关的数据处理器，返回处理器
	 */
	var _agentPattern = { 
		"color" : ColorAgent, 
		"scroll" : ScrollAgent,
		"width|height|top$|bottom$|left$|right$" : RectAgent,
		".*" : AnimAgent
	};

	function _patternFilter(patternTable, key){
		for(var i in patternTable){
			var pattern = new RegExp(i, "i");
			if(pattern.test(key)){
				return patternTable[i];
			}
		}	
		return null;
	};

	function _setAgent(el, opts){
		for(var attr in opts){
			var Agent = _patternFilter(_agentPattern, attr);
			opts[attr].agent = new Agent(el, opts, attr);
		}		
	}

	function _makeAction(el, opts, /*default easing*/ easing){
		return function(per){
			for(var attr in opts){
				var agent = opts[attr].agent;
				easing = agent.easing || easing;
				agent.action(per, easing);
			}
		}
	}
	
	var ElAnim = extend(
		function(el, opts, dur, easing){
			el = g(el);
			if(!isElement(el)) 
				throw new Error(['Animation','Initialize Error','Element Not Found!']);

			easing = easing || function(p, d) {return d * p};		
			
			_setAgent(el, opts);
			var action = _makeAction(el, opts, easing);
			
			ElAnim.$super.call(this, action, dur);
		},Anim);

	QW.provide("ElAnim", ElAnim);
})();