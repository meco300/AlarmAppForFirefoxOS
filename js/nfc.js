/**
 * Created with JetBrains WebStorm.
 * User: meco300
 * Date: 2014/06/28
 * Time: 17:45
 * To change this template use File | Settings | File Templates.
 */

window.onload = function onload() {
    console.log("onload event fired")
    navigator.mozSetMessageHandler('activity', NfcActivityHandler);
    navigator.mozSetMessageHandler('alarm', AlarmActivityHandler);
};
