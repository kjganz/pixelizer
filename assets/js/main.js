var image_select   = document.getElementById('image-select');
var pixel_input    = document.getElementById('pixel-size');
var canvas = document.getElementById('canvas');

image_select.addEventListener('change', displayImage, false);
var img;

function displayImage() {
  img = new Image();

  img.onload = function() {
    var ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    pixel_input.addEventListener('change', pixelateImage, false);
  };

  img.src = URL.createObjectURL(image_select.files[0]);
}

function pixelateImage() {
  var pixel_size = parseInt(pixel_input.value, 10);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (pixel_size <= 1) return;

  for (var x = 0; x < img.width; x += pixel_size) {
    for (var y = 0; y < img.height; y += pixel_size) {

      // Check if pixel size would be off canvas 
      // and clip to canvas edge to stop dark right 
      // and bottom border from happening
      var rgba_list = ctx.getImageData(x, y, pixel_size, pixel_size).data;

      var rgba = [0, 0, 0, 0];
      for (var i = 0; i < rgba_list.length; i++) {
        rgba[i % 4] += rgba_list[i];
      }

      for (i = 0; i < rgba.length; i++) {
        rgba[i] = Math.floor(rgba[i] / (rgba_list.length / 4));
      }

      ctx.fillStyle = 'rgba(' +
                        rgba[0] + ',' +
                        rgba[1] + ',' +
                        rgba[2] + ',' +
                        rgba[3] + ')';
      ctx.fillRect(x, y, pixel_size, pixel_size);
    }
  }
}
