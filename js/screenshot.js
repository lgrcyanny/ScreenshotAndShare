$(document).ready(function () {
  var photoshop = {
    init: function () {
      photoshop.setImageView();
      photoshop.addActionListener();
    },

    setImageView: function () {
      var screenshotURI = localStorage.getItem('screenshotURI');
      var img = new Image();
      img.onload = function () {
        var canvas = document.getElementById('screenshot-canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      }
      img.src = screenshotURI;
    },

    saveImage: function () {
      var canvas = document.getElementById('screenshot-canvas');
      Canvas2Image.saveAsPNG(canvas);
    },

    addActionListener: function () {
      $('#save-btn').click(function () {
        photoshop.saveImage();
      });
    }
  }
  photoshop.init();
});