var dataMediatorJs = S('#dataMediatorJs');

// ↓ ネームスペースの定義 ↓
window.FW = window.FW ? window.FW : {};
window.FW.Message = window.FW.Message ? window.FW.Message : {};
window.FW.API = window.FW.API ? window.FW.API : {};
window.FW.API.Error = window.FW.API.Error ? window.FW.API.Error : {};
window.FW.API.Conditions = window.FW.API.Conditions ? window.FW.API.Conditions
	: {};
window.FW.API.ResponseConverter = window.FW.API.ResponseConverter
	? window.FW.API.ResponseConverter : {};
window.FW.DataMediator = window.FW.DataMediator ? window.FW.DataMediator : {};
// ↑ ネームスペースの定義 ↑

// ↓ メッセージ定義 ↓
FW.Message.ServerError = '申し訳ありません、只今回線が混み合っております。\nしばらくたってからアクセスし直してください。';
FW.Message.NetworkError = 'サーバとの接続が失敗しました。ネットワーク環境のよい場所で再度操作し直してください。';
FW.Message.ErrorOfIchiran = 'システムエラーにより、一覧の取得に失敗しました。';
// ↑ メッセージ定義 ↑

// ↓ APIクラスの定義 ↓

/**
 * APIのコンンストラクタ
 */
FW.API = function () {
	var self = this;

	self.apiInit();
};

/**
 * APIの初期化 (コンストラクタ用)
 */
FW.API.prototype.apiInit = function () {
	var self = this;

	self._url = null; // APIの向き先のURL
	self._method = 'GET'; // Default GET. メソッドタイプの設定
	self._conditions = {}; // FW.API.Conditions系のオブジェクトを保持するいれもの
	self._timeout = 10000; // API Timeout Default 10sec.

	self._xhr = null; // 通信で使用しているXMLHTTPRequestオブジェクトを保持するいれもの

	self._dataType = 'jsonp'; // Default jsonp. 設定できる値は、script/json/xml/html/text/jsonp

	self.isCanceled = false; // キャンセルされたかどうかのフラグ
};

/**
 * API処理をキャンセルする
 */
FW.API.prototype.cancel = function () {
	var self = this;

	// キャンセルされたので、フラグをたてる
	self.isCanceled = true;

	if (self._xhr && self._xhr.abort) {
		// S.ajaxのオブジェクト(XMLHTTPRequest)の処理をキャンセル
		self._xhr.abort();
	}
	self._xhr = null;
};

/**
 * 向き先を設定する
 */
FW.API.prototype.setURL = function (url) {
	var self = this;
	self._url = url;
};

/**
 * リクエストパラメータ用のコンディションオブジェクトを設定する
 *
 * @param {FW.API.Conditions} conditions
 */
FW.API.prototype.setConditions = function (conditions) {
	var self = this;
	self._conditions = conditions;
};

/**
 * リクエスト開始、設定したsuccess/errorでコールバックを受け取る
 *
 * @param {function} success リクエスト成功時
 * @param {function} error リクエスト失敗時
 */
FW.API.prototype.start = function (success, error) {
	var self = this;
	// POST送信時に使用するデータ ※GETの場合はnullのまま
	var data = null;

	// conditionsオブジェクトからクエリ文字を取得(URLエンコードする)
	var queryString = self._conditions.getQueryString();
	if (queryString.length > 0) {
		if (self._method === 'GET') {
			// GET通信の場合は、urlに付加する
			self._url += '?' + queryString;
		} else {
			// POST通信の場合は、urlに付加しない
			data = queryString;
		}
	}

	// 通信開始
	self._xhr = S.ajax({
		url: self._url,
		type: self._method,
		dataType: self._dataType,
		data: data,
		success: function (res) {
			// APIの処理がキャンセルされていなければ、成功処理を行う
			if (self.isCanceled === false) {
				success(res);
			}
		},
		error: function (res, state) {
			// JSONPの場合は、xhrを直にキャンセルすることはできないので、timeoutでエラー処理に入ってきたとしても
			// 通信処理が成功してしまったら、success処理が動くので、エラー処理に来たら、apiをキャンセルし、ステータスを
			// 変更する
			if (self.isCanceled === false) {
				self.cancel();

				var opt = {};
				switch (state) {
				case 'error':
					opt.state = -99999;
					break;
				case 'timeout':
					opt.state = -408;
					break;
				}

				error(res, opt);
			}
		},
		timeout: self._timeout,
	});
};

