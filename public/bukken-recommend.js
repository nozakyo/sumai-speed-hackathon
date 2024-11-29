(function() {

	// 新築MSレコメンド用ローカルストレージKEY
	var MANSION_RECOMMEND_LOCAL_STRAGE_KEY = 'smp.mansion.bukken.recommend';
	// 閲覧回数用0埋め桁数。一応8桁で対応
	var ZERO_COUNT = 8;
	// 送信最大件数
	var SEND_MAX = 50;
	// 蓄積最大件数
	var STORE_MAX = 50;
	// プロジェクトコード長
	var NC_LENGTH = 8;

	/**
	 * プロジェクトコード、最新閲覧日付、閲覧回数のデータになるようにデータ集計を行う。
	 *
	 * @param object localStorageData 集計対象データ
	 * @param string targetDate 最終集計日付
	 * @return object プロジェクトコード、最終集計日付を含む最新閲覧日（YYYY/MM/DD）、最終集計日付までの閲覧回数総和のオブジェクト
	 */
	function sumUpLocalStorageData(localStorageData, targetDate) {
		// 集計後データ
		var sumUpData = {};
		for ( var nc in localStorageData) {
			// プロジェクトコードが正しくない場合は集計対象から外す
			if (nc.length !== NC_LENGTH) {
				continue;
			}
			if (localStorageData.hasOwnProperty(nc)) {
				var data = getSumUpData(localStorageData, nc, targetDate);
				if (data !== null) {
					sumUpData[nc] = data;
				}
			}
		}
		return sumUpData;
	}

	/**
	 * 1物件の集計結果を返す
	 *
	 * @param object localStorageData 集計対象データ
	 * @param string nc プロジェクトコード
	 * @param string targetDate 最終集計日付
	 * @return object プロジェクトコードに紐付く最終集計日付を含む最新閲覧日（YYYY/MM/DD）、最終集計日付までの閲覧回数総和のオブジェクト
	 */
	function getSumUpData(localStorageData, nc, targetDate) {
		// 集計結果（初期化）
		var sumUpData = null;
		// 送信日付（初期化）
		var sendDate = '19700101';
		var dateData = localStorageData[nc];
		var count = 0;
		for ( var etsuranDate in dateData) {
			// 対象日付以前であれば閲覧数を加算
			if (etsuranDate <= targetDate) {
				count += dateData[etsuranDate];
				// 新しい日付に更新
				if (etsuranDate > sendDate) {
					sendDate = etsuranDate;
				}
			}
		}
		// 閲覧数があれば保存
		if (count > 0) {
			sumUpData = {
				'date': sendDate.substr(0, 4) + '/' + sendDate.substr(4, 2) +
					'/' + sendDate.substr(6, 2),
				'count': '' + count
			};
		}
		return sumUpData;
	}

	/**
	 * データを連結・ソートして返す
	 *
	 * @param object data データ
	 * @return array 閲覧日付、閲覧回数、プロジェクトコードを連結した文字列の配列
	 */
	function concatSortData(data) {

		var zero = '';
		for (var i = 0; i < ZERO_COUNT; i++) {
			zero += '0';
		}
		// 連結データ初期化
		var compareData = [];
		// 連結配列作成
		for ( var nc in data) {
			if (data.hasOwnProperty(nc)) {
				// 閲覧回数を0埋めする。
				var etsuranNum = (zero + data[nc]['count']).slice(-ZERO_COUNT);
				compareData.push(data[nc]['date'] + etsuranNum + nc);
			}
		}
		// 文字コード順にソート
		return compareData.sort();
	}

	/**
	 * ローカルストレージのデータを集計する
	 */
	window.createMansionRecommendBukkenParams = function() {

		// 本日日付取得
		var today = getOnedayString(1, 1);
		// POSTで送信するパラメータ
		var sendParams = [];
		// localStrageデータ
		var localStorageData = localStorageUtil
			.get(MANSION_RECOMMEND_LOCAL_STRAGE_KEY);
		// 一時保存データ（集計データ）
		var tmpData = sumUpLocalStorageData(localStorageData, today);

		// 50件以上データ作成が行われた場合は、50件まで削除する
		// 削除順は、最新閲覧日付が古い、閲覧回数が少ない、プロジェクトコードが若い、の順番
		if (Object.keys(tmpData).length > SEND_MAX) {
			// 削除件数
			var deleteNum = Object.keys(tmpData).length - SEND_MAX;
			// 条件比較用データ
			var compareData = concatSortData(tmpData);

			// 先頭から削除していく
			for (var i = 0; i < deleteNum; i++) {
				var deleteNc = compareData[i].slice(-NC_LENGTH);
				delete tmpData[deleteNc];
			}
		}

		// 送信用パラメータに整形
		for ( var nc in tmpData) {
			if (tmpData.hasOwnProperty(nc)) {
				sendParams.push(JSON.stringify({
					'nc': nc,
					'date': tmpData[nc]['date'],
					'count': tmpData[nc]['count']
				}));
			}
		}

		return sendParams;
	};

	/**
	 * ローカルストレージにプロジェクトコード、閲覧日、閲覧回数を蓄積する。
	 *
	 * @param string projectCd プロジェクトコード
	 */
	window.storeMansionRecommendBukken = function(projectCd) {

		// ローカルストレージから情報取得
		var localStorageData = localStorageUtil
			.get(MANSION_RECOMMEND_LOCAL_STRAGE_KEY);
		if (localStorageData === null) {
			localStorageData = {};
		}

		// 本日日付取得
		var today = getOnedayString(1, 1);

		// ローカルストレージにプロジェクトコードが存在する場合
		if (projectCd in localStorageData) {
			// プロジェクトコードが存在する場合、かつ、日付が存在する場合、カウントアップ
			if (today in localStorageData[projectCd]) {
				localStorageData[projectCd][today] += 1;
			} else {
				// プロジェクトコードが存在する場合、かつ、日付が存在しない場合、カウント1で最後に追加
				localStorageData[projectCd][today] = 1;
			}
		} else {
			// プロジェクトコードが存在しない場合、本日日付にカウント1で最後に追加
			localStorageData[projectCd] = {};
			localStorageData[projectCd][today] = 1;
		}

		// 追加後、1物件あたり50件以上になった場合、閲覧日付の古い順に削除
		deleteDatePerBukken(localStorageData);

		// 保持物件数が51物件以上になった場合、50件になるまで物件情報を削除
		deleteSendBukken(localStorageData);

		// ローカルストレージに戻す
		localStorageUtil.set(MANSION_RECOMMEND_LOCAL_STRAGE_KEY,
			localStorageData);
	};

	/**
	 * 全物件に対して、不要な日付データを削除する
	 *
	 * @param object localStorageData 精査対象データ
	 */
	function deleteDatePerBukken(localStorageData) {
		for ( var nc in localStorageData) {
			// プロジェクトコードの桁数が正しくない場合は、データを削除する
			if (nc.length !== NC_LENGTH) {
				delete localStorageData[nc];
				continue;
			}
			if (localStorageData.hasOwnProperty(nc)) {
				deleteDateData(localStorageData, nc);
			}
		}
	}

	/**
	 * 1物件当たりのデータが最大件数を超えていた場合に、最大件数になるまで削除する
	 *
	 * @param object localStorageData 精査対象データ
	 * @param string nc プロジェクトコード
	 */
	function deleteDateData(localStorageData, nc) {
		var bukkenDataLength = Object.keys(localStorageData[nc]).length;
		if (bukkenDataLength > STORE_MAX) {
			var deleteDateCount = bukkenDataLength - STORE_MAX;
			var dateKeys = Object.keys(localStorageData[nc]);
			// 先頭から削除していく
			dateKeys.sort();
			for (var i = 0; i < deleteDateCount; i++) {
				delete localStorageData[nc][dateKeys[i]];
			}
		}
	}

	/**
	 * 精査対象データが最大件数を超えていた場合に、集計結果をもとに最大件数になるまで削除する
	 *
	 * @param object localStorageData 精査対象データ
	 */
	function deleteSendBukken(localStorageData) {
		var localStorageDataLength = Object.keys(localStorageData).length;
		if (localStorageDataLength > STORE_MAX) {
			// 本日日付取得
			var today = getOnedayString(1, 1);
			var deleteBukkenCount = localStorageDataLength - STORE_MAX;
			// 当日含む集計データ取得
			var sumData = sumUpLocalStorageData(localStorageData, today);

			// 削除順は、最新閲覧日付が古い、閲覧回数が少ない、プロジェクトコードが若い、の順番
			// 条件比較用データ
			var compareData = concatSortData(sumData);

			// 先頭から削除していく
			for (var j = 0; j < deleteBukkenCount; j++) {
				var deleteNc = compareData[j].slice(-NC_LENGTH);
				delete localStorageData[deleteNc];
			}
		}
	}
})();