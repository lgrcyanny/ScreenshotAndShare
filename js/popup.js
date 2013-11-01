$(document).ready(function () {
  $('#capture-visible-page').click(function () {
    var bg = chrome.extension.getBackgroundPage();
    if (bg) {
      bg.screenshot.captureVisibleScreen();
    }
    window.close();
  });

  $('#capture-selection-area').click(function () {
    var bg = chrome.extension.getBackgroundPage();
    if (bg) {
      bg.screenshot.showSelectionArea();
    }
    window.close();
  });

  $('#capture-whole-page').click(function () {
    var bg = chrome.extension.getBackgroundPage();
    if (bg) {
      bg.screenshot.captureWholePage();
    }
    window.close();
  });
});