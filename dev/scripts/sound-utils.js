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

