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
        this.player = new SC_Player();
        this.loadResources();
    };
    SC_Main.prototype.loadResources = function () {
        var _this = this;
        this.resourcesManager = new SC_ResourceManager();
        this.resourcesManager.push("assets/dummy.png");
        this.resourcesManager.push("assets/brick.png");
        this.resourcesManager.startDownload(function (f) {
            return _this.onResourcesLoaded;
        });
    };
    SC_Main.prototype.onResourcesLoaded = function () {
        if(true == this.resourcesManager.allSuccessfull()) {
            this.player.img = this.resourcesManager.getResource("assets/dummy.png");
        }
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
        this.player.render(this.ctx);
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
                this.keyboardStatus.right = true;
                break;

            }
            case 40: {
                this.keyboardStatus.down = true;
                break;

            }
            case 37: {
                this.keyboardStatus.left = true;
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
                this.keyboardStatus.right = false;
                break;

            }
            case 40: {
                this.keyboardStatus.down = false;
                break;

            }
            case 37: {
                this.keyboardStatus.left = false;
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
    SC_Actor.prototype.render = function (ctx_) {
        ctx_.drawImage(this.img, this.x, this.y);
    };
    return SC_Actor;
})();
var SC_Player = (function (_super) {
    __extends(SC_Player, _super);
    function SC_Player() {
        _super.apply(this, arguments);

    }
    return SC_Player;
})(SC_Actor);
var SC_ResourceManager = (function () {
    function SC_ResourceManager() {
        this.downloadQueue = [];
        this.cache = {
        };
        this.successCount = 0;
        this.errorCount = 0;
    }
    SC_ResourceManager.prototype.push = function (path_) {
        this.downloadQueue.push(path_);
    };
    SC_ResourceManager.prototype.startDownload = function (finishedCallback_) {
        if(this.downloadQueue.length === 0) {
            finishedCallback_();
        }
        for(var i = 0; i < this.downloadQueue.length; i++) {
            var path = this.downloadQueue[i];
            var img = new Image();
            var that = this;
            img.addEventListener("load", function () {
                that.successCount++;
                if(that.isDownloadComplete()) {
                    finishedCallback_();
                }
            }, false);
            img.addEventListener("error", function () {
                that.errorCount++;
                if(that.isDownloadComplete()) {
                    finishedCallback_();
                }
            }, false);
            img.src = path;
            this.cache[path] = img;
        }
    };
    SC_ResourceManager.prototype.isDownloadComplete = function () {
        return this.downloadQueue.length == this.successCount + this.errorCount;
    };
    SC_ResourceManager.prototype.getResource = function (path_) {
        return this.cache[path_];
    };
    SC_ResourceManager.prototype.allSuccessfull = function () {
        return this.downloadQueue.length == this.successCount;
    };
    return SC_ResourceManager;
})();
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
