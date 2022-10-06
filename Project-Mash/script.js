var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");
var btn4 = document.getElementById("btn4");


// added backend service to fetch mp3 pathes from AWS S3

const params = {
    method: 'GET',
    //mode: 'no-cors',
    headers: {
        'Content-Type': 'application/json'
    },
};
var illusionPath
const fetchPromise = fetch("http://localhost:8080/trackPath?trackId=1", params)
    .then(res => res.json())
    .then(data => illusionPath = data)

// had to use Promise because fetch is async
// Promise forces the fetch result to be available before the script exe goes further
// this way illusionPath is actually assigned with the path
// var mash2
// Promise.resolve(fetchPromise)
//     .then(() => mash2 = new Audio(illusionPath))

var mash1 = new Audio("https://tracks1.s3.us-west-1.amazonaws.com/zfirst_mash_njoi_tiga.mp3");
var orig_njoi =new Audio("music/Century Masters (feat. Luvain) - N-Joi - [musicsmix.com].mp3");
var mash2 = new Audio("https://tracks1.s3.us-west-1.amazonaws.com/illusion_sample.mp3");
var mash3 = new Audio("https://tracks1.s3.us-west-1.amazonaws.com/so+I+want+you+intro+125.mp3");



// for target current played music in playlist Musics
var currentMusicPlayed = 0;
var currentChange = 0;
var change_btn1 = 0;
var change_btn2 = 0;
var change_btn3 = 0;
var change_btn4 = 0;


btn1.onclick = function()
{
    change_btn1 = document.getElementById("btn1");
    if(mash1.paused == true){
      if(currentMusicPlayed != 0){
        currentMusicPlayed.pause();
        currentChange.innerHTML = "&#9658;";
      }
    mash1.play();
    currentMusicPlayed = mash1;
    currentChange = change_btn1;
    change_btn1.innerHTML = "&#9724;";
      }else{
        mash1.pause();
     change_btn1.innerHTML = "&#9658;";
      }
}

btn2.onclick = function()
{
    change_btn2 = document.getElementById("btn2");
    if(orig_njoi.paused == true){
      if(currentMusicPlayed != 0){
        currentMusicPlayed.pause();
        currentChange.innerHTML = "&#9658;";
      }
    orig_njoi.play();
    currentMusicPlayed = orig_njoi;
    currentChange = change_btn2;
    change_btn2.innerHTML = "&#9724;";
      }
      else{
     orig_njoi.pause();
     change_btn2.innerHTML = "&#9658;";
    }
}

btn3.onclick = function()
{
    change_btn3 = document.getElementById("btn3");
    if(mash2.paused == true){
      if(currentMusicPlayed != 0){
        currentMusicPlayed.pause();
        currentChange.innerHTML = "&#9658;";
      }
    mash2.play();
    currentMusicPlayed = mash2;
    currentChange = change_btn3;
    change_btn3.innerHTML = "&#9724;";
      }
      else{
     mash2.pause();
     change_btn3.innerHTML = "&#9658;";
    }
}

btn4.onclick = function()
{
    change_btn4 = document.getElementById("btn4");
    if(mash3.paused == true){
      if(currentMusicPlayed != 0){
        currentMusicPlayed.pause();
        currentChange.innerHTML = "&#9658;";
      }
    mash3.play();
    currentMusicPlayed = mash3;
    currentChange = change_btn4;
    change_btn4.innerHTML = "&#9724;";
      }
      else{
     mash3.pause();
     change_btn4.innerHTML = "&#9658;";
    }
}
