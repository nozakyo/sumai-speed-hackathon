/**
 * ログインサービス
 */
S(function() {
	// ログインステータス
	var isLogin = (S('#loginServiceScript').attr('data-isLogin') === '1' ? true : false);
	// セッションフラグ
	var sessionServerAliveFlg = (S('#loginServiceScript').attr('data-sessionServerAliveFlg') === '1' ? true : false);
	// ログインURL
	var loginUrl = S('#loginServiceScript').attr('data-loginUrl');
	// ログアウトURL
	var logoutUri = S('#loginServiceScript').attr('data-logoutUri');

	if (isLogin) {
		localStorage.isLogin = '1';

		// ログイン時のログアウトボタンの処理 *}
		S(document).delegate('.logoutBtn', 'click', function() {
			if (confirm("ログアウトします。よろしいですか？")) {
				localStorage.isLogin = '0';
				location.href = logoutUri;
			}
		});

	} else {
		// ログインがセッションタイムアウトして場合の対応
		if (localStorage.isLogin === '1') {
			alert("ログアウトされました。\n再度ログインを行ってください。");
			localStorage.isLogin = "0";
		}

		// 非ログイン時のログインボタンの処理 *}
		S(document).delegate('.loginBtn', 'click', function() {
			if (sessionServerAliveFlg) {
				if (navigator.cookieEnabled) {
					// ログイン用のURLへアクセス
					location.href = loginUrl;
				} else {
					// クッキーが有効でない場合は、アラート表示
					alert('ログイン情報を端末に保持するためcookieを有効にしていただく必要があります。');
				}
			} else {
				alert('現在ログインできません');
			}
		});
	}
});
