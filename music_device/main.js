

var interact=false;
var lectures = new Array();
loadDoc();

let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

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

function tracks(name, artist, image, path){
  this.name = name;
  this.artist = artist;
  this.image = image;
  this.path = path
}

let track_list = new Array();

function random_bg_color() {

  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  document.body.style.background = bgColor;
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  //track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
}

function playSelected(my_index) {
  interact=true;
  loadTrack(my_index); 
  track_index=my_index;
  pauseTrack();
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
  curr_track.autoplay=true;
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  pauseTrack();
  //playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length-1;
  //console.log(track_index);
  loadTrack(track_index);
  pauseTrack();
  //playTrack();
}

function seekTo() {
  seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
  
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

//************************************************************

function loadDoc() {
		
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    // gets the entire html file of the folder 'logpost' in this case and labels it thing
                    thing = this.responseText
                    searchFor = /.mp3</g
                    a=0;
                    b=0;
		    var str="";		                    
                    //console.log(thing);
                    // greps file for .html and then backs up leter by letter till you hot the file name and all
                    while ((dothtmls = searchFor.exec(thing)) != null ){
                        str = "";
                        //console.log(dothtmls.index);                        
                        a = dothtmls.index;
                        while (thing[a]  != '>' ){
                            a--;
                        }
                        a++;
                        while(thing[a] != '<'){
                            str = str + thing[a];
                            a++;
                        }
			lectures.push(str);
                       	//console.log(lectures.length);		
                    } 
		//console.log(lectures.length);

		// Define the tracks that have to be played
    lectures.sort();
    full_list='<a href="#" class="active">Select Lecture to Play</a>';
		for (i = 0; i < lectures.length; i++) {

    track_list.push(new tracks(lectures[i],"","","./lectures/"+lectures[i]));

     full_list= full_list + '<a href="#" onclick="javascript:playSelected('+i+')">'+track_list[i].name+'</a>';

		};
    //console.log(track_list.length)
    
    // display tracks in a list
    document.getElementById("lec_menu").innerHTML = full_list; 

                }           
            };
            xhttp.open("GET", "./lectures", true);
            xhttp.send();            
            }

//**************************************************************

