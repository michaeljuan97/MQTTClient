var mqtt=require('mqtt');
var mysql = require('mysql');

//DB Setup
var db_config = {
    host: "127.0.0.1",
    user: "root",
    password: "highlight",
    database: "test",
  };
var con;
function handleDisconnect(){
    con = mysql.createConnection(db_config);

    con.connect(function(err) {
        if (err){
            console.log("Error connecting to db: ", err);
            setTimeout(handleDisconnect, 2000);
        };
        console.log("DB Connected!");
    });

    con.on('error', function(err){
        console.log("db error", err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else {
            throw err;
        }
    });
};
handleDisconnect();

//MQTT Setup
var client = mqtt.connect("mqtt://127.0.0.1",{clientId:"mqttjs01"}) //connect to broker
var topic="Advantech/FF5A3DAA/data"; //1 topic
var topic_list=["topic2","topic3","topic4"]; //multiple topics
var topic_o={"topic22":0,"topic33":1,"topic44":1}; //multi topics multi qos

client.subscribe(topic,{qos:1}); //single topic
// client.subscribe(topic_list,{qos:1}); //topic list


//handle incoming messages
client.on('message',function(topic, message, packet){
    var jsonObj = JSON.parse(message)
    console.log(jsonObj)
    console.log(jsonObj.TempHumi.SenVal)
    console.log(jsonObj.Accelerometer["X-Axis"].RMSmg)
    console.log(jsonObj.Device.PowerSrc)
    var datetime = new Date().toISOString() //UTC time
    var datetime_proxy = new Date(new Date(datetime).setHours(new Date(datetime).getHours()+7)).toISOString()
        .replace(/T/, ' ') //replace T with space
        .replace(/\..+/, '') //delete . and the rest of it
    console.log(datetime_proxy)
    //Parameter sensor
    var PowerSrc = jsonObj.Device.PowerSrc
    var BatteryVol = jsonObj.Device.BatteryVolt
    var TempRange = jsonObj.TempHumi.Range
    var TempStatus = jsonObj.TempHumi.Status
    var TempEvent = jsonObj.TempHumi.Event
    var TempVal = jsonObj.TempHumi.SenVal
    var LogIndex = jsonObj.Accelerometer.LogIndex

    var XAxisSenEvent = jsonObj.Accelerometer["X-Axis"].SenEvent
    var XAxisVRMS = jsonObj.Accelerometer["X-Axis"].OAVelocity
    var XAxisPeakAccel = jsonObj.Accelerometer["X-Axis"].Peakmg
    var XAxisARMS = jsonObj.Accelerometer["X-Axis"].RMSmg
    var XAxisKurtosis = jsonObj.Accelerometer["X-Axis"].Kurtosis
    var XAxisCrestFactor = jsonObj.Accelerometer["X-Axis"].CrestFactor
    var XAxisSkewness = jsonObj.Accelerometer["X-Axis"].Skewness
    var XAxisDeviation = jsonObj.Accelerometer["X-Axis"].Deviation
    var XAxisDisplacement = jsonObj.Accelerometer["X-Axis"]["Peak-to-Peak_Displacement"]

    var YAxisSenEvent = jsonObj.Accelerometer["Y-Axis"].SenEvent
    var YAxisVRMS = jsonObj.Accelerometer["Y-Axis"].OAVelocity
    var YAxisPeakAccel = jsonObj.Accelerometer["Y-Axis"].Peakmg
    var YAxisARMS = jsonObj.Accelerometer["Y-Axis"].RMSmg
    var YAxisKurtosis = jsonObj.Accelerometer["Y-Axis"].Kurtosis
    var YAxisCrestFactor = jsonObj.Accelerometer["Y-Axis"].CrestFactor
    var YAxisSkewness = jsonObj.Accelerometer["Y-Axis"].Skewness
    var YAxisDeviation = jsonObj.Accelerometer["Y-Axis"].Deviation
    var YAxisDisplacement = jsonObj.Accelerometer["Y-Axis"]["Peak-to-Peak_Displacement"]

    var ZAxisSenEvent = jsonObj.Accelerometer["Z-Axis"].SenEvent
    var ZAxisVRMS = jsonObj.Accelerometer["Z-Axis"].OAVelocity
    var ZAxisPeakAccel = jsonObj.Accelerometer["Z-Axis"].Peakmg
    var ZAxisARMS = jsonObj.Accelerometer["Z-Axis"].RMSmg
    var ZAxisKurtosis = jsonObj.Accelerometer["Z-Axis"].Kurtosis
    var ZAxisCrestFactor = jsonObj.Accelerometer["Z-Axis"].CrestFactor
    var ZAxisSkewness = jsonObj.Accelerometer["Z-Axis"].Skewness
    var ZAxisDeviation = jsonObj.Accelerometer["Z-Axis"].Deviation
    var ZAxisDisplacement = jsonObj.Accelerometer["Z-Axis"]["Peak-to-Peak_Displacement"]


    var sql = "INSERT INTO vibrationsensor1 \
    VALUES ('"+PowerSrc+"','"+BatteryVol+"','"+TempRange+"','"+TempStatus+"','"+TempEvent+"','"+TempVal+"','"+LogIndex+"', \
    '"+XAxisSenEvent+"','"+XAxisVRMS+"','"+XAxisPeakAccel+"','"+XAxisARMS+"','"+XAxisKurtosis+"','"+XAxisCrestFactor+"','"+XAxisSkewness+"','"+XAxisDeviation+"','"+XAxisDisplacement+"', \
    '"+YAxisSenEvent+"','"+YAxisVRMS+"','"+YAxisPeakAccel+"','"+YAxisARMS+"','"+YAxisKurtosis+"','"+YAxisCrestFactor+"','"+YAxisSkewness+"','"+YAxisDeviation+"','"+YAxisDisplacement+"', \
    '"+ZAxisSenEvent+"','"+ZAxisVRMS+"','"+ZAxisPeakAccel+"','"+ZAxisARMS+"','"+ZAxisKurtosis+"','"+ZAxisCrestFactor+"','"+ZAxisSkewness+"','"+ZAxisDeviation+"','"+ZAxisDisplacement+"', '"+datetime_proxy+"')"

    con.query(sql, function(err, res){
        if (err) throw err;

    })
});


client.on("connect",function(){
    console.log("connected");
})