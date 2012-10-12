 module SC {
    export class SC_ResourceManager {
        private downloadQueue = [];
        private cache = {};
        private successCount = 0;
        private errorCount = 0;

        public push(path_: String) {
            this.downloadQueue.push(path_);
        };

        public startDownload(finishedCallback_ : Function) {
            if (this.downloadQueue.length === 0) {
                finishedCallback_();
            }

            for (var i = 0; i < this.downloadQueue.length; i++) {
                var path = this.downloadQueue[i];
                var img = new Image();
                var that = this;
                img.addEventListener("load", function () {
                    that.successCount++;
                    if (that.isDownloadComplete()) {
                        finishedCallback_();
                    }
                }, false);
                img.addEventListener("error", function () {
                    that.errorCount++;
                    if (that.isDownloadComplete()) {
                        finishedCallback_();
                    }
                }, false);
                img.src = path;
                this.cache[path] = img;
            }
        };

        private isDownloadComplete(): bool {
            return this.downloadQueue.length == this.successCount + this.errorCount;
        };

        public getResource(path_) {
            return this.cache[path_];
        };

        public allSuccessFull(): bool {
            return this.downloadQueue.length == this.successCount;
        }
    }
}