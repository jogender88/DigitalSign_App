var app = angular.module("app", []);

app.controller('myCtrl', ['$scope', function($scope) {
    $scope.count = 0;
    $scope.clearcan = function() {
        var canvas = document.getElementById("canvas")
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    $scope.Save = function() {
        var res = checkcanvas();
        console.log(res)
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
}]);

function checkcanvas() {
    var canvas = document.getElementById("canvas")
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
            console.log(scope, element)
            var ctx = element[0].getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, element[0].width, element[0].height);
            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var lastX;
            var lastY;

            element.bind('mousedown', function(event) {
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else {
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }

                // begins new line
                ctx.beginPath();

                drawing = true;
            });
            element.bind('mousemove', function(event) {
                if (drawing) {
                    // get current mouse position
                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    draw(lastX, lastY, currentX, currentY);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function(event) {
                // stop drawing
                drawing = false;
            });


            function draw(lX, lY, cX, cY) {
                // line from
                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = "black";
                // draw it
                ctx.stroke();
            }
        }
    };
});

// MObile
// element.bind("touchstart", function(e) {
//     getTouchPos(e);
//     mobdraw(e)
// });
// element.bind("touchend", function(e) {});
// element.bind("touchmove", function(e) {
//     getTouchPos(e);
//     mobdraw(e)
// });

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