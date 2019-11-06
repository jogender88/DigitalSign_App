var app = angular.module("signApp", []);
var clickX = [];
var clickY = [];
var clickDrag = [];

app.controller('buttonCtrl', ['$scope', function($scope) {
    $scope.clearcan = function() {
        clearcanvas();
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

function clearcanvas() {
    clickX = []
    clickY = []
    clickDrag = []
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function checkcanvas() {
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
app.directive("drawing", function($window) {
    return {
        restrict: "A",
        link: function(scope, element) {
            var paint;
            var canvas = element[0]
            canvas.width = window.innerWidth - 100;
            canvas.height = window.innerHeight - 100;
            var ctx = element[0].getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var cursorPosition = { x: 0, y: 0 };
            element.bind('mousemove', function(event) { webDraw(event) });
            element.bind('mousedown', function(event) { setPosition(event) });
            element.bind('mouseenter', function(event) { setPosition(event) });
            element.bind("touchmove", function(e) {
                if (paint) {
                    var touch = e.touches[0];
                    addCoordinates(touch.pageX - touch.target.offsetLeft, touch.pageY - touch.target.offsetTop, true);
                    mobileDraw();
                }
                e.preventDefault();
            });
            element.bind("touchstart", function(e) {
                var touch = e.touches[0];
                paint = true;
                addCoordinates(touch.pageX - touch.target.offsetLeft, touch.pageY - touch.target.offsetTop);
                mobileDraw();
                e.preventDefault();
            });
            element.bind("touchend", function(e) { paint = false; });

            function setPosition(e) {
                cursorPosition.x = e.offsetX;
                cursorPosition.y = e.offsetY;
            }

            function addCoordinates(x, y, dragging) {
                clickX.push(x);
                clickY.push(y);
                clickDrag.push(dragging);
            }

            function webDraw(e) {
                if (e.buttons !== 1) return;
                ctx.strokeStyle = "#df4b26";
                ctx.lineJoin = "round";
                ctx.lineWidth = 5;
                ctx.beginPath(); // begin
                ctx.moveTo(cursorPosition.x, cursorPosition.y); // from
                setPosition(e);
                ctx.lineTo(cursorPosition.x, cursorPosition.y); // to
                ctx.stroke(); // draw it!
            }

            function mobileDraw() {

                ctx.strokeStyle = "#df4b26";
                ctx.lineJoin = "round";
                ctx.lineWidth = 5;
                for (var i = 0; i < clickX.length; i++) {
                    ctx.beginPath(); // begin
                    if (clickDrag[i] && i) {
                        ctx.moveTo(clickX[i - 1], clickY[i - 1]); // from
                    } else {
                        ctx.moveTo(clickX[i] - 1, clickY[i]); // from
                    }
                    ctx.lineTo(clickX[i], clickY[i]); // to
                    ctx.closePath();
                    ctx.stroke(); // draw it!
                }
            }
        }
    };
});