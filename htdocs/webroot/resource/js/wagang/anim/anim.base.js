/*
	Copyright QWrap
	version: $version$ $release$ released
	author: JK
*/

(function() {
	var CustEvent = QW.CustEvent,
		mix = QW.ObjectH.mix;

	/**
	 * @class Anim ����
	 * @namespace QW
	 * @constructor
	 * @param {function} animFun - ������Ч���ıհ�
	 * @param {int} dur - ����Ч��������ʱ�� 
	 * @param {json} opts - ���������� 
		---Ŀǰֻ֧�����²�����
		{boolean} byStep (Optional) �Ƿ�֡��������"����֡"�������Ϊtrue����ʾÿһ֡���ߵ���֡��Ϊdur/frameTime
		{boolean} frameTime (Optional) ֡���ʱ�䡣Ĭ��Ϊ28
		{boolean} per (Optional) ��ʼ���Ž���
		{function} onbeforeplay (Optional) onbeforeplay�¼�
		{function} onplay (Optional) onplay�¼�
		{function} onstep (Optional) onstep�¼�
		{function} onpause (Optional) onpause�¼�
		{function} onresume (Optional) onresume�¼�
		{function} onstop (Optional) onstop�¼�
		{function} onsuspend (Optional) onsuspend�¼�
		{function} onreset (Optional) onreset�¼�
	 * @returns {Anim} anim - ��������
	 */
	var Anim = function(animFun, dur, opts) {
		mix(this, opts);
		mix(this, {
			animFun: animFun,	//animFun������������
			dur: dur,	//����ʱ��
			byStep: false,	//�Ƿ�֡�����������壬��������ʱ��
			per: 0,	//���Ž���
			frameTime: 28, //֡���ʱ��
			_status: 0 //0��δ���ţ�1�������У�2�����Ž�����4������ͣ��8������ֹ
		});
		changePer(this, this.per);
		CustEvent.createEvents(this, Anim.EVENTS);
	};

	Anim.EVENTS = ['beforeplay','play','step','pause','resume','stop','suspend','reset'];
	/*
	 * turnOn �򿪶�����ʱ��
	 * @param {Anim} anim Animʵ��
	 * @returns {void}
	 */

	function turnOn(anim) {
		anim.step();
		if (anim.isPlaying()) {
			anim._interval = window.setInterval(function() {
				anim.step();
			}, anim.frameTime);
		}
	}
	/*
	 * turnOff �رն�����ʱ��
	 * @param {Anim} anim Animʵ��
	 * @returns {void}
	 */

	function turnOff(anim) {
		window.clearInterval(anim._interval);
	}
	/*
	 * changePer �������Ž��ȣ�����ֵ
	 * @param {Anim} anim Animʵ��
	 * @param {number} per ����ֵ��Ϊ[0,1]�����ڵ���ֵ
	 * @returns {void}
	 */

	function changePer(anim, per) {
		anim.per = per;
		anim._startDate = new Date() * 1 - per * anim.dur;
		if (anim.byStep) {
			anim._totalStep = anim.dur / anim.frameTime;
			anim._currentStep = per * anim._totalStep;
		}
	}

	mix(Anim.prototype, {
		/**
		 * �ж��Ƿ����ڲ���
		 * @method isPlaying
		 * @returns {boolean}  
		 */
		isPlaying: function() {
			return this._status == 1;
		},
		/**
		 * ��0��ʼ����
		 * @method play
		 * @returns {boolean} �Ƿ�ʼ˳����ʼ������Ϊonbeforeplay�п�����ֹ��play�� 
		 */
		play: function() {
			var me = this;
			if (me.isPlaying()) me.stop();
			changePer(me, 0);
			if (!me.fire('beforeplay')) return false;
			me._status = 1;
			me.fire('play');
			turnOn(me);
			return true;
		},
		/**
		 * ����һ֡
		 * @method step
		 * @param {number} per (Optional) ����ֵ��Ϊ[0,1]�����ڵ���ֵ
		 * @returns {void} 
		 */
		step: function(per) {
			var me = this;
			if (per != null) {
				changePer(me, per);
			} else {
				if (me.byStep) {
					per = me._currentStep++ / me._totalStep;
				} else {
					per = (new Date() - me._startDate) / me.dur;
				}
				this.per = per;
			}
			if (this.per > 1) {
				this.per = 1;
			}
			me.animFun(this.per);
			me.fire('step');
			if (this.per >= 1) {
				this.suspend();
				return;
			}
		},
		/**
		 * ֹͣ���ţ���Ԥ��λ��0��
		 * @method stop
		 * @returns {void} 
		 */
		stop: function() {
			this._status = 8;
			changePer(this, 0);
			turnOff(this);
			this.fire('stop');
		},
		/**
		 * ���ŵ����
		 * @method suspend
		 * @returns {void} 
		 */
		suspend: function() {
			changePer(this, 1);
			this.animFun(1);
			this._status = 2;
			turnOff(this);
			this.fire('suspend');
		},
		/**
		 * ��ͣ����
		 * @method pause
		 * @returns {void} 
		 */
		pause: function() {
			this._status = 4;
			turnOff(this);
			this.fire('pause');
		},
		/**
		 * ��������
		 * @method resume
		 * @returns {void} 
		 */
		resume: function() {
			changePer(this, this.per);
			this._status = 1;
			this.fire('resume');
			turnOn(this);
		},
		/**
		 * ���ŵ��ʼ
		 * @method reset
		 * @returns {void} 
		 */
		reset: function() {
			changePer(this, 0);
			this.animFun(0);
			this.fire('reset');
		}
	});
	QW.provide('Anim', Anim);
}());