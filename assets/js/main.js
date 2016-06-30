var image_select   = document.getElementById('image-select');
var pixel_input    = document.getElementById('pixel-size');
var canvas = document.getElementById('canvas');

image_select.addEventListener('change', displayImage, false);

// http://codepen.io/thelifemgmt/pen/CeLqA
pixel_input.addEventListener('input', function() {
  document.getElementById('range-value').innerHTML = this.value;
}, false);

var img;

// Display the chosen image on screen
function displayImage() {
  img = new Image();

  img.onload = function() {
    var ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    pixel_input.addEventListener('change', pixelateImage, false);
    pixelateImage();
  };

  img.src = URL.createObjectURL(image_select.files[0]);
}

// Gather image pixel info, draw larger average color pixels
function pixelateImage() {
  var pixel_size = parseInt(pixel_input.value, 10);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // No need to do any pixelization if pixel size is 1
  if (pixel_size <= 1) return;

  for (var x = 0; x < img.width; x += pixel_size) {
    for (var y = 0; y < img.height; y += pixel_size) {

      // Don't sample pixels if they're off the image
      var x_pixel_offset = pixel_size;
      var y_pixel_offset = pixel_size;
      if (x + pixel_size >= img.width) {
        x_pixel_offset = pixel_size - ((x + pixel_size) - img.width);
      }
      if (y + pixel_size >= img.height) {
        y_pixel_offset = pixel_size - ((y + pixel_size) - img.height);
      }

      // Get the pixel colors from given area of image
      var rgba_list = ctx.getImageData(x, y, x_pixel_offset, y_pixel_offset).data;

      // Average the individual image pixel colors to
      // make the larger pixel color
      var rgba = [0, 0, 0, 0];
      for (var i = 0; i < rgba_list.length; i++) {
        rgba[i % 4] += rgba_list[i];
      }

      for (i = 0; i < rgba.length; i++) {
        rgba[i] = Math.floor(rgba[i] / (rgba_list.length / 4));
      }

      // Draw new larger pixel to canvas
      ctx.fillStyle = 'rgba(' +
                        rgba[0] + ',' +
                        rgba[1] + ',' +
                        rgba[2] + ',' +
                        rgba[3] + ')';
      ctx.fillRect(x, y, pixel_size, pixel_size);
    }
  }
}
