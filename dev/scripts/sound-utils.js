export function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.sampleLookup = {};
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // alias this to loader
    var loader = this;

    //on request onload
    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
        request.response,
        function(buffer) {
            if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
            }
            loader.bufferList[index] = buffer;
            // iterate, if loadCount is equal to expected number of files
            if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
            console.error('decodeAudioData error', error);
        }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
}
  
BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}






export function BufferLoaderB(context, urlList, callback) {
    this.context = context;
    this.keyToUrl = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.sampleLookup = {};
    this.loadCount = 0;
}

BufferLoaderB.prototype.loadBuffer = function(key, url) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // alias this to loader
    var loader = this;

    //on request onload
    request.onload = function() {
        loader.context.decodeAudioData(
        request.response,
        function(buffer) {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }
            loader.sampleLookup[key] = buffer;
        },
        function(error) {
            console.error('decodeAudioData error', error);
        }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
}
  
BufferLoaderB.prototype.load = function() {
    for(let key in this.keyToUrl){
        this.loadBuffer(key,this.keyToUrl[key]);
    }   
}



export function playSoundFromSource(bufferSource,audioCtx,volume,pitch){
    let source = audioCtx.createBufferSource();
    let gainNode = audioCtx.createGain();

    source.playbackRate.value = pitch;
    gainNode.gain.value = parseFloat(volume);

    source.buffer = bufferSource;
    source.connect(gainNode);
    // source.connect(audioCtx.destination);
    gainNode.connect(audioCtx.destination);

    source.start();
}

