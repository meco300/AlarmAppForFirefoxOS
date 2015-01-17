var musicplayer;
musicplayer = new Audio('assets/alarmSound.mp3');
musicplayer.loop = true;

window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    console.log("DOMContentLoaded");
    var translate = navigator.mozL10n.get;

    navigator.mozL10n.once(start);

    function start() {
        try{

        var setAlarmButton = document.getElementById('timeSetButton');
        setAlarmButton.onclick = function(){
            setAlarm();
        };

        var stopMusicButton = document.getElementById('stopMusicButton');
        stopMusicButton.onclick = function(){
            stopMusic();
        };
        }catch(e){
            alert(e);
        }
    }

    function setAlarm(){
        try{

        var hour = document.getElementById('hour');
        var hourValue = hour.selectedOptions[0].value;

        var minute = document.getElementById('minute');
        var minuteValue = minute.selectedOptions[0].value;

        var today = new Date();
        var alarmDate = today.getDate();
        var alarmMonth = today.getMonth();
        var alarmYear = today.getFullYear();
        var alarmTime = new Date(alarmYear,alarmMonth,alarmDate,hourValue,minuteValue,0);

        if(alarmTime < today){
            alarmTime.setDate(today.getDate() + 1);
        }
        
        //alert(alarmTime.toString());
        alert("アラームを設定しました！");
        
        today.setSeconds(today.getSeconds() + 10);
        
        var data = {
            foo: "bar"
        }
        // for debug: mozAlarm will call 10second after
        //var request = navigator.mozAlarms.add(today, "ignoreTimezone", data);
        // set alerm
        var request = navigator.mozAlarms.add(alarmTime, "ignoreTimezone", data);
        
        request.onsuccess = function () {
        };
        request.onerror = function () {
            alert("An error occurred: " + this.error.name);
        };
        }catch (e){
            alert(e);
        }

    }
});

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

function NfcActivityHandler(activity) {
    try{
        console.log("NfcActivityHandler called");
        stopMusic();
        
        var activityName = activity.source.name;
        var data = activity.source.data;
        
        console.log("activityName:" + activityName);
        switch (activityName) {
            case 'nfc-ndef-discovered':
                console.log("WebActivity: nfc-ndef-discovered");
                console.log('nfc ndef message records(s): ' + JSON.stringify(data.records));
                console.log('Session Token: ' + JSON.stringify(data.sessionToken));
                console.log('Technology Detected: ' + JSON.stringify(data.tech));
                break;
        }
    }catch(e){
        alert(e);
    }
}

function AlarmActivityHandler(mozAlarm) {
    console.log("AlarmActivityHandler called");
    playMusic();
    
    navigator.mozApps.getSelf().onsuccess = function _onAppReady(evt) {
        console.log("onAppReady called")
        var app = evt.target.result;
        if (app) {
            app.launch();
        }
    }
}
