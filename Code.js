import { Accelerometer } from "accelerometer";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import document from "document";
import { Gyroscope } from "gyroscope";
import { OrientationSensor } from "orientation";
import * as fs from "fs";
import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { listDirSync } from "fs";
import { readFileSync } from "fs";
import { outbox } from "file-transfer";
import { vibration } from "haptics";
import { user } from "user-profile";
import { me as device } from "device";
import { me } from "appbit";
import { Barometer } from "barometer";
import {clock} from 'clock';
import { geolocation } from "geolocation";



me.appTimeoutEnabled = false;

var userID = 0;
var watchID = 0;
var firmwareVersion = 0;

let elements = document.getElementById("GPSRect");

let GPSBuffer = new Float32Array(400).fill(0);

var incrementer = 0;

function getPosition()
{
  watchID = geolocation.watchPosition(locationSuccess, locationError);
  
}


function locationSuccess(position) {
  console.log(Date.now());
  GPSBuffer[incrementer] = position.timestamp;
  console.log(GPSBuffer[incrementer]);
  GPSBuffer[incrementer+100] = position.coords.latitude;
  GPSBuffer[incrementer+200 ] = position.coords.longitude;
  GPSBuffer[incrementer+300 ] = position.coords.accuracy;
  console.log("TimeStamp: " + position.timestamp, "Latitude: " + position.coords.latitude,
                "Longitude: " + position.coords.longitude, "Accuracy: " + position.coords.accuracy,);
  elements.style.fill = "#00a629";
  console.log(userbuffer[17]);
  console.log(GPSBuffer[incrementer]);
  incrementer += 1;
  if (incrementer == 100)
    {
      incrementer = 0; 
      let fd = fs.openSync('GPSData.bin', 'a+');
      fs.writeSync(fd, GPSBuffer);
      fs.closeSync(fd);
      GPSBuffer = new Float32Array(400).fill(0); 
    }


}

function locationError(error)
{
  elements.style.fill = "#f83c40";
}



messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
}

messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

function sendMessage(label) {
  // Sample data
  var data = {
    Instruction: label,
  }
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send(data);
  }
}



var markerPosition = 0;

var userData = [];
let userbuffer = new Float32Array(20).fill(0);
let markerbuffer = new Float32Array(20).fill(0);



const centreXACCdata = document.getElementById("centreXACCdata");
const centreYACCdata = document.getElementById("centreYACCdata");
const centreZACCdata = document.getElementById("centreZACCdata");
const centreXGYROdata = document.getElementById("centreXGYROdata");
const centreYGYROdata = document.getElementById("centreYGYROdata");
const centreZGYROdata = document.getElementById("centreZGYROdata");
const personID = document.getElementById("personID");

let timeoutScreen = document.getElementById("timeoutScreen");
let startScreen = document.getElementById("startScreen");
let uploadScreen = document.getElementById("uploadScreen");
let confirmationScreen = document.getElementById("confirmationScreen");
let failureScreen = document.getElementById("failureScreen");
let transferScreen = document.getElementById("transferScreen");
let markerAddedScreen = document.getElementById("markerAddedScreen");
let saveScreen = document.getElementById("saveScreen");
let optionsScreen = document.getElementById("optionsScreen");
let uploadFilesScreen = document.getElementById("uploadFilesScreen");
let selectUserScreen = document.getElementById("selectUserScreen");
let deleteScreen = document.getElementById("deleteScreen");
let deleteConfirmationScreen = document.getElementById("deleteConfirmationScreen");
let noFilesScreen = document.getElementById("noFilesScreen");
let dataErrorScreen = document.getElementById("dataErrorScreen");
let selectHandScreen = document.getElementById("selectHandScreen");

let rectangle = document.getElementById("rectangle");

let continueButtonConfirmation = document.getElementById("continueButtonConfirmation");
let continueButtonFailure = document.getElementById("continueButtonFailure");
let uploadButton = document.getElementById("uploadButton");
let cancelButton = document.getElementById("cancelButton");
let btn_off = document.getElementById("btn-off");
let btn_on = document.getElementById("btn-on");
let saveButton = document.getElementById("saveButton");
let uploadFilesButton = document.getElementById("uploadFilesButton");
let recordButton = document.getElementById("recordButton");
let upButton = document.getElementById("upButton");
let downButton = document.getElementById("downButton");
let continueOnButton = document.getElementById("continueOnButton");
let backButton = document.getElementById("backButton");
let deleteButton = document.getElementById("deleteButton");
let confirmButton = document.getElementById("confirmButton");
let cancelDeleteButton = document.getElementById("cancelDeleteButton");
let btn_left = document.getElementById("btn-left");
let btn_right = document.getElementById("btn-right");
let confirmHandButton = document.getElementById("confirmHandButton");

