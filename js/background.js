function $(id) {
  return document.getElementById(id);
}
var screenshot = {
  canvas: document.createElement('canvas'),
  // The x coordinate where to start clipping
  startX: 0,
  // The y coordinate where to start clipping
  startY: 0,
  imageWidth: 0,
  imageHeight: 0,
  viewTabUrl: chrome.extension.getURL('screenshot.html'),
  screenshotURIName: 'screenshotURI',

  init: function () {
    this.addMessageListener();
  },

  addMessageListener: function () {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.message === 'capture-selected-area') {
        var positions = request.positions;
        screenshot.startX = positions.startX;
        screenshot.startY = positions.startY;
        screenshot.imageWidth = positions.imageWidth;
        screenshot.imageHeight = positions.imageHeight;
        screenshot.captureSelectedArea();
      }
    });
  },

  sendMessage: function(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.sendMessage(tab.id, message, callback);
    });
  },

  showSelectionArea: function () {
    screenshot.sendMessage({message: 'show-selection-area'}, null);
  },

  captureSelectedArea: function () {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
      var image = new Image();
      image.onload = function () {
        screenshot.canvas.width = screenshot.imageWidth;
        screenshot.canvas.height = screenshot.imageHeight;
        var context = screenshot.canvas.getContext('2d');
        context.drawImage(image, screenshot.startX, screenshot.startY,
          screenshot.imageWidth, screenshot.imageHeight, 0, 0, screenshot.imageWidth, screenshot.imageHeight);
        screenshot.postImage();
      }
      image.src = dataUrl;
    });
  },

  captureVisibleScreen: function () {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
      var image = new Image();
      image.onload = function () {
        var width = image.width;
        var height = image.height;
        screenshot.canvas.width = width;
        screenshot.canvas.height = height;
        var context = screenshot.canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height, 0, 0, width, height);
        screenshot.postImage();
      }
      image.src = dataUrl;
    });
  },

  postImage: function () {
     localStorage[this.screenshotURIName] = screenshot.canvas.toDataURL('image/png');
     chrome.tabs.create({url: screenshot.viewTabUrl}, function(tab) {});
  },

  imageURIToBlob: function () {
    var dataURI = localStorage[this.screenshotURIName];
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }
}

screenshot.init();

