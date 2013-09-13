$(function () {
  var page = {
    scrollTop: 0,
    scrollLeft: 0,
    startX: 550,
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
      this.lockScroll();
      console.log(page);
      $('body').prepend('<div id="jy-drag-protector"></div>');
      $('#jy-drag-protector').append('<div id="jy-drag-area"></div>');
      $('#jy-drag-area').append('<div id="jy-selected-area-size">250 * 150</div>');
      $('#jy-drag-area').append('<div id="jy-selected-area" class="ui-widget-content"><div class="ui-widget-header"></div></div>')
      $('#jy-drag-area').append('<div id="jy-drag-action"><button id="jy-drag-action-ok">确定</button><button id="jy-drag-action-cancle">取消</button></div>');

      $('#jy-drag-protector').css({
        'top': page.scrollTop + 'px',
        'left': page.scrollLeft + 'px'
      });

      $('#jy-drag-area').draggable({
        handle: '#jy-selected-area',
        stop: function (event, ui) {
          page.onDragResizeStop(event, ui);
        }
      });

      $('#jy-selected-area').resizable({
        stop: function (event, ui) {
          page.onDragResizeStop(event, ui);
        }
      });
      this.addActionListener();
    },

    onDragResizeStop: function (event, ui) {
      var offset = $('#jy-selected-area').offset();
      page.startX = parseInt(offset.left);
      page.startY = parseInt(offset.top);
      page.imageWidth = parseInt($('#jy-selected-area').width());
      page.imageHeight = parseInt($('#jy-selected-area').height());
      $('#jy-selected-area-size').text(page.imageWidth + ' * ' + page.imageHeight);
      console.log(page);
    },

    hideSelectionArea: function () {
      $('#jy-drag-protector').css({display: 'none'});
      this.unlockScroll();
    },

    lockScroll: function () {
      page.scrollTop = $('body').scrollTop();
      page.scrollLeft = $('body').scrollLeft();
      var temp = -page.scrollTop;
      $('html').addClass('jy-no-scroll').css('top', temp + 'px');
    },

    unlockScroll: function () {
      var scrollTop = parseInt($('html').css('top'));
      $('html').removeClass('jy-no-scroll');
      $('html, body').scrollTop(-scrollTop);
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

