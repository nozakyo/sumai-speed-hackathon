// ログインがタップされたとき
const loginBtn = document.querySelector('.js-login');
if (loginBtn) {
	loginBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_login`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_login']]);
	});
}

// 新規会員登録がタップされたとき
const registerBtn = document.querySelector('.js-register');
if (registerBtn) {
	registerBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_kaiintoroku`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_kaiintoroku']]);
	});
}

// ログアウトがタップされたとき
const logoutBtn = document.querySelector('.js-logout');
if (logoutBtn) {
	logoutBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_logout`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_logout']]);
	});
}

// お気に入りがタップされたとき
document.querySelector('.js-favorite').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_MyList`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_MyList']]);
});

// 保存した条件がタップされた時
document.querySelector('.js-save-joken').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_joken_save`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_joken_save']]);
});

// 最近見た物件会社がタップされた時
document.querySelector('.js-rireki').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_bukkenkaisha_rireki`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_bukkenkaisha_rireki']]);
});

// 検索履歴がタップされた時
document.querySelector('.js-joken-rireki').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_kensaku_rireki`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_kensaku_rireki']]);
});

// 支払い額シミュレーションがタップされた時
document.querySelector('.js-shiharai').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_shiharai`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_shiharai']]);
});

// 購入額シミュレーションがタップされた時
document.querySelector('.js-kounyu').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_kounyu`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_kounyu']]);
});

// APP DLをタップしたとき
const appDlBtn = document.querySelector('.js-app-dl');
if (appDlBtn) {
	document.querySelector('.js-app-dl').addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_AppDL`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_AppDL']]);
	});
}

// SUUMO特典をタップしたとき
const presentBtn = document.querySelector('.js-present');
if (presentBtn) {
	presentBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_tokuten`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_tokuten']]);
	});
}

// サイドメニューを閉じたとき
document.querySelector('.js-side-menu-ov').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_close`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_close']]);
});

// メニューをタップしたとき
const sidemenuIcon = document.querySelector('a.icnMypage');
if (sidemenuIcon) {
	sidemenuIcon.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', 'odn_menu_tap_open');
		sendEventForBeacon([['eventName', 'odn_menu_tap_open']]);
	});
}
