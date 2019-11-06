$('#colorpicker').on('change', function() {
    $('#colorpicker').val(this.value);
});
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// last known position
var pos = { x: 0, y: 0 };

// window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

// new position from mouse event
function setPosition(e) {
    pos.x = e.offsetX;
    pos.y = e.offsetY;
}

function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = document.getElementById("pensize").value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById("colorpicker").value;

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to
    ctx.stroke(); // draw it!
}

function clearcan() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveSign() {
    var res = checkcanvas();
    if (res) {
        var signd = canvas.toDataURL("image/png", 0.8);
        console.log(signd)
        var img = new Image();
        img.src = signd
        var link = document.createElement('a');
        link.href = img.src;
        link.download = 'sign.png';
        link.click();
    } else {
        alert("Please sign first")
    }
}

function checkcanvas() {
    var drawn = null;
    var d = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var len = d.data.length;
    for (var i = 0; i < len; i++) {
        if (d.data[i] != 255) {
            drawn = true;
            break;
        } else {
            drawn = false;
        }
    }
    return drawn
}