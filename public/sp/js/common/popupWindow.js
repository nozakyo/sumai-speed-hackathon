/*
 * 繧ｫ繧ｹ繧ｿ繝�繝繧､繧｢繝ｭ繧ｰ逕ｨ縺ｮJS
 */
var PopupWindow = function(options) {
	this.S_window = S(options.window);
	this.S_msgWindow = S(options.msgWindow);
	this.S_overlay = S(options.overlay);
	this.positionTop = 0;
};

PopupWindow._popupWindow = null;

/**
 * 繝昴ャ繝励い繝��繧ｪ繝悶ず繧ｧ繧ｯ繝医�蜿門ｾ�
 */
PopupWindow.get = function() {
	if (PopupWindow._popupWindow === null) {
		PopupWindow._popupWindow = new PopupWindow({
			window: '#js-popupWindow',
			msgWindow: '#js-popupMsgWindow',
			overlay: '#js-popup-overlay'
		});
	}
	return PopupWindow._popupWindow;
};

/**
 * 繧ｦ繧､繝ｳ繝峨え繧帝幕縺�
 *
 * @param {string} id 菴ｿ逕ｨ縺吶ｋ繝繧､繧｢繝ｭ繧ｰ縺ｮ繝�Φ繝励Ξ繝ｼ繝�ID
 * @param {string|undefined} msg 繝繧､繧｢繝ｭ繧ｰ縺ｫ陦ｨ遉ｺ縺輔○繧九Γ繝�そ繝ｼ繧ｸ��ID縺後ョ繝輔か繝ｫ繝医�蝣ｴ蜷医↓菴ｿ逕ｨ縺吶ｋ諠ｳ螳夲ｼ�
 */
PopupWindow.prototype.openWindow = function(id, msg) {
	var self = this;
	var S_id = S(id).clone();
	// 繝�ヵ繧ｩ繝ｫ繝医ユ繝ｳ繝励Ξ繝ｼ繝医ｒ菴ｿ逕ｨ縺吶ｋ縺�
	var isDefaultMessage = false;

	// ID縺後ョ繝輔か繝ｫ繝医〒縲［sg縺梧ｸ｡縺輔ｌ縺溷�ｴ蜷医�縺ｿ縲［sg繧剃ｽｿ逕ｨ縺吶ｋ
	if (id === '#js-defaultMSG' && msg) {
		var $titleElem = S_id.find('.innercontent-title');
		// 繝｡繝�そ繝ｼ繧ｸ繧定ｨｭ螳�
		$titleElem.html(msg);
		isDefaultMessage = true;
	}

	self.S_msgWindow.empty().append(S_id);
	self.S_window.css('display', 'block');
	self.S_overlay.css('display', 'block');

	// 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ蛛懈ｭ｢
	self.positionTop = document.documentElement.scrollTop || document.body.scrollTop;
	S('body').addClass('noscroll').css('top', (-self.positionTop) + 'px');

	// 繝｢繝ｼ繝繝ｫ繧貞虚縺九＆縺ｪ縺�◆繧√�繧､繝吶Φ繝医ｒ蜑企勁
	S('#js-popupSection').off('touchmove.noScroll');
	S('#js-popup-overlay').off('touchmove.noScroll');
	S('.popup-footer').off('touchmove.noScroll');

	if (isDefaultMessage && $titleElem &&
		$titleElem[0].scrollHeight > $titleElem[0].clientHeight) {
		// 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ縺悟ｭ伜惠縺吶ｋ蝣ｴ蜷�
		// 繧ｪ繝ｼ繝舌�繝ｬ繧､陦ｨ遉ｺ驛ｨ蛻�ｒ蜍輔°縺輔↑縺�ｈ縺�↓縺吶ｋ
		S('#js-popup-overlay').on('touchmove.noScroll', function(event) {
			event.preventDefault();
		});
		// 繝輔ャ繧ｿ繝ｼ驛ｨ蛻�ｒ蜍輔°縺輔↑縺�ｈ縺�↓縺吶ｋ
		S('.popup-footer').on('touchmove.noScroll', function(event) {
			event.preventDefault();
		});
	} else {
		// 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ縺悟ｭ伜惠縺吶ｋ蝣ｴ蜷医√Δ繝ｼ繝繝ｫ繧貞虚縺九＆縺ｪ縺�◆繧√�繧､繝吶Φ繝医ｒ驕ｩ逕ｨ
		S('#js-popupSection').on('touchmove.noScroll', function(event) {
			event.preventDefault();
		});
	}

	// 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ蠕後〒縺ｪ縺�→position:fixed縺碁←逕ｨ縺輔ｌ縺ｪ縺�ｩ溽ｨｮ縺後≠繧九�縺ｧ蠑ｷ蛻ｶ逧�↓1px繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ縺輔○繧�
	setTimeout(function() {
		window.scrollTo(0, self.positionTop - 1);
	}, 100);
};

/**
 * 繧ｦ繧､繝ｳ繝峨え繧帝哩縺倥ｋ
 */
PopupWindow.prototype.closeWindow = function() {
	var self = this;

	// 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ蛛懈ｭ｢繧定ｧ｣髯､
	S('body').removeClass('noscroll');
	scrollTo(0, self.positionTop);

	self.S_window.css('display', 'none');
	self.S_overlay.css('display', 'none');
};

S(document).ready(function() {
	S('#js-popupSection').on('click', '.js-popupWindowClose', function() {
		PopupWindow.get().closeWindow();
	});
});