let buffer = new ArrayBuffer(8)
let fileID = 0;

let fd = fs.openSync('null.bin', 'a+');
fs.writeSync(fd, buffer);
fs.closeSync(fd);

let cancelPresses = 0;
let errorInData = 0;
let handSelection = 0;

var timeoutFunction = 0;
var alreadyOn = 0;
var sensors = [];
var GPSArray = [];
var markerArray = [];

var GPSInterval = 0;

const accel = 0;
const bps = 0;
const gyro = 0;
const baro = 0;
let fd = 0;

let filename = 'fillerName.bin';



var recFunction = 0;

let currentTime = new Date();
//let filename = `DataFile-${currentTime.toISOString()}.txt`;
//console.log(filename);


document.onkeypress = function(e)
{
  if (e.key == 'up' && alreadyOn == 1)
    {
    markerbuffer[markerPosition] = accel.readings.timestamp[0];
    showMarkerScreen();
    timeoutFunction = setTimeout(showStartScreen, 1000);
    markerPosition++;
    }
  if (e.key == 'down' && optionsScreen.style.display == 'none' && uploadScreen.style.display == "none")
    {
    showOptionsScreen();
    }
  
}




// Intialize the Append Function which appends new Data
btn_on.onclick = function(evt)
{
  vibration.start("bump");
  
  if (alreadyOn == 1)
    {
    console.log("Already ON");
    }
  else
    {
    clearPreviousFilesExceptMain();
   filename = 'FITBITWATCH_' + (userID).toString()+ '_' + (currentTime.getFullYear()).toString()+ '_' + ((currentTime.getMonth()+1)).toString() + '_' +             (currentTime.getDate()).toString() + '_' + (currentTime.getHours()).toString()+ '_' + (currentTime.getMinutes()).toString()+ '.bin';
   console.log(filename);
    alreadyOn = 1;
    console.log("Activated");
      
    gyro = new Gyroscope({ frequency: 100, batch:100 });
    accel = new Accelerometer({ frequency: 100, batch:100});
    //sendMessage('Start'); used to trigger GPS on companion, not needed anymore
        
    elements.style.fill = "#f83c40"; // indicate gps is not found yet
      
    getPosition();  
    accel.start();
    gyro.start(); 
    userbuffer[17] = Date.now();
    console.log(userbuffer[17]);
    

    sensors.push(accel);
    sensors.push(gyro);
      
    accel.addEventListener("reading", readAccelData);
    gyro.addEventListener("reading", readGYRO);  
    
    }
    
}


btn_off.onclick = function(evt)
{
  vibration.start("bump");
  alreadyOn = 0;
  sensors.map(sensor => sensor.stop());
  geolocation.clearWatch(watchID); 
  let stats = fs.statSync(filename);
  console.log("File size: " + stats.size + " bytes");
  let stats = fs.statSync('gyroData.bin');
  console.log("File size: " + stats.size + " bytes");
  mergeFiles();
  if (errorInData == 1)
    {
    showDataErrorScreen();
    timeoutFunction = setTimeout(showUploadScreen, 3000);
    }
  else
  {
  showUploadScreen();
  }
}

function readAccelData()
{
  centreXACCdata.text = accel.readings.x[99].toFixed(2);
  centreYACCdata.text = accel.readings.y[99].toFixed(2);
  centreZACCdata.text = accel.readings.z[99].toFixed(2);
  let fd = fs.openSync(filename, 'a+');
  fs.writeSync(fd, accel.readings.timestamp);
  fs.writeSync(fd, accel.readings.x);
  fs.writeSync(fd, accel.readings.y);
  fs.writeSync(fd, accel.readings.z);
  fs.closeSync(fd);
}
function readGYRO()
{
  centreXGYROdata.text = gyro.readings.x[99].toFixed(2);
  centreYGYROdata.text = gyro.readings.y[99].toFixed(2);
  centreZGYROdata.text = gyro.readings.z[99].toFixed(2);
  let fd = fs.openSync('gyroData.bin', 'a+');
  fs.writeSync(fd, gyro.readings.timestamp);
  fs.writeSync(fd, gyro.readings.x);
  fs.writeSync(fd, gyro.readings.y);
  fs.writeSync(fd, gyro.readings.z);
  fs.closeSync(fd);
}

function stopSensors()
{
  if (display.on)
    {
      
    }
  else
    {
      sensors.map(sensor => sensor.stop());
    }
}


messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log('Recieved: ' + evt.data);
  if (evt.data == 1)
    { 
      clearTimeout(timeoutFunction);
      showConfirmationScreen(); 
      clearTimeout(fileTimeoutFunction);
    }
  else
    {
     clearTimeout(timeoutFunction);
     clearTimeout(fileTimeoutFunction);

     showFailureScreen();
    }
}

var fileTimeoutFunction = 0;

function transferFile()
{
    console.log('Transferring');
    let stats = fs.statSync(filename);
    console.log("File size: " + stats.size + " bytes");
    //QUEU uP FOR TRANSFER
    outbox.enqueueFile(filename).then((ft) => 
    {
      console.log(`Transfer of ${ft.name} successfully queued.`);
    })
    .catch((error) => 
    {
      console.log(`Failed to schedule transfer: ${error}`);
    })  
  fileTimeoutFunction = setTimeout(uploadFilesTimeout, 60000); ////// THIS IS CRUCIAL. IT SENDS A NULL.bin FILE TO AWAKE THE STALLED TRANSFER.
  // NULL.bin IS REJECTED BY THE COMPANION. A BUG TURNS THE FILE TRANSFER OFF AND NEVER WILL TRANSFER LARGER FILES WITHOUT THIS.
}

function mergeFiles()
{
  let enteringBuffer = 0;
  errorInData = 0;
  let stats = fs.statSync('gyroData.bin');
  var sizeOfLoop = stats.size/1600;
  console.log(sizeOfLoop);
  var startPosition = 0;
  let newbuffer = new Float32Array(400).fill(0);
  
  
  let gyrofile = fs.openSync('gyroData.bin', "r");
  let fd = fs.openSync(filename, 'a+');
  

  
  fs.writeSync(fd, newbuffer);
 
  for (let index = 0; index < sizeOfLoop; index++) 
  {
    fs.readSync(gyrofile, newbuffer,0,1600,startPosition);
    fs.writeSync(fd, newbuffer);
    startPosition += 1600;
    enteringBuffer += 1;
    if (enteringBuffer > 10)
        {
        if (((newbuffer[1] - newbuffer[0]) > 11) || ((newbuffer[1] - newbuffer[0]) < 9))
          { 
          errorInData = 1;
          }
        }
  }
  
  fs.closeSync(gyrofile); 
  let newbuffer = new Float32Array(400).fill(0);
  fs.writeSync(fd, newbuffer);
  
  try
    {
    let stats = fs.statSync('GPSData.bin');
    var sizeOfLoop = stats.size/1600;
    let GPSfile = fs.openSync('GPSData.bin', "r"); 
    var startPosition = 0; 
    for (let index = 0; index < sizeOfLoop; index++) 
    {
      fs.readSync(GPSfile, newbuffer,0,1600,startPosition);
      fs.writeSync(fd, newbuffer);
      startPosition += 1600;
    }
    fs.closeSync(GPSfile);
      
    }
  catch(error)
  {
    console.log(error);
  }

  let newbuffer = new Float32Array(100).fill(0);
  fs.writeSync(fd, newbuffer);
  fs.writeSync(fd, userbuffer);
  fs.writeSync(fd, newbuffer);
  fs.writeSync(fd, markerbuffer);
  
  fs.closeSync(fd);

  let stats = fs.statSync(filename);
  console.log("File Size of FileName:" + stats.size);
  
  try
  {
  fs.unlinkSync('gyroData.bin'); 
  fs.unlinkSync('GPSData.bin');
  }
  catch(error)
  {
    console.log(error);
  }

}

function clearPreviousFiles()
{
  try
  {
  fs.unlinkSync(filename); 
  fs.unlinkSync('gyroData.bin'); 
  fs.unlinkSync('GPSData.bin');
  }

catch(error)
  {
    console.log(error);
  }
}

function clearPreviousFilesExceptMain()
{
  try
  {
  fs.unlinkSync('gyroData.bin'); 
  fs.unlinkSync('GPSData.bin');
  }

catch(error)
  {
    console.log(error);
  }
}


function uploadAllFiles()
{
    var dirIter = 0;
    const listDir = fs.listDirSync("/private/data");
    var keys = Object.keys(listDir);
    const entered = 0;
    
    while((dirIter = listDir.next()) && !dirIter.done) 
    {
    console.log('Transferring:'+ dirIter.value);
    entered = 1;
    outbox.enqueueFile(dirIter.value).then((ft) => 
    {
      console.log(`Transfer of ${ft.name} successfully queued.`);
    })
    .catch((error) => 
    {
      console.log(`Failed to schedule transfer: ${error}`);
    })  
      
    }
    if (entered == 0)
    {
      showNoFilesScreen();
      timeoutFunction = setTimeout(showOptionsScreen, 2000);
    }
  

}

