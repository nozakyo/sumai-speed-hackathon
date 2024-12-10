(function () {
	var dataScript = window.document.getElementById('loginScript-data-script');
	var isLogin = dataScript.getAttribute('data-isLogin');
	var kid;
  
	if (isLogin) {
	  kid = dataScript.getAttribute('data-kid');
	  S.isLogin = true;
	  S.suumoSpUrl = dataScript.getAttribute('data-suumoSpUrl');
	} else {
	  S.memberRegistUrl = dataScript.getAttribute('data-memberRegistUrl');
	}
  
	if (kid) window.kid = kid;
  }());