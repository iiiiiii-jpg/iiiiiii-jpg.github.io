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
code = unescape(params["id"].split('#')[0]);
//console.log(code);
//****use this for App (keep lectures in lectures folder)*/
//loadDoc();

//**** use this for web /////////////////////////////////////////////////*/
const inputElement = document.getElementById("files");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
  lectures = this.files;
  
  //console.log(lectures);
  full_list = '<a href="#" class="active">Select Lecture to Play</a>';
  for (i = 0; i < lectures.length; i++) {
    var objectURL = window.URL.createObjectURL(lectures[i]);

    track_list.push(new tracks(lectures[i].name, "", "", objectURL));

    full_list = full_list + '<a href="#" onclick="javascript:playSelected(' + i + ')">' + track_list[i].name + '</a>';

  };
  //console.log(track_list)

  // display tracks in a list
  document.getElementById("lec_menu").innerHTML = full_list;

  // Load the first track in the tracklist
  loadTrack(track_index);
  stream = curr_track.captureStream();

  initialize();
 
 
 // Tutor();
}
///**       ////////////////////////////////////////////////////////// */

let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
//let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

function tracks(name, artist, image, path) {
  this.name = name;
  this.artist = artist;
  this.image = image;
  this.path = path
}

let track_list = new Array();

function random_bg_color() {
  
  // Get a number between 64 to 256 (for getting lighter colors)
  //let red = Math.floor(Math.random() * 256) + 64;
  //let green = Math.floor(Math.random() * 256) + 64;
  //let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  //let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  //document.body.style.background ="rgb(204, 131, 35)";
                  //OR
  //document.body.style.background = bgColor;
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  //track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  //track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
}

function playSelected(my_index) {
  loadTrack(my_index);
  // for streaming only
    //stream = curr_track.captureStream();
  var play_time = localStorage.getItem(track_list[my_index].name.substring(0, 20));
  console.log(track_list[my_index].name.substring(0, 20));
  if (play_time!=null)
  curr_track.currentTime = play_time;//Math.floor(10);
  playTrack();
   
  track_index = my_index;
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}


function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  //message = new Paho.MQTT.Message("play");
  //message.destinationName = topic;
  //client.send(message);
  curr_track.play();
  stream = curr_track.captureStream();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';

  intervalId = setInterval(save_last_play_time, 10000);
}

function pauseTrack() {
  //message = new Paho.MQTT.Message("pause");
  //message.destinationName = topic;
  //client.send(message);
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';

  clearInterval(intervalId);
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length-1;
 // console.log(track_index)
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  seekto = curr_track.duration * (seek_slider.value / 100);
  //ss = "seek" + seekto
  //message = new Paho.MQTT.Message(ss);
  //message.destinationName = topic;
  //client.send(message);
  curr_track.currentTime = seekto;

}
function _30s_back() {
  curr_track.currentTime = curr_track.currentTime - Math.floor(30);
}
function _10s_back() {
  curr_track.currentTime = curr_track.currentTime - Math.floor(10);
}
function _10s_frw() {
  curr_track.currentTime = curr_track.currentTime + Math.floor(10);
}
function _30s_frw() {
  curr_track.currentTime = curr_track.currentTime + Math.floor(30);

}
function _1m_back() {
  curr_track.currentTime = curr_track.currentTime - Math.floor(60);
}
function _5m_back() {
  curr_track.currentTime = curr_track.currentTime - Math.floor(300);
}
function _1m_frw() {
  curr_track.currentTime = curr_track.currentTime + Math.floor(60);
}
function _5m_frw() {
  curr_track.currentTime = curr_track.currentTime + Math.floor(300);

}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

function save_last_play_time() {
  //console.log("Hello, world!");
  localStorage.setItem(track_list[track_index].name.substring(0, 20), curr_track.currentTime );
}



/*setTimeout(() => {
  clearInterval(intervalId);
}, 10000);*/

//************************************************************

function loadDoc() {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      // gets the entire html file of the folder 'logpost' in this case and labels it thing
      thing = this.responseText
      searchFor = /.mp3</g
      a = 0;
      b = 0;
      var str = "";
      //console.log(thing);
      // greps file for .html and then backs up leter by letter till you hot the file name and all
      while ((dothtmls = searchFor.exec(thing)) != null) {
        str = "";
        //console.log(dothtmls.index);                        
        a = dothtmls.index;
        while (thing[a] != '>') {
          a--;
        }
        a++;
        while (thing[a] != '<') {
          str = str + thing[a];
          a++;
        }
        lectures.push(str);
        //console.log(lectures.length);		
      }
      //console.log(lectures.length);

      // Define the tracks that have to be played
      lectures.sort();
      full_list = '<a href="#" class="active">Select Lecture to Play</a>';
      for (i = 0; i < lectures.length; i++) {

        track_list.push(new tracks(lectures[i], "", "", "./lectures/" + lectures[i]));

        full_list = full_list + '<a href="#" onclick="javascript:playSelected(' + i + ')">' + track_list[i].name + '</a>';

      };
      //console.log(track_list.length)

      // display tracks in a list
      document.getElementById("lec_menu").innerHTML = full_list;

      // Load the first track in the tracklist
      loadTrack(track_index);

    }
  };
  xhttp.open("GET", "./lectures", true);
  xhttp.send();
}

//**************************************************************
//************************************************************* */


   
/*var Util = {};
Util.base64 = function (mimeType, base64) {
    return 'data:' + mimeType + ';base64,' + base64;
};
var video = document.createElement('video');
video.setAttribute('loop', '');

function addSourceToVideo(element, type, dataURI) {
    var source = document.createElement('source');
    source.src = dataURI;
    source.type = 'video/' + type;
    element.appendChild(source);
}

addSourceToVideo(video, 'webm', Util.base64('video/webm', 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
addSourceToVideo(video, 'mp4', Util.base64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));
*/
var lastPeerId = null;
var peer = null; // own peer object

var callers = new Array();
var no_of_p = 0;
var for_screen = 1;

async function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(code, {
      debug: 2
    });

    peer.on('open', function (id) {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }

        console.log('ID: ' + peer.id);
        document.getElementById("abc").innerHTML = "Connected (Your ID: " + peer.id + ")";
       document.getElementById("link").innerHTML = "https://iiiiiii-jpg.github.io/music_device/hear.html?id="+code

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
    
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function (remoteStream) {
        //console.log('metadata: ' + call.metadata);
        //no_of_p = no_of_p + 1;
        //document.getElementById("parti").innerHTML = "Participants: " + no_of_p;
        // Show stream in some video/canvas element.
        //const audio2 = document.getElementById('audio2');
        //audio2.srcObject = remoteStream;
        callers.push(call);
    });
    call.on('close', function () {
        //no_of_p = no_of_p - 1;
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

curr_track.onplaying = lec_playing;
function lec_playing() {
    if (for_screen == 1) {
        //to keep screen awake
        //video.play();
        for_screen = for_screen - 1;
    } 
    for (i = 0; i < callers.length; i++) {
        if (callers[i].open) {
            //console.log("run");
            var sender = callers[i].peerConnection.getSenders();
            sender[0].replaceTrack(stream.getAudioTracks()[0]);
        }
    }
};

/*function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }*/

function Countcallers() {
        no_of_p = 0;
        for (i = 0; i < callers.length; i++) {
            if (callers[i].open) {
                no_of_p = no_of_p + 1;
            }
        }
        if (!peer.disconnected) { document.getElementById("abc").innerHTML = "Connected (Your ID: " + peer.id + ")"; }
        document.getElementById("parti").innerHTML = "Participants: " + no_of_p;
}


