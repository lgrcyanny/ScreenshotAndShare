$(function () {
  var renrenAuthChecker = {
    successURI: /graph\.renren\.com\/oauth\/login_success\.html/ig,
    isAuthorized: function () {
      var href = window.location.href.toString();
      return href.match(renrenAuthChecker.successURI);
    },
    check: function () {
      //if (this.isAuthorized()) {
        this.sendAuthInfoToExtension();
      //}
    },
    sendAuthInfoToExtension: function () {
      var hash = window.location.hash;
      hash = decodeURIComponent(hash);
      values = hash.substring(1).split('&');
      for (var i = 0; i < values.length; i++) {
        var temp = values[i].split('=');
        localStorage[temp[0]] = temp[1];
      }
      chrome.runtime.sendMessage({
        message: 'renren-auth-success',
        authInfo: {
          accessToken: localStorage['access_token'],
          expiresIn: localStorage['expires_in'],
          scope: localStorage['scope']
        }
      }, function (response) {});
    }
  }
  renrenAuthChecker.check();
});