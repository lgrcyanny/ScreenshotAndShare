$(function () {
  /**
   * Binding shorcut listener to a page with content script
   */
  var shortcutKey = {
    /**
     * The shortcut mapping to messages
     */
    shortcutMap: {
     ctrl_shift_z: 'shortcut-show-selection-area',
     ctrl_shift_y: 'shortcut-capture-visible-screen',
     ctrl_shift_h: 'shortcut-capture-whole-page'
    },
    /**
     * The keyboard codes for necessary keys
     */
    keyboardCodes: {
      ctrl: 17,
      shift: 16,
      z: 90,
      y: 89,
      h: 72
    },

    init: function () {
      this.handleShortcut("z");
      this.handleShortcut("y");
      this.handleShortcut("h");
    },

    sendMessage: function (msg) {
      chrome.runtime.sendMessage({message: msg}, function (response) {});
    },

    handleShortcut: function (type) {
      var self = this;
      var typeCode = self.keyboardCodes[type];
      $(document).keydown(function (e) {
        if (e.ctrlKey && e.shiftKey && e.which === typeCode) {
          var message = 'ctrl_shift_' + type;
          self.sendMessage(self.shortcutMap[message]);
        }
      });
    }
  }

  shortcutKey.init();
});
