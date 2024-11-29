/**
 * localStorage用ユーティリティ
 */
var localStorageUtil = {};

/**
 * localStorage用ユーティリティ セッター
 *
 * @param key localStorageに保存するときのキー名
 * @param val localStorageに保存するオブジェクト
 * @return boolean ローカルストレージ登録時に例外を吐いたらfalse
 */
localStorageUtil.set = function (key, val) {
	if (!key) { return; }

	try {
		var jsonStringifiedData = JSON.stringify(val);
		// JQMB-3597 セットするデータと現在のローカルストレージのデータで、JSON文字列として比較し差異がある場合
		if (localStorage.getItem(key) !== jsonStringifiedData) {
			localStorage.setItem(key, jsonStringifiedData);
		}
	} catch (e) {
		// ローカルストレージがOFFの時(プライベートモード等)に例外が吐かれる
		return false;
	}

	return true;
};

/**
 * localStorage用ユーティリティ ゲッター
 *
 * @param key localStorageに保存した値のキー名
 */
localStorageUtil.get = function (key) {
	var key = key || '', itemValue = localStorage.getItem(key);

	if (itemValue) { return JSON.parse(itemValue); }

	return null;
};

/**
 * localStorage用ユーティリティ 削除
 *
 * @param key localStorageに保存した値のキー名
 */
localStorageUtil.del = function (key, idxAry) {
	var localStorageArray = localStorageUtil.get(key);

	var newSaveDataList = [];
	for (var i = 0; i < localStorageArray.length; i++) {
		if (idxAry.indexOf(i) === -1) {
			newSaveDataList.push(localStorageArray[i]);
		}
	}
	localStorageUtil.set(key, newSaveDataList);
};

/**
 * localStorage用ユーティリティ クリア ※クロスドメインへのデータ送信処理は呼びません
 *
 * @param key localStorageに保存した値のキー名
 */
localStorageUtil.remove = function (key) {
	if (!key) { return; }
	localStorage.removeItem(key);
};
