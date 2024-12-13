/**
 * 繝ｭ繧ｰ繧､繝ｳ繧ｵ繝ｼ繝薙せ
 */
S(function() {
	// 繝ｭ繧ｰ繧､繝ｳ繧ｹ繝��繧ｿ繧ｹ
	var isLogin = (S('#loginServiceScript').attr('data-isLogin') === '1' ? true : false);
	// 繧ｻ繝�す繝ｧ繝ｳ繝輔Λ繧ｰ
	var sessionServerAliveFlg = (S('#loginServiceScript').attr('data-sessionServerAliveFlg') === '1' ? true : false);
	// 繝ｭ繧ｰ繧､繝ｳURL
	var loginUrl = S('#loginServiceScript').attr('data-loginUrl');
	// 繝ｭ繧ｰ繧｢繧ｦ繝�URL
	var logoutUri = S('#loginServiceScript').attr('data-logoutUri');

	if (isLogin) {
		localStorage.isLogin = '1';

		// 繝ｭ繧ｰ繧､繝ｳ譎ゅ�繝ｭ繧ｰ繧｢繧ｦ繝医�繧ｿ繝ｳ縺ｮ蜃ｦ逅� *}
		S(document).delegate('.logoutBtn', 'click', function() {
			if (confirm("繝ｭ繧ｰ繧｢繧ｦ繝医＠縺ｾ縺吶ゅｈ繧阪＠縺�〒縺吶°��")) {
				localStorage.isLogin = '0';
				location.href = logoutUri;
			}
		});

	} else {
		// 繝ｭ繧ｰ繧､繝ｳ縺後そ繝�す繝ｧ繝ｳ繧ｿ繧､繝�繧｢繧ｦ繝医＠縺ｦ蝣ｴ蜷医�蟇ｾ蠢�
		if (localStorage.isLogin === '1') {
			alert("繝ｭ繧ｰ繧｢繧ｦ繝医＆繧後∪縺励◆縲�\n蜀榊ｺｦ繝ｭ繧ｰ繧､繝ｳ繧定｡後▲縺ｦ縺上□縺輔＞縲�");
			localStorage.isLogin = "0";
		}

		// 髱槭Ο繧ｰ繧､繝ｳ譎ゅ�繝ｭ繧ｰ繧､繝ｳ繝懊ち繝ｳ縺ｮ蜃ｦ逅� *}
		S(document).delegate('.loginBtn', 'click', function() {
			if (sessionServerAliveFlg) {
				if (navigator.cookieEnabled) {
					// 繝ｭ繧ｰ繧､繝ｳ逕ｨ縺ｮURL縺ｸ繧｢繧ｯ繧ｻ繧ｹ
					location.href = loginUrl;
				} else {
					// 繧ｯ繝�く繝ｼ縺梧怏蜉ｹ縺ｧ縺ｪ縺��ｴ蜷医�縲√い繝ｩ繝ｼ繝郁｡ｨ遉ｺ
					alert('繝ｭ繧ｰ繧､繝ｳ諠��ｱ繧堤ｫｯ譛ｫ縺ｫ菫晄戟縺吶ｋ縺溘ａcookie繧呈怏蜉ｹ縺ｫ縺励※縺�◆縺�縺丞ｿ�ｦ√′縺ゅｊ縺ｾ縺吶�');
				}
			} else {
				alert('迴ｾ蝨ｨ繝ｭ繧ｰ繧､繝ｳ縺ｧ縺阪∪縺帙ｓ');
			}
		});
	}
});