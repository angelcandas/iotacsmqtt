var mosca = require('mosca')
const http = require('http')
const bcrypt = require('bcrypt-nodejs');
var settings = {
  port: process.env.PORT || 1883,
};
/*
let broker = new mosca.Server({settings});
let server = http.createServer();
broker.attachHttpServer(server);
server.listen();*/
//here we start mosca

httpServ = http.createServer()
var server = new mosca.Server(settings);
server.attachHttpServer(httpServ);
httpServ.listen(process.env.MQTT_WS_PORT || 5200);
console.log("Web socket: "+process.env.MQTT_WS_PORT)
console.log("Mosca socket: "+process.env.MQTT_PORT)

var authenticate = function(client, username, password, callback) {
  //console.log("TOKEN: "+client.key)
  //console.log("USER: "+username);
    password=password.toString();
    callback(null,true);
    // statements

  //console.log("PASS: "+password);
  /*
  db.select('email','hash','key').from('login')
  .where('email','=',username)
  .then(data =>{
    //console.log(data[0])
    const isValid= bcrypt.compareSync(password,data[0].hash)
    const keyok= (data[0].key==password) 
    if (isValid || keyok){ 
      client.user = username;
      console.log(client.id+": authorized!")
      callback(null, isValid||keyok);
    }else{
      callback(null,false);
    }
    })
  .catch(err => {
    console.log(client.id+": Wrong credentials")})

}*/
}
// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizePublish = function(client, topic, payload, callback) {
  payload=JSON.parse(payload);
  message=payload.message;
  token=payload.token;
  ertopic=topic.split('/');
  callback(null,true);
/*
  db.select('token').from('tokens').where('email','=',client.user)
    .then(data=>{
        var test=0;
        data.forEach(dato =>{
          if(token===dato.token){
            callback(null,token===dato.token);
            test++;
          }
        })
        if(test==0){
          console.log(client.id+": Invalid token, message rejected");
          callback(null,0);
          return 0;
        }
  })*/
  
}

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizeSubscribe = function(client, topic, callback) {
  callback(null, true);
}



server.on('ready', ()=>{
  server.authenticate = authenticate;
  server.authorizePublish = authorizePublish;
  server.authorizeSubscribe = authorizeSubscribe;
  console.log('Mosca server is up and running')

});

// fired when the mqtt server is ready
 
// fired whena  client is connected
server.on('connected', function(client) {
  console.log('client connected', client.id);
});
 
// fired when a message is received
server.on('published', function(packet,client) {
    if(client!=null){
    try{payload=JSON.parse(packet.payload);
      let sentido='action';
      message=payload.message;
      token=payload.token;
      sentido=payload.direction;
      console.log("message: "+payload)
    }
      catch(e){
        console.log(e)
      }
    }
  });
 
// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  console.log('subscribed : ', topic);
});
 
// fired when a client subscribes to a topic
server.on('unsubscribed', function(topic, client) {
  //console.log('unsubscribed : ', topic);
});
 
// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
  //console.log('clientDisconnecting : ', client.id);
});
 
// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
  //console.log('clientDisconnected : ', client.id);
});




