$(function () {
  const APP_KEY = 940899132;
  const APP_SECRECT = "71035bec5d8ed2c801593d4ad784f146";
  const REDIRECT_URI = "http://apps.weibo.com/jianyingjietu";
  const GET_TOKEN_URI = "https://api.weibo.com/oauth2/access_token";
  var weiboAuth = {
    init: function () {
      this.getAccessToken();
    },
    getAccessToken: function () {
      var info = window.location.search;
      var code = info.split("=");
      var self = this;
      if (code.length > 1) {
        code = code[1];
        $.ajax({
          url: GET_TOKEN_URI,
          type: 'POST',
          data: {
            client_id: APP_KEY,
            client_secret:APP_SECRECT,
            grant_type:"authorization_code",
            redirect_uri: REDIRECT_URI,
            code: code
          },
          success: function (data) {
            console.log(data);
            self.sendInfoToBackground(data);
          }
        });
      }
    },
    sendInfoToBackground: function (data) {
      chrome.runtime.sendMessage({
        message: 'weibo-auth-success',
        authInfo: data
      }, function (response) {});
    }
  }
  weiboAuth.init();
});