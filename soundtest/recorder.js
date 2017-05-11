(function(window){

  var WORKER_PATH = 'recorderWorker.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    if(!this.context.createScriptProcessor){
       this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
       this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }
   
    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
      partialCallback,
      fullCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffers = function(cb, partial) {
      console.log("function recorder.getBuffers", cb, partial);
      if (partial == "partial") {
        console.log("setpartial")
        partialCallback = cb;
      }
      if (partial == "full"){
        console.log("setfull")
        fullCallback = cb;
      }
      // currCallback = cb || config.callback;
      worker.postMessage({
        command: 'getBuffers', 
        partial: partial 
      });
    }

    this.exportWAV = function(cb, partial, type ){
      console.log("function recorder.exportWAV", partial);
      if (partial == "partial")
        partialCallback = cb;
      if (partial == "full")
        fullCallback = cb;
      // currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      // if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        partial: partial,
        type: type
      });
    }

    this.exportMonoWAV = function(cb, partial, type){
      if (partial == "partial")
        partialCallback = cb;
      if (partial == "full")
        fullCallback = cb;
      type = type || config.type || 'audio/wav';
      // if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportMonoWAV',
        partial: partial,
        type: type
      });
    }

    worker.onmessage = function(e){
      console.log("function recorder onmessage", e);
      var data = e.data;
      var cb;
      if (e.data.partial == "partial")
        cb = partialCallback;
      if (e.data.partial == "full")
        cb = fullCallback;
      console.log("CB", cb);
      cb(data);
    }

    source.connect(this.node);
    this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
  };

  Recorder.setupDownload = function(blob, filename, partial){
    console.log("function recorder.setupdownload", blob);
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.getElementById("save");
    if (partial == "partial")
      link = document.getElementById("partialsave");

    link.href = url;
    link.download = filename || 'output.wav';

    if (partial == "partial") {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://karaokey-server.herokuapp.com/file', true);
      xhr.setRequestHeader('Content-type','audio/wav');
      xhr.send(blob);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var response = JSON.parse(xhr.response);
          console.log(partial, "GOOGLE RESPONSE: ")
          console.log(response);
          if (response != null && response.results != undefined && response.results[0] != undefined) {
            var str = "";
            for(var i = 0; i < response.results.length; i++) {
              str +=  "<p>[" + response.results[i].alternatives[0].confidence + "] ";
              str += response.results[i].alternatives[0].transcript + "</p>";
            }
            document.getElementById('textbox').innerHTML += str;
          }
        }
      }
    }
  }
  window.Recorder = Recorder;

})(window);
//https://karaokey-server.herokuapp.com/submitaudio