$(document).ready(function () {
  var photoshop = {
    screenshotURI: localStorage.getItem('screenshotURI'),
    canvas: document.getElementById('screenshot-canvas'),

    init: function () {
      photoshop.setImageView();
      photoshop.optimizeImageView();
      photoshop.addActionListener();
    },

    setImageView: function () {
      var img = new Image();
      img.onload = function () {
        photoshop.canvas.width = img.width;
        photoshop.canvas.height = img.height;
        var ctx = photoshop.canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      }
      img.src = photoshop.screenshotURI;
    },

    optimizeImageView: function () {
      var docWidth = window.innerWidth;
      if (photoshop.canvas.width < docWidth) {
        $('#screenshot-view').css('margin-left', '30px');
      }
    },

    saveImage: function () {
      Canvas2Image.saveAsPNG(photoshop.canvas);
    },

    addActionListener: function () {
      $('#save-btn').click(function () {
        photoshop.saveImage();
      });

      $('#renren-share-btn').click(function () {
        renrenShare.share(photoshop.screenshotURI);
      });
    }
  };
  photoshop.init();
});