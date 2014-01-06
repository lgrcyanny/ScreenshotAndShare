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
     ctrl_shift_h: 'shortcut-capture-whole-page',
     esc: 'shortcut-hide-selection-area'
    },
    /**
     * The keyboard codes for necessary keys
     */
    keyboardCodes: {
      ctrl: 17,
      shift: 16,
      z: 90,
      y: 89,
      h: 72,
      esc: 27
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
        } else if (e.which === self.keyboardCodes.esc) {
          self.sendMessage(self.shortcutMap.esc);
        }
      });
    }
  }

  shortcutKey.init();
});