function uploadFilesTimeout()
{
    outbox.enqueueFile('null.bin').then((ft) => 
    {
      console.log(`Transfer of ${ft.name} successfully queued.`);
    })
    .catch((error) => 
    {
      console.log(`Failed to schedule transfer: ${error}`);
    })  
  
  fileTimeoutFunction = setTimeout(uploadFilesTimeout, 60000);

}

function deleteAllFiles()
{
    var dirIter = 0;
    const listDir = fs.listDirSync("/private/data");
    while((dirIter = listDir.next()) && !dirIter.done) 
    {
    console.log('Deleting:'+ dirIter.value);
    fs.unlinkSync(dirIter.value);  
    }

}

function collectSystemSettings()
{
  
  userbuffer[0]=userID;
  userbuffer[1]=user.age;
  if (user.gender == 'male')
    {
      userbuffer[2] = 1;
    }
  else
    {
      userbuffer[2] = 0;
    }
  userbuffer[3]=user.height;
  userbuffer[4]=user.weight;
  if (device.modelName == 'Ionic')
    {
      userbuffer[5] = 1;
    }
  else
    {
      userbuffer[5] = 0;
    }
  userbuffer[6] = device.modelId;
  var firmwareVersion = device.firmwareVersion.split('.');
  userbuffer[7] = firmwareVersion[0];
  userbuffer[8] = firmwareVersion[1];
  userbuffer[9] = firmwareVersion[2];
  userbuffer[10] = firmwareVersion[3];
  userbuffer[11] = currentTime.getFullYear()
  userbuffer[12] = (currentTime.getMonth()+1)
  userbuffer[13] = currentTime.getDate()
  userbuffer[14] =  currentTime.getHours()
  userbuffer[15] =  currentTime.getMinutes()
  userbuffer[16] = handSelection;
  
  console.log(typeof filename);
  console.log(userbuffer);
}


continueButtonConfirmation.onclick = function(evt)
{
  vibration.start("bump");
  showStartScreen(); 
}
continueButtonFailure.onclick = function(evt)
{
  vibration.start("bump");
  showStartScreen(); 
}

cancelButton.onclick = function(evt)
{
  if (cancelPresses == 1)
    {
    vibration.start("bump");
    showStartScreen(); 
    cancelPresses = 0;
    clearPreviousFiles();
    }
  else
    {
    vibration.start("bump");
    cancelPresses++;
    }
}

uploadButton.onclick = function(evt)
{
  vibration.start("bump");
  showTransferScreen(); 
  transferFile();
}

saveButton.onclick = function(evt)
{
  vibration.start("bump");
  showSaveScreen();
  timeoutFunction = setTimeout(showStartScreen, 2000);
}

recordButton.onclick = function(evt)
{
  vibration.start("bump");
  let fd = fs.openSync('null.bin', 'a+');
  fs.writeSync(fd, buffer);
  fs.closeSync(fd);
  showSelectHandScreen();
  
}

uploadFilesButton.onclick = function(evt)
{
  vibration.start("bump");
  showUploadFilesScreen();
  uploadAllFiles();
}

continueOnButton.onclick = function(evt)
{
  vibration.start("bump");
  showStartScreen();
  collectSystemSettings();
}

confirmHandButton.onclick = function(evt)
{
  vibration.start("bump");
  showSelectUserScreen();
}

backButton.onclick = function(evt)
{
  vibration.start("bump");
  showOptionsScreen();
}

upButton.onclick = function(evt)
{
  vibration.start("bump");
  userID += 1;
  personID.text = userID;
}

downButton.onclick = function(evt)
{
  vibration.start("bump");
  userID -= 1;
  if (userID < 0)
  {
    userID = 0;
  }
  personID.text = userID;
}

confirmButton.onclick = function(evt)
{
  vibration.start("bump");
  showDeleteScreen();
  deleteAllFiles();
  timeoutFunction = setTimeout(showOptionsScreen, 2000);
}

deleteButton.onclick = function(evt)
{
  vibration.start("bump");
  showDeleteConfirmationScreen();
}

cancelDeleteButton.onclick = function(evt)
{
  vibration.start("bump");
  showOptionsScreen();
}

btn_left.onclick = function(evt)
{
  vibration.start("bump");
  handSelection = 0;
}

btn_right.onclick = function(evt)
{
  vibration.start("bump");
  handSelection = 1;
}
