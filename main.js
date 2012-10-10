var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var SC_KeyboardStatus = (function () {
    function SC_KeyboardStatus() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }
    return SC_KeyboardStatus;
})();
var SC_Main = (function () {
    function SC_Main() {
        this.lastTime = Date.now();
        this.colorChangeRate = 20;
    }
    SC_Main.prototype.init = function () {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 512;
        this.canvas.height = 480;
        document.body.appendChild(this.canvas);
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.timeCounter = this.lastTime;
        this.lastFPS = 0;
        this.currentColorValue = 0;
        this.keyboardStatus = new SC_KeyboardStatus();
    };
    SC_Main.prototype.update = function () {
        var now = Date.now();
        var diff = now - this.lastTime;
        var delta = diff / 1000;
        this.updateColorValue(delta);
        this.render();
        this.frameCount++;
        var timePassedSinceLastSecond = now - this.timeCounter;
        if(timePassedSinceLastSecond >= 1000) {
            this.lastFPS = this.frameCount / (timePassedSinceLastSecond / 1000);
            this.timeCounter = now;
            this.frameCount = 0;
        }
        this.lastTime = now;
    };
    SC_Main.prototype.render = function () {
        this.ctx.fillStyle = "rgb(" + this.currentColorValue.toFixed(0) + ", 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgb(255, 0, 0)";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("fps: " + this.lastFPS.toFixed(0) + " value: " + this.currentColorValue, 32, 32);
    };
    SC_Main.prototype.onKeyDown = function (e) {
        switch(e.keyCode) {
            case 38: {
                this.keyboardStatus.up = true;
                break;

            }
            case 39: {
                this.keyboardStatus.left = true;
                break;

            }
            case 40: {
                this.keyboardStatus.down = true;
                break;

            }
            case 37: {
                this.keyboardStatus.right = true;
                break;

            }
        }
        console.log(e.keyCode);
    };
    SC_Main.prototype.onKeyUp = function (e) {
        switch(e.keyCode) {
            case 38: {
                this.keyboardStatus.up = false;
                break;

            }
            case 39: {
                this.keyboardStatus.left = false;
                break;

            }
            case 40: {
                this.keyboardStatus.down = false;
                break;

            }
            case 37: {
                this.keyboardStatus.right = false;
                break;

            }
        }
    };
    SC_Main.prototype.updateColorValue = function (delta_) {
        if(this.keyboardStatus.up || this.keyboardStatus.right) {
            this.currentColorValue += this.colorChangeRate * delta_;
        }
        if(this.keyboardStatus.down || this.keyboardStatus.left) {
            this.currentColorValue -= this.colorChangeRate * delta_;
        }
        this.currentColorValue = Math.max(0, this.currentColorValue);
        this.currentColorValue = Math.min(255, this.currentColorValue);
    };
    return SC_Main;
})();
var SC_Actor = (function () {
    function SC_Actor(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
    }
    return SC_Actor;
})();
var SC_Player = (function (_super) {
    __extends(SC_Player, _super);
    function SC_Player() {
        _super.apply(this, arguments);

    }
    return SC_Player;
})(SC_Actor);
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var main = new SC_Main();
main.init();
document.addEventListener("keydown", function (e) {
    return main.onKeyDown(e);
}, false);
document.addEventListener("keyup", function (e) {
    return main.onKeyUp(e);
}, false);
var loop = function () {
    main.update();
    requestAnimationFrame(loop);
};
loop();
