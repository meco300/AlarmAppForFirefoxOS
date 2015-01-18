// アプリ起動時に実行されるメソッドを登録
window.addEventListener("load", function() {
  console.log("Hello World!");
  
  init();
});

function init(){
  // アラームで呼ばれた時に実行するメソッドを登録
  navigator.mozSetMessageHandler('alarm', AlarmActivityHandler);

  // input timeの初期値
  var time = document.getElementById("time");
  var timeSetButton = document.getElementById("timeSetButton");

  var today = new Date();
  time.defaultValue = toDoubleDigits(today.getHours()) + ":" + toDoubleDigits(today.getMinutes());

  // アラーム設定ボタンが押された時に呼ばれる
  timeSetButton.onclick = function(){
    console.log(time.value);
    setAlarm();
  };

    // 音を止めるボタンが押された時に呼ばれる
    var stopMusicButton = document.getElementById("stopMusicButton");
    stopMusicButton.onclick = function(){
        stopMusic();
        componentChanger(true);
    }

    // アラーム設定ボタンを表示
    componentChanger(true);
}

// アラームの設定
function setAlarm(){
    // 設定時間を取得
    var time = document.getElementById("time");
    var timeList = time.value.split(":");
    
    var hour = timeList[0];
    var minute = timeList[1];

    var today = new Date();
    var alarmTime = new Date(today.getFullYear(),today.getMonth(),today.getDate(),hour,minute,0);

    if(alarmTime < today){
      alarmTime.setDate(today.getDate() + 1);
    }

    // mozAlarmに時間を登録
    var data = {foo: "bar"};
    var request = navigator.mozAlarms.add(alarmTime, "ignoreTimezone", data);

    request.onsuccess = function () {
      // 登録完了時
      alert("アラームを設定しました！");
    };
    request.onerror = function () {
      alert("An error occurred: " + this.error.name);
    };
}

// アラームが呼ばれた時に実行される
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

// 1桁の数字を0埋めで2桁にするメソッド
var toDoubleDigits = function(num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
 return num;     
};

// 音の設定
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

