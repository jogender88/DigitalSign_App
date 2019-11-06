var app = angular.module("app", []);
app.controller('myCtrl', ['$scope', function($scope) {
    $scope.clearcan = function() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    $scope.Save = function() {
        var res = checkcanvas();
        if (res) {
            var signd = canvas.toDataURL("image/png", 0.8);
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
}]);

function checkcanvas() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
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
app.directive("drawing", function() {
    return {
        restrict: "A",
        link: function(scope, element) {
            var dragging;
            var ctx = element[0].getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // the last coordinates before the current move
            var pos = { x: 0, y: 0 };
            element.bind('mousemove', function(event) {
                draw(event)
            });
            element.bind('mousedown', function(event) { setPosition(event) });
            element.bind('mouseenter', function(event) { setPosition(event) });

            element.bind("touchstart", function(e) {
                e.preventDefault();
                getTouchPos(e);
                mobdraw(e)
            });
            element.bind("touchend", function(e) {});
            element.bind("touchmove", function(e) {
                e.preventDefault();
                getTouchPos(e);
                dragging = true;
                mobdraw(e, dragging)
            });

            // Get the position of a touch relative to the canvas
            function getTouchPos(e) {
                if (!e)
                    var e = event;

                if (e.touches) {
                    if (e.touches.length == 1) { // Only deal with one finger
                        var touch = e.touches[0]; // Get the information for finger #1
                        pos.x = touch.pageX - touch.target.offsetLeft;
                        pos.y = touch.pageY - touch.target.offsetTop;
                    }
                }
            }

            function setPosition(e) {
                pos.x = e.offsetX;
                pos.y = e.offsetY;

            }

            function draw(e) {
                if (e.buttons !== 1) return;
                ctx.beginPath(); // begin
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = "black"; // color
                ctx.moveTo(pos.x, pos.y); // from
                setPosition(e);
                ctx.lineTo(pos.x, pos.y); // to
                ctx.stroke(); // draw it!
            }

            function mobdraw(e, dragging) {
                ctx.beginPath(); // begin
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.strokeStyle = "black"; // color
                if (dragging) {
                    ctx.moveTo(pos.x, pos.y); // from

                } else {
                    ctx.moveTo(pos.x, pos.y);

                }
                // getTouchPos(e)
                ctx.lineTo(pos.x, pos.y); // to
                ctx.closePath();

                ctx.stroke(); // draw it!
            }
        }
    };
});