/**
 * ヘッダー用スクリプト
 */

// 都道府県情報
var todofukenInfo = {
	'01': 'hokkaido',
	'02': 'aomori',
	'03': 'iwate',
	'04': 'miyagi',
	'05': 'akita',
	'06': 'yamagata',
	'07': 'fukushima',
	'13': 'tokyo',
	'14': 'kanagawa',
	'11': 'saitama',
	'12': 'chiba',
	'08': 'ibaraki',
	'10': 'gumma',
	'09': 'tochigi',
	'19': 'yamanashi',
	'15': 'niigata',
	'20': 'nagano',
	'16': 'toyama',
	'17': 'ishikawa',
	'18': 'fukui',
	'23': 'aichi',
	'21': 'gifu',
	'22': 'shizuoka',
	'24': 'mie',
	'27': 'osaka',
	'28': 'hyogo',
	'26': 'kyoto',
	'25': 'shiga',
	'29': 'nara',
	'30': 'wakayama',
	'36': 'tokushima',
	'37': 'kagawa',
	'38': 'ehime',
	'39': 'kochi',
	'31': 'tottori',
	'32': 'shimane',
	'33': 'okayama',
	'34': 'hiroshima',
	'35': 'yamaguchi',
	'40': 'fukuoka',
	'41': 'saga',
	'42': 'nagasaki',
	'43': 'kumamoto',
	'44': 'oita',
	'45': 'miyazaki',
	'46': 'kagoshima',
	'47': 'okinawa',
};

var todofukenAreaInfo = {
	'01': '010',
	'02': '020',
	'03': '020',
	'04': '020',
	'05': '020',
	'06': '020',
	'07': '020',
	'13': '030',
	'14': '030',
	'11': '030',
	'12': '030',
	'08': '030',
	'10': '030',
	'09': '030',
	'19': '040',
	'15': '040',
	'20': '040',
	'16': '040',
	'17': '040',
	'18': '040',
	'23': '050',
	'21': '050',
	'22': '050',
	'24': '050',
	'27': '060',
	'28': '060',
	'26': '060',
	'25': '060',
	'29': '060',
	'30': '060',
	'36': '070',
	'37': '070',
	'38': '070',
	'39': '070',
	'31': '080',
	'32': '080',
	'33': '080',
	'34': '080',
	'35': '080',
	'40': '090',
	'41': '090',
	'42': '090',
	'43': '090',
	'44': '090',
	'45': '090',
	'46': '090',
	'47': '090',
};

/**
 * cookie情報取得
 */
var getCookie = function(key) {
	var cookieString = document.cookie;
	var cookieKeyArray = cookieString.split(';');
	for (var i=0; i<cookieKeyArray.length; i++) {
		var targetCookie = cookieKeyArray[i];
		targetCookie = targetCookie.replace(/^\s+|\s+$/g, '');
		var valueIndex = targetCookie.indexOf('=');
		if (targetCookie.substring(0, valueIndex) == key) {
			return unescape(targetCookie.slice(valueIndex + 1));
		}
	}
	return '';
}
