var SC;
(function (SC) {
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
        SC_ResourceManager.prototype.allSuccessFull = function () {
            return this.downloadQueue.length == this.successCount;
        };
        return SC_ResourceManager;
    })();
    SC.SC_ResourceManager = SC_ResourceManager;    
})(SC || (SC = {}));

