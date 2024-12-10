// 繝ｭ繧ｰ繧､繝ｳ縺後ち繝��縺輔ｌ縺溘→縺�
const loginBtn = document.querySelector('.js-login');
if (loginBtn) {
	loginBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_login`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_login']]);
	});
}

// 譁ｰ隕丈ｼ壼藤逋ｻ骭ｲ縺後ち繝��縺輔ｌ縺溘→縺�
const registerBtn = document.querySelector('.js-register');
if (registerBtn) {
	registerBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_kaiintoroku`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_kaiintoroku']]);
	});
}

// 繝ｭ繧ｰ繧｢繧ｦ繝医′繧ｿ繝��縺輔ｌ縺溘→縺�
const logoutBtn = document.querySelector('.js-logout');
if (logoutBtn) {
	logoutBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_logout`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_logout']]);
	});
}

// 縺頑ｰ励↓蜈･繧翫′繧ｿ繝��縺輔ｌ縺溘→縺�
document.querySelector('.js-favorite').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_MyList`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_MyList']]);
});

// 菫晏ｭ倥＠縺滓擅莉ｶ縺後ち繝��縺輔ｌ縺滓凾
document.querySelector('.js-save-joken').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_joken_save`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_joken_save']]);
});

// 譛霑題ｦ九◆迚ｩ莉ｶ莨夂､ｾ縺後ち繝��縺輔ｌ縺滓凾
document.querySelector('.js-rireki').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_bukkenkaisha_rireki`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_bukkenkaisha_rireki']]);
});

// 讀懃ｴ｢螻･豁ｴ縺後ち繝��縺輔ｌ縺滓凾
document.querySelector('.js-joken-rireki').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_kensaku_rireki`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_kensaku_rireki']]);
});

// 謾ｯ謇輔＞鬘阪す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺後ち繝��縺輔ｌ縺滓凾
document.querySelector('.js-shiharai').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_shiharai`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_shiharai']]);
});

// 雉ｼ蜈･鬘阪す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺後ち繝��縺輔ｌ縺滓凾
document.querySelector('.js-kounyu').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_kounyu`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_kounyu']]);
});

// APP DL繧偵ち繝��縺励◆縺ｨ縺�
const appDlBtn = document.querySelector('.js-app-dl');
if (appDlBtn) {
	document.querySelector('.js-app-dl').addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_AppDL`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_AppDL']]);
	});
}

// SUUMO迚ｹ蜈ｸ繧偵ち繝��縺励◆縺ｨ縺�
const presentBtn = document.querySelector('.js-present');
if (presentBtn) {
	presentBtn.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_tokuten`);
		sendEventForBeacon([['eventName', 'odn_menu_tap_tokuten']]);
	});
}

// 繧ｵ繧､繝峨Γ繝九Η繝ｼ繧帝哩縺倥◆縺ｨ縺�
document.querySelector('.js-side-menu-ov').addEventListener('click', () => {
	window.sendCatalystCustomEvent('None', 'None', `odn_menu_tap_close`);
	sendEventForBeacon([['eventName', 'odn_menu_tap_close']]);
});

// 繝｡繝九Η繝ｼ繧偵ち繝��縺励◆縺ｨ縺�
const sidemenuIcon = document.querySelector('a.icnMypage');
if (sidemenuIcon) {
	sidemenuIcon.addEventListener('click', () => {
		window.sendCatalystCustomEvent('None', 'None', 'odn_menu_tap_open');
		sendEventForBeacon([['eventName', 'odn_menu_tap_open']]);
	});
}
