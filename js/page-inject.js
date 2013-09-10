$(function () {
  var page = {
    startX: 150,
    startY: 100,
    imageWidth: 250,
    imageHeight: 150,
    init: function () {
      this.addMessageListener();
      this.addActionListener();
    },

    addMessageListener: function () {
      var self = this;
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'show-selection-area') {
          self.showSelectionArea();
        }
      });
    },

    showSelectionArea: function () {
      $('body').prepend('<div id="jy-drag-protector"></div>');
      $('#jy-drag-protector').append('<div id="jy-drag-area"></div>');
      $('#jy-drag-area').append('<div id="jy-selected-area-size">250 * 150</div>');
      $('#jy-drag-area').append('<div id="jy-selected-area" class="ui-widget-content"><div class="ui-widget-header"></div></div>')
      $('#jy-drag-area').append('<div id="jy-drag-action"><button id="jy-drag-action-ok">确定</button><button id="jy-drag-action-cancle">取消</button></div>');
      $('#jy-drag-area').draggable({
        scroll: false,
        handle: '#jy-selected-area',
        stop: function (event, ui) {
          var offset = $('#jy-selected-area').offset();
          page.startX = offset.left
          page.startY = offset.top;
          page.imageWidth = $('#jy-selected-area').width();
          page.imageHeight = $('#jy-selected-area').height();
          $('#jy-selected-area-size').text(page.imageWidth + ' * ' + page.imageHeight);
        }
      });
      $('#jy-selected-area').resizable({
        stop: function (event, ui) {
          var offset = $('#jy-selected-area').offset();
          page.startX = offset.left
          page.startY = offset.top;
          page.imageWidth = $('#jy-selected-area').width();
          page.imageHeight = $('#jy-selected-area').height();
          $('#jy-selected-area-size').text(page.imageWidth + ' * ' + page.imageHeight);
        }
      });
      this.lockScroll();
      this.addActionListener();
    },

    hideSelectionArea: function () {
      $('#jy-drag-protector').css({display: 'none'});
      this.unlockScroll();
    },

    initSelectionArea: function () {
      page.startX = 150;
      page.startY = 100;
      page.imageHeight = 150;
      page.imageWidth = 250;
    },

    lockScroll: function () {
      $('html, body').css({
        overflow: 'hidden',
        height: '100%'
      });
    },

    unlockScroll: function () {
      $('html, body').css({
        overflow: 'auto',
        height: 'auto'
      });
    },

    addActionListener: function () {
      var self = this;
      $('#jy-drag-action-ok').click(function () {
        self.captureSelectionArea();
      });
      $('#jy-drag-action-cancle').click(function () {
        self.hideSelectionArea();
      });
    },

    captureSelectionArea: function () {
      this.hideSelectionArea();
      setTimeout(function () {
        chrome.runtime.sendMessage({
          message: 'capture-selected-area',
          positions: {
            startX: page.startX,
            startY: page.startY,
            imageHeight: page.imageHeight,
            imageWidth: page.imageWidth
          }
        }, function (response) {});
      }, 200);
    }
  }
  page.init();
});