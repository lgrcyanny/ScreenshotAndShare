var renren = {
  description: '截图来自人人剪影',
  uploadURL: 'https://api.renren.com/v2/photo/upload',
  successRedirect: 'http://www.renren.com',

  init: function () {
    renren.addMessageListener();
  },


  addMessageListener: function () {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.message === 'renren-auth-success') {
        renren.postImageToRenren(request.authInfo);
      }
    });
  },

  postImageToRenren: function(authInfo) {
    var renrenForm = new FormData();
    var imageFile = screenshot.imageURIToBlob();
    renrenForm.append('access_token', authInfo.accessToken);
    renrenForm.append('description', renren.description);
    renrenForm.append('file', imageFile, 'screenshot.png');
    var url = renren.uploadURL;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        renren.redirect();
      }
    }
    xhr.send(renrenForm);
  },

  /**
   * Unused function
   * Store access_token to localStorage so that screenshot.html can post image to renren
   * @param  Object info The access token info
   */
  storeAuthInfo: function (info) {
    localStorage['accessToken'] = info.accessToken;
    localStorage['expiresIn'] = info.expiresIn;
    localStorage['scope'] = info.scope;
  },

  /**
   * Redirect to chrome screenshot.html
   */
  redirect: function () {
    chrome.tabs.update(null, {url: renren.successRedirect}, function (tab) {})
  }
}

renren.init();