// ↑ APIクラスの定義 ↑

// ↓ API Errorクラスの定義 ↓

/**
 * エラーオブジェクトのコンストラクタ
 *
 * @param {String} エラーメッセージ
 * @param {Integer} エラーコード
 */
window.FW.API.Error = function (mes, code) {
	var self = this;

	self._mes = mes || FW.Message.ServerError;
	self._code = typeof code !== 'undefined' && code !== null ? code : 500;
};

/**
 * エラーメッセージ取得
 */
window.FW.API.Error.prototype.getMessage = function () {
	var self = this;
	return self._mes;
};

/**
 * エラーコード取得
 */
window.FW.API.Error.prototype.getCode = function () {
	var self = this;
	return self._code;
};

// ↑ API Errorクラスの定義 ↑

// ↓ Conditionクラスの定義 ↓

/**
 * Conditionsのコンストラクタ
 */
FW.API.Conditions = function () {
	var self = this;

	// パラメータ格納用
	self._params = [];
};

// 自動でURIエンコードするかどうかのフラグ
FW.API.Conditions.prototype.autoEncodeURI = false;

/**
 * パラメータを設定する
 *
 * @param {Object} key キー
 * @param {Object} value String/Integer/Array (1次元配列)
 */
FW.API.Conditions.prototype.setParam = function (key, value) {
	var self = this;

	// パラメータの値は、配列で保持するようにする
	if (S.isArray(value)) {
		// 値が配列の場合は、そのまま保持
		self._params.push([key, value]);
	} else if (typeof value !== 'undefined' && value !== null) {
		// 値が、単一の値であれば配列にして保持
		self._params.push([key, [value]]);
	} else {
		// undefined,null が設定された場合は値を削除する
		self.removeParam(key);
	}
};

/**
 * 指定されたキーのパラメータを削除する
 *
 * @param {Object} key キー
 */
FW.API.Conditions.prototype.removeParam = function (key) {
	var self = this;
	var removeIndexList = [];
	// 削除したい、キーに値が設定されていれば削除する
	for (var i = 0; i < self._params.length; i++) {
		if (self._params[i]) {
			var paramKey = self._params[i][0];
			if (key === paramKey) {
				removeIndexList.push(i);
			}
		}
	}

	for (var i = removeIndexList.length - 1; i >= 0; i--) {
		delete self._params[removeIndexList[i]];
	}
};

/**
 * パラメータを全て削除する
 */
FW.API.Conditions.prototype.removeParamAll = function () {
	var self = this;
	self._params = {};
};

/**
 * パラメータからクエリ文字列を生成する
 */
FW.API.Conditions.prototype.getQueryString = function () {
	var self = this;
	var queryString = '';
	for (var i = 0; i < self._params.length; i++) {
		var param = self._params[i];

		if (param) {
			var key = param[0];
			var value = param[1];
			var valueCount = value.length;
			if (self.autoEncodeURI) {
				key = encodeURIComponent(key);
			}

			// パラメータは、全て配列として保持しているため、単一値、複数値で処理は共通
			for (var j = 0; j < valueCount; j++) {
				if (queryString.length > 0) {
					queryString += '&';
				}
				var v = value[j];
				if (self.autoEncodeURI) {
					v = encodeURIComponent(v);
				}
				queryString += key + '=' + v;
			}
		}
	}
	return queryString;
};

// ↑ Conditionクラスの定義 ↑

// ↓ ResponseConverterクラスの定義 ↓

/**
 * converterのコンストラクタ
 */
FW.API.ResponseConverter = function () {
	// コンストラクタで行いたい処理は、特にありません
};

FW.API.ResponseConverter.prototype.htmlEscape = function (str) {
	if (typeof str === 'undefined' || str === null || typeof str === 'Number') { return str; }
	return S.htmlEscape(str);
};

// 共通で使用するURI情報
FW.API.ResponseConverter.URI = {};

// NoImageのパス
FW.API.ResponseConverter.URI.NoImage = 'https://asset01.suumo.jp/sp/img/common/no_image.png?id=20241127360bc0ad100';

// resizeImageのパス
FW.API.ResponseConverter.URI.ResizeImage = dataMediatorJs.attr('data-gazo-url');

// CDNのパス
FW.API.ResponseConverter.URI.CDN_URL = dataMediatorJs.attr('data-cdn-url');

/**
 * 空の文字列(undefined,nullを含む)をデフォルトで"-"に変換する。指定があれば、指定された値に変換する。 それ以外であれば、そのまま返す
 *
 * @param {String} str チェックする文字列
 * @param {String} convertedValue 変換する際に、使用する値
 */
FW.API.ResponseConverter.prototype.convertEmptyString = function (str,
	convertedValue) {
	var resultString = '';

	// convertedValueが設定されていなければ、デフォルトで'-'を設定する
	var cValue = (typeof convertedValue !== 'undefined' && convertedValue !== null)
		? convertedValue : '-';

	// undefined,null,空文字の場合に、変換したい文字列に変更
	if (typeof str === 'undefined' || str === null || str === '') {
		resultString = cValue;
	} else {
		resultString = str;
	}
	return resultString;
};

/**
 * 画像Urlが空の文字列(undefined,nullを含む)の場合にNoImage画像のパスに変換する。それ以外であれば、そのまま返す。
 *
 * @param {String} imgUrl 画像URL
 */
FW.API.ResponseConverter.prototype.convertEmptyImageUrl = function (imgUrl) {
	var resultImgUrl = '';
	if (typeof imgUrl === 'undefined' || imgUrl === null || imgUrl === '') {
		resultImgUrl = FW.API.ResponseConverter.URI.NoImage;
	} else {
		resultImgUrl = imgUrl;
	}
	return resultImgUrl;
};

/**
 * 画像縮小モジュールへ向き先を変更したURLを取得する ※imgUrlがなかった場合は、NoImageのパスに変換される
 *
 * @param {String} imgUrl 画像URL
 * @param {Integer} resizeHeight リサイズ時の縦幅
 * @param {Integer} resizeWidth リサイズ時の横幅
 * @return 画像のパス
 * @TODO: 現在は、賃貸、売買でのみ使用しているので、使用しない(テスト未実施)
 */
FW.API.ResponseConverter.prototype.convertedToResizeUrlFromImageURL = function (
	imgUrl, resizeHeight, resizeWidth) {
	var self = this;

	// NoImage処理も一緒に通す
	imgUrl = self.convertEmptyImageUrl(imgUrl);

	// NoImageでなければ、resizeImageを使用する
	if (imgUrl !== FW.API.ResponseConverter.URI.NoImage) {
		// 画像URLの front/ 以下を抽出する
		var gazoUrlSplitList = imgUrl.split('front/');

		// front/ でsplit出来ていない場合は、resizeImageに設定できないので、resizeImageを行わない
		if (gazoUrlSplitList.length > 1) {
			// resizeImageのURLに付加する画像URL
			var gazoUrl = encodeURIComponent(gazoUrlSplitList[1]);

			// resizeImageに送る縦幅と横幅
			var sizeInfo = '&amp;w=' + resizeWidth + '&amp;h=' + resizeHeight;

			// URL組立
			imgUrl = FW.API.ResponseConverter.URI.ResizeImage + gazoUrl +
				sizeInfo;
		}
	}

	return imgUrl;
};

/**
 * 1行分のデータを表示するためのHTMLで構成されたデータに変換し取得する ※三表示
 *
 * @param data 1レコード分のデータ
 */
FW.API.ResponseConverter.prototype.convertedHTMLFromDataForSan = function (data) {
	throw 'システムエラー'; // サブクラスで実装してください
};

/**
 * 1行分のデータを表示するためのHTMLで構成されたデータに変換し取得する ※田表示
 *
 * @param data 1レコード分のデータ
 */
FW.API.ResponseConverter.prototype.convertedHTMLFromDataForTa = function (data) {
	throw 'システムエラー'; // サブクラスで実装してください
};

/**
 * 1行分のデータを表示するためのHTMLで構成されたデータに変換し取得する ※口表示
 *
 * @param data 1レコード分のデータ
 */
FW.API.ResponseConverter.prototype.convertedHTMLFromDataForKuchi = function (
	data) {
	throw 'システムエラー'; // サブクラスで実装してください
};

// ↑ ResponseConverterクラスの定義 ↑

// ↓ DataMediatorクラスの定義 ↓

/**
 * DataMediatorクラスのコンストラクタ ※主にAPI処理と、画面で表示するデータの管理を行う
 */
FW.DataMediator = function () {
	var self = this;

	// 使用するAPIクラス ※1つしか定義していないが、Mediator毎に使用する分だけ、定義してください
	self._apiClass = null;

	// 生成したFW.API(及びサブクラス)の入れもの
	self._api = null;
	// 生成したFW.API.Conditions(及びサブクラス)の入れもの
	self._conditions = null;
	// 生成したFW.API.ResponseConverter(及びサブクラス)の入れもの
	self._converter = null;
	// 総件数
	self._totalHits = -1;
	// 現在取得しているデータの件数
	self._nowDataCount = 0;
};

/**
 * DataMediatorの処理をキャンセルさせる ※今回はAPI処理に限る
 */
FW.DataMediator.prototype.cancel = function () {
	var self = this;
	if (self._api && self._api.cancel) {
		self._api.cancel();
	}
	self._api = null;
};

/**
 * 初期検索処理 (設定されたConditionを使用した最初の検索)
 */
FW.DataMediator.prototype.initList = function (success, error) {
	throw 'システムエラー'; // サブクラスで実装してください
};

/**
 * 更に読込む処理 (設定されたConditionを使用した更に読込んだ際の処理)
 */
FW.DataMediator.prototype.updateList = function (success, error) {
	throw 'システムエラー'; // サブクラスで実装してください
};

/**
 * まだ、リクエストが行えるかどうかを取得
 */
FW.DataMediator.prototype.canNextRequest = function () {
	throw 'システムエラー'; // サブクラスで実装してください
};

/**
 * 使用するConditionsクラスを生成して取得 ※サブクラスでオーバーライドする
 */
FW.DataMediator.prototype.createConditions = function () {
	throw 'システムエラー'; // サブクラスで実装してください
};

/**
 * 現在設定されているConditionsオブジェクトを取得
 */
FW.DataMediator.prototype.getConditions = function () {
	var self = this;
	return self._conditions;
};

/**
 * Conditionsオブジェクトを設定
 */
FW.DataMediator.prototype.setConditions = function (conditions) {
	var self = this;
	self._conditions = conditions;
};

/**
 * 設定されているConverterオブジェクトを取得
 */
FW.DataMediator.prototype.getConverter = function () {
	var self = this;
	return self._converter;
};

/**
 * 任意の初期値を設定する
 *
 * @param {Object} 連想配列
 */
FW.DataMediator.prototype.setInitialValue = function (options) {
	throw 'システムエラー'; // サブクラスで実装してください
};

/**
 * API処理失敗時の処理
 *
 * @param {Object} レスポンス情報
 * @param {function} エラー用のコールバック
 * @param {Object} その他オプション ※opt { state: エラーの状態("timeout")など, }
 */
FW.DataMediator.prototype._errorApiRequest = function (res, error, opt) {
	var msg;
	if (opt) {
		if (opt.state === -408) {
			msg = FW.Message.NetworkError;
		} else if (opt.state === -99999) {
			msg = FW.Message.ErrorOfIchiran;
		}
	}

	var errorObj = new FW.API.Error(msg);
	if (error) {
		error(errorObj);
	}
};

// ↑ DataMediatorクラスの定義 ↑
