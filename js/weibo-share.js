$(function () {
  const APP_KEY = 940899132;
  const APP_SECRECT = "71035bec5d8ed2c801593d4ad784f146";
  const REDIRECT_URI = "http://apps.weibo.com/jianyingjietu";
  const AUTH_URI = "https://api.weibo.com/oauth2/authorize";

  var weibo = {
    init: function () {
      this.addActionListener();
    },
    addActionListener: function () {
      var self = this;
      $('#weibo-share-btn').click(function () {
        self.oauth2();
      });
    },
    oauth2: function () {
      var link = document.createElement('a');
      link.href = AUTH_URI + "?client_id=" + APP_KEY + "&response_type=code&redirect_uri=" + REDIRECT_URI;
      link.target = '_blank';
      link.click();
    }
  }
  weibo.init();
});