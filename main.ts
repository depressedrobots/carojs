class SC_KeyboardStatus {
    public up: bool = false;
    public down: bool = false;
    public left: bool = false;
    public right: bool = false;
}

class SC_Main {

    private canvas;
    private ctx;

    private lastTime: number = Date.now();

    private player: SC_Player;

    private frameCount: number;
    private timeCounter: number;
    private lastFPS: number;

    private keyboardStatus: SC_KeyboardStatus;

    private currentColorValue: number;
    private colorChangeRate: number = 20;

    public init() {
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
    }

    public update() {
        var now: number = Date.now();
        var diff: number = now - this.lastTime;
        var delta: number = diff / 1000.0;

        this.updateColorValue(delta);
        //updatePlayer(delta);

        this.render();
	    this.frameCount++;

	    var timePassedSinceLastSecond: number = now - this.timeCounter;
	    if ( timePassedSinceLastSecond >= 1000) {
	        this.lastFPS = this.frameCount / (timePassedSinceLastSecond / 1000);
            this.timeCounter = now;
	        this.frameCount = 0;
        }       

        this.lastTime = now;
    }

    public render() {
        //clear first
        this.ctx.fillStyle = "rgb(" + this.currentColorValue.toFixed(0)  + ", 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // write fps
	    this.ctx.fillStyle = "rgb(255, 0, 0)";
	    this.ctx.font = "24px Helvetica";
	    this.ctx.textAlign = "left";
	    this.ctx.textBaseline = "top";
	    this.ctx.fillText("fps: " + this.lastFPS.toFixed(0) + " value: " + this.currentColorValue, 32, 32);        
    }
    
    public onKeyDown(e: KeyboardEvent) {
        switch (e.keyCode) {
            case 38:
                this.keyboardStatus.up = true;
                break;
            case 39:
                this.keyboardStatus.right = true;
                break;
            case 40:
                this.keyboardStatus.down = true;
                break;
            case 37:
                this.keyboardStatus.left = true;
                break;
        }

        console.log( e.keyCode );
    }

    public onKeyUp(e: KeyboardEvent) {
        switch (e.keyCode) {
            case 38:
                this.keyboardStatus.up = false;
                break;
            case 39:
                this.keyboardStatus.right = false;
                break;
            case 40:
                this.keyboardStatus.down = false;
                break;
            case 37:
                this.keyboardStatus.left = false;
                break;
        }
    }

    private updateColorValue(delta_: number) {
        if (this.keyboardStatus.up || this.keyboardStatus.right) { 
            this.currentColorValue += this.colorChangeRate * delta_;
	    }
	    if (this.keyboardStatus.down || this.keyboardStatus.left) { 
		    this.currentColorValue -= this.colorChangeRate * delta_;
	    }
	    this.currentColorValue = Math.max(0, this.currentColorValue);
	    this.currentColorValue = Math.min(255, this.currentColorValue);
    }
}

class SC_Actor {
    constructor (public x: number = 0, public y: number = 0) {
    };
}

class SC_Player extends SC_Actor {
    
}



/************************************
           start app loop
 ************************************/
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var main: SC_Main = new SC_Main();
main.init();
        document.addEventListener("keydown", e => main.onKeyDown(e), false);
        document.addEventListener("keyup", e => main.onKeyUp(e), false);

var loop = function () {    
    main.update();
    requestAnimationFrame(loop);
}

loop();