window.addEventListener("load", function() {
  console.log("Hello World!");
  
  init();
});

function init(){
  navigator.mozSetMessageHandler('alarm', AlarmActivityHandler);
  
  var time = document.getElementById("time");
  var timeSetButton = document.getElementById("timeSetButton");

  var today = new Date();
  time.defaultValue = toDoubleDigits(today.getHours()) + ":" + toDoubleDigits(today.getMinutes());
  
  timeSetButton.onclick = function(){
    console.log(time.value);
    setAlarm();
  };
    
    var stopMusicButton = document.getElementById("stopMusicButton");
    stopMusicButton.onclick = function(){
        stopMusic();
        componentChanger(true);
    }
    
    componentChanger(true);
}

function setAlarm(){
    var time = document.getElementById("time");
    var timeList = time.value.split(":");
    
    var hour = timeList[0];
    var minute = timeList[1];

    var today = new Date();
    var alarmTime = new Date(today.getFullYear(),today.getMonth(),today.getDate(),hour,minute,0);

    if(alarmTime < today){
      alarmTime.setDate(today.getDate() + 1);
    }

    var data = {foo: "bar"};
    var request = navigator.mozAlarms.add(alarmTime, "ignoreTimezone", data);

    request.onsuccess = function () {
      alert("アラームを設定しました！");
    };
    request.onerror = function () {
      alert("An error occurred: " + this.error.name);
    };
}

function AlarmActivityHandler(mozAlarm) {
    playMusic();
    window.addEventListener("devicemotion", handleMotionEvent, true);
    
    componentChanger(false);
    
    navigator.mozApps.getSelf().onsuccess = function _onAppReady(evt) {
        console.log("onAppReady called")
        var app = evt.target.result;
        if (app) {
            app.launch();
        }
    }
}

// 1桁の数字を0埋めで2桁にする
var toDoubleDigits = function(num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
 return num;     
};

var musicplayer;
musicplayer = new Audio('assets/alarmSound.mp3');
musicplayer.loop = true;

function playMusic(){
    try{
        musicplayer.play();

    }catch(e){
        alert(e);
    }
}

function stopMusic(){
    musicplayer.pause();
}

function handleMotionEvent(event){
    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;
    
    var isShake = detectShake(x,y,z);
    if(isShake){
        stopMusic();
        window.removeEventListener("devicemotion", handleMotionEvent, true);
        componentChanger(true);

    }
}

var SPEED_THRESHOLD = 40;
var SHAKE_TIMEOUT = 500;
var SHAKE_DURATION = 3000;
var SHAKE_COUNT = 10;
var mShakeCount = 0;
var mLastTime = 0;
var mLastAccel = 0;
var mLastShake = 0;
var mLastX, mLastY, mLastZ = 0;

function detectShake(x, y, z){
    var isShaked = false;
    var now = new Date();

    if(mLastTime == 0){
        mLastTime = now;
    }

    if(now - mLastAccel > SHAKE_TIMEOUT){
        mShakeCount = 0;
    }

    var diff = now - mLastTime;
    var speed = Math.abs(x + y + z - mLastX - mLastY - mLastZ) / diff * 10000;
    sensorArea.innerHTML = "speed:" + speed;

    if(speed > SPEED_THRESHOLD){
        if(++mShakeCount >= SHAKE_COUNT && now - mLastShake > SHAKE_DURATION){
            mLastShake = now;
            mShakeCount = 0;
            isShaked = true;
        }
        mLastAccel = now;
    }
    mLastTime = now;
    mLastX = x;
    mLastY = y;
    mLastZ = z;
    return isShaked;
}

function componentChanger(isAlarmSetting){
    var alarmSetSection = document.getElementById("alarmSet");
    var alarmStopSection = document.getElementById("alarmStop");
    
    if(isAlarmSetting){
        alarmSetSection.style.display = "block";
        alarmStopSection.style.display = "none";
    }else{
        alarmSetSection.style.display = "none";
        alarmStopSection.style.display = "block";
    }
}

