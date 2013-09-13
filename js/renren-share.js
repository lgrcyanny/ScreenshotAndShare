$(function () {
  const APP_ID = 241414;
  const API_KEY = '08670370a49246378204887a79006fcb';
  const SECRET_KEY = '62034d24847b4e9db03c8164afcad3ad';
  const REDIRECT_URI = 'http://graph.renren.com/oauth/login_success.html';
  const RENREN_UPLOAD_URL = 'https://api.renren.com/v2/photo/upload';

  var uiOptions = {
    display: 'page',
    url: 'https://graph.renren.com/oauth/authorize',
    method: 'GET',
    style : {
      top : 150,
      width : 570,
      height : 400
    },

    params: {
      client_id: API_KEY,
      redirect_uri: REDIRECT_URI,
      response_type: 'token',
      scope: 'photo_upload read_user_photo',
      display: 'page',
      x_renew: true
    },

    onComplete : function(response){
        console.log("complete: " + response);
    }
  }

  var renrenShare = {
    init: function () {
      Renren.init({appId: APP_ID});
    },

    share: function () {
      Renren.ui(uiOptions);
    }
  }

  window.renrenShare = renrenShare;

  renrenShare.init();

});