const APP_KEY = 940899132;

var weibo = {
  description: '来自剪影截图',
  uploadURL: 'https://upload.api.weibo.com/2/statuses/upload.json',
  successRedirect: 'http://www.weibo.com',

  init: function () {
    this.addMessageListener();
  },


  addMessageListener: function () {
    var self = this;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.message === 'weibo-auth-success') {
        self.postImage(request.authInfo);
      }
    });
  },

  postImage: function(authInfo) {
    var imageForm = new FormData();
    var self = this;
    var imageFile = screenshot.imageURIToBlob();
    // authInfo is string, need to be json parse
    authInfo = JSON.parse(authInfo);
    imageForm.append('access_token', authInfo.access_token);
    imageForm.append('status', self.description);
    imageForm.append('pic', imageFile);
    imageForm.enctype = "multipart/form-data";
    imageForm.encoding = "multipart/form-data";
    var url = self.uploadURL;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status == 200) {
        self.redirect();
      } else {
        console.log(xhr.responseText);
      }
    }
    xhr.send(imageForm);
  },

  /**
   * Redirect to chrome screenshot.html
   */
  redirect: function () {
    var self = this;
    chrome.tabs.update(null, {url: self.successRedirect}, function (tab) {})
  }
}

weibo.init();