var intervalId = null;
var stream = null;
var lectures = new Array();
var code = ''
function getParams(){
  var idx = document.URL.indexOf('?');
  var params = new Array();
  if (idx != -1) {
      var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
      for (var i=0; i<pairs.length; i++){
          nameVal = pairs[i].split('=');
          params[nameVal[0]] = nameVal[1];
      }
  }
  return params;
}
params = getParams();
//code = unescape(params["id"].split('#')[0]);
code = "dailyprogram123"
console.log(code);

var lastPeerId = null;
var peer = null; // own peer object

var callers = new Array();
var no_of_p = 0;
var for_screen = 1;


async function captureSystemAudioOnly() {

    try {

        stream =
            await navigator.mediaDevices
            .getDisplayMedia({
                video: true,
                audio: true
            });

        console.log(
            "Video tracks:",
            stream.getVideoTracks().length
        );

        console.log(
            "Audio tracks:",
            stream.getAudioTracks().length
        );

        stream.getTracks().forEach(track => {

            track.addEventListener(
                'ended',
                () => {

                    console.log(
                        "Sharing stopped"
                    );

                    stream = null;
                }
            );

        });

    } catch (err) {

        console.error(
            "Failed to capture screen/audio:",
            err
        );

        stream = null;
    }
}


(async () => {
    await captureSystemAudioOnly();
    initialize();
})();
console.log(
    "SENDER VIDEO:",
    stream.getVideoTracks()
);

console.log(
    "SENDER AUDIO:",
    stream.getAudioTracks()
);

async function initialize() {
    //console.log("initialize start");

    peer = new Peer(code, { debug: 2 });

    //console.log("peer =", peer);

    peer.on('open', function (id) {
	//console.log("open event", id, peer);
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }

        console.log('ID: ' + peer.id);
        document.getElementById("abc").innerHTML = "Connected (Your ID: " + peer.id + ")";
       document.getElementById("link").innerHTML = "http://iiiiiii-jpg.github.io/stream_laptop/receiver_laptop.html?id="+code

        //Countcallers();
      var count_parti = setInterval(Countcallers, 3000);
    });
    peer.on('connection', function (c) {
        // Disallow incoming connections
        c.on('open', function () {
            c.send("Sender does not accept incoming connections");
            setTimeout(function () { c.close(); }, 500);
        });
    });
    peer.on('disconnected', function () {
        document.getElementById("abc").innerHTML = "<p style='color:blue'>" + "Connection lost. Reconnecting...";
        //console.log('Connection lost. Please reconnect');
        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;
        peer.reconnect();
    });
    peer.on('close', function () {
        call = null;
        document.getElementById("abc").innerHTML = "<p style='color:red'>" + "Connection destroyed. Please refresh";
        //console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        document.getElementById("abc").innerHTML = "<p style='color:red'>" + err;
        // alert('' + err);
    });

//var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

peer.on('call', function (call) {
	  console.log('stream =', stream);

    if (!stream) {
        console.error('No audio stream available');
        return;
    }
    
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function (remoteStream) {
        //console.log('metadata: ' + call.metadata);
        //no_of_p = no_of_p + 1;
        //document.getElementById("parti").innerHTML = "Participants: " + no_of_p;
        // Show stream in some video/canvas element.
        //const audio2 = document.getElementById('audio2');
        //audio2.srcObject = remoteStream;
        const exists = callers.some(function(c){ return c.peer === call.peer; }); 
	if (!exists) { callers.push(call); }
    });
    call.on('close', function () {
        //no_of_p = no_of_p - 1;
		callers = callers.filter(function(c){ return c.peer !== call.peer; });
        document.getElementById("parti").innerHTML = "Disconnectd with user " + call.peer;
    });

    call.on('error', function (err) {
        //no_of_p = no_of_p - 1;
        //document.getElementById("abc").innerHTML = "<p style='color:red'>"+ err;
    });
}, function (err) {
    console.log('Failed to get local stream', err);

});

};


/*function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }*/

function Countcallers() {

    // remove dead calls
    callers = callers.filter(function(call){

        return (
            call &&
            call.peerConnection &&
            call.peerConnection.connectionState !==
                "closed"
        );

    });

    no_of_p = callers.length;

    if (
        peer &&
        !peer.disconnected
    ) {

        document.getElementById("abc").innerHTML =
            "Connected (Your ID: " +
            peer.id +
            ")";
    }

    document.getElementById("parti").innerHTML =
        "Participants: " + no_of_p;
}




