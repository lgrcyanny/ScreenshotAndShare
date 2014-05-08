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
      switch(request.message) {
      case 'capture-selected-area':
        var positions = request.positions;
        screenshot.startX = positions.startX;
        screenshot.startY = positions.startY;
        screenshot.imageWidth = positions.imageWidth;
        screenshot.imageHeight = positions.imageHeight;
        screenshot.captureSelectedArea();
        break;
      case 'shortcut-show-selection-area':
        screenshot.showSelectionArea();
        break;
      case 'shortcut-capture-visible-screen':
        screenshot.captureVisibleScreen();
        break;
      case 'shortcut-capture-whole-page':
        screenshot.captureWholePage();
        break;
      case 'shortcut-hide-selection-area':
        screenshot.hideSelectionArea();
        break;
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

  hideSelectionArea: function () {
    screenshot.sendMessage({
      message: 'hide-selection-area'
    }, null);
  },

  captureSelectedArea: function () {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
      var image = new Image();
      image.onload = function () {
        screenshot.canvas.width = screenshot.imageWidth;
        screenshot.canvas.height = screenshot.imageHeight;
        var context = screenshot.canvas.getContext('2d');
        // Clipping the image with canvas
        // context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
        // sx: The x coordinate where to start clipping
        // sy: The y coordinate where to start clipping
        // swidth: The width of the clipped image
        // sheight: The height of the clipped image
        // x: The x coordinate where to place the image on the canvas
        // y: The y coordinate where to place the image on the canvas
        // width: The width of the image to use (stretch or reduce the image)
        // height: The height of the image to use (stretch or reduce the image)
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

  captureWholePage: function () {
    var viewImgTabUrl = "javascript: window.print();";
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var currentTab = tabs[0];
      chrome.tabs.update(currentTab.id, {url: viewImgTabUrl}, function () {})
    });
  },

  postImage: function () {
     localStorage[this.screenshotURIName] = screenshot.canvas.toDataURL('image/png');
     //this.copyImageToClipboard();
     chrome.tabs.create({url: screenshot.viewTabUrl}, function(tab) {});
  },

  imageURIToBlob: function () {
    var dataURI = localStorage[this.screenshotURIName];
    // window.atob decode the image base-64 encoding
    var byteString = atob(dataURI.split(',')[1]);

    //The ArrayBuffer is a data type that is used to represent a generic, fixed-length binary data buffer.
    var ab = new ArrayBuffer(byteString.length);

    //The Uint8Array type represents an array of 8-bit unsigned integers.
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  },

  /**
   * To use this function must add permissions called "clipboardWrite"
   * "clipboardRead" to manifest.json
   * The copy steps is as follows:
   * 1. set the image src on the background.html
   * 2. document.createRange
   * 3. add the created range to window selection
   * 4. div.focus()
   * 5. document.execCommand('copy');
   */
  copyImageToClipboard: function () {
    var img = $('clipboard-img');
    img.src = localStorage[this.screenshotURIName];
    var div = $('clipboard-div');
    div.contentEditable = true;
    var range;
    //if (document.createRange) {
      range = document.createRange();
      range.selectNodeContents(img);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      img.focus();
      //console.log(img.src);
      //document.execCommand('copy');
      div.addEventListener('keydown', function(e) {
        console.log(e);
      });
      //var e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, keyCode: "67", char: "C", ctrlKey : true, metaKey: true, location: 1});
      //document.dispatchEvent(e);
      var keyEvent = document.createEvent('Events');
      keyEvent.initEvent('keydown', true, true);
      keyEvent.keyCode = 67;
      keyEvent.which = 67;
      keyEvent.metaKey = true;
      //keyEvent.ctrlKey = true;
      //event.initKeyEvent (type, bubbles, cancelable, viewArg,
      // ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg, keyCodeArg, charCodeArg)
      //keyEvent.initKeyboardEvent('keydown', true, false, window, true, false, false, true, 67, 0);
      div.dispatchEvent(keyEvent);
      //div.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, keyCode: "67", key: "c", which: 67, charCode: 0, location: 0}));
    //}
    //div.contentEditable = false;
  }
}

screenshot.init();

