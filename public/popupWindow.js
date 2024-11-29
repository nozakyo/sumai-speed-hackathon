/*
 * カスタムダイアログ用のJS
 */
var PopupWindow = function(options) {
	this.S_window = S(options.window);
	this.S_msgWindow = S(options.msgWindow);
	this.S_overlay = S(options.overlay);
	this.positionTop = 0;
};

PopupWindow._popupWindow = null;

/**
 * ポップアップオブジェクトの取得
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
 * ウインドウを開く
 *
 * @param {string} id 使用するダイアログのテンプレートID
 * @param {string|undefined} msg ダイアログに表示させるメッセージ（IDがデフォルトの場合に使用する想定）
 */
PopupWindow.prototype.openWindow = function(id, msg) {
	var self = this;
	var S_id = S(id).clone();
	// デフォルトテンプレートを使用するか
	var isDefaultMessage = false;

	// IDがデフォルトで、msgが渡された場合のみ、msgを使用する
	if (id === '#js-defaultMSG' && msg) {
		var $titleElem = S_id.find('.innercontent-title');
		// メッセージを設定
		$titleElem.html(msg);
		isDefaultMessage = true;
	}

	self.S_msgWindow.empty().append(S_id);
	self.S_window.css('display', 'block');
	self.S_overlay.css('display', 'block');

	// スクロール停止
	self.positionTop = document.documentElement.scrollTop || document.body.scrollTop;
	S('body').addClass('noscroll').css('top', (-self.positionTop) + 'px');

	// モーダルを動かさないためのイベントを削除
	S('#js-popupSection').off('touchmove.noScroll');
	S('#js-popup-overlay').off('touchmove.noScroll');
	S('.popup-footer').off('touchmove.noScroll');

	if (isDefaultMessage && $titleElem &&
		$titleElem[0].scrollHeight > $titleElem[0].clientHeight) {
		// スクロールが存在する場合
		// オーバーレイ表示部分を動かさないようにする
		S('#js-popup-overlay').on('touchmove.noScroll', function(event) {
			event.preventDefault();
		});
		// フッター部分を動かさないようにする
		S('.popup-footer').on('touchmove.noScroll', function(event) {
			event.preventDefault();
		});
	} else {
		// スクロールが存在する場合、モーダルを動かさないためのイベントを適用
		S('#js-popupSection').on('touchmove.noScroll', function(event) {
			event.preventDefault();
		});
	}

	// スクロール後でないとposition:fixedが適用されない機種があるので強制的に1pxスクロールさせる
	setTimeout(function() {
		window.scrollTo(0, self.positionTop - 1);
	}, 100);
};

/**
 * ウインドウを閉じる
 */
PopupWindow.prototype.closeWindow = function() {
	var self = this;

	// スクロール停止を解除
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