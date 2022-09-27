var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");
// var btn4 = document.getElementById("btn4");
// var btn5 = document.getElementById("btn5");
// var btn6 = document.getElementById("btn6");

//var mash1=new Audio("music/zfirst_mash_njoi_tiga.mp3");

var mash1=new Audio("https://tracks1.s3.us-west-1.amazonaws.com/zfirst_mash_njoi_tiga.mp3");
var orig_njoi=new Audio("music/Century Masters (feat. Luvain) - N-Joi - [musicsmix.com].mp3");
var mash2=new Audio("https://tracks1.s3.us-west-1.amazonaws.com/illusion_sample.mp3");
// var Age19=new Audio("music/Age-19-Jass-Manak.mp3");
// var letMeDown = new Audio("music/Let-Me-Down-Slowly(PaglaSongs).mp3");
// var Animal= new Audio("music/Maroon 5 Animals.mp3 Song Download.mp3");
// var fedUp=new Audio("music/Bazanji Fed Up .mp3")

// array who has all musics as playlist
var Musics = [] ;
// for target current played music in playlist Musics
var currentMusicPlayed = 0;
var currentChange = 0;
var change_btn1 = 0;
var change_btn2 = 0;
var change_btn3 = 0;


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
// btn3.onclick = function()
// {
//     var change = document.getElementById("btn3");
//     if(letMeDown.paused){
//         letMeDown.play();
//         change.innerHTML = "&#9724;";
//       }else
//       {
//         letMeDown.pause();
//         change.innerHTML = "&#9658;";
//       }
//
// }
// btn4.onclick = function()
// {
//     var change = document.getElementById("btn4");
//     if(fedUp.paused){
//         fedUp.play();
//         change.innerHTML = "&#9724;";
//       }else
//       {
//         fedUp.pause();
//         change.innerHTML = "&#9658;";
//       }
//
// }
// btn5.onclick = function()
// {
//     var change = document.getElementById("btn5");
//     if(Age19.paused){
//         Age19.play();
//         change.innerHTML = "&#9724;";
//       }else
//       {
//         Age19.pause();
//         change.innerHTML = "&#9658;";
//       }
//
// }
// btn6.onclick = function()
// {
//     var change = document.getElementById("btn6");
//     if(Animal.paused){
//         Animal.play();
//         change.innerHTML = "&#9724;";
//       }else
//       {
//         Animal.pause();
//         change.innerHTML = "&#9658;";
//       }
//
// }
