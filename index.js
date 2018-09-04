var mosca = require('mosca')
const http = require('http')
const bcrypt = require('bcrypt-nodejs');
const fetch = require ('node-fetch');
/*
let broker = new mosca.Server({settings});
let server = http.createServer();
broker.attachHttpServer(server);
server.listen();*/
//here we start mosca

httpServ = http.createServer();
var server = new mosca.Server({});
server.attachHttpServer(httpServ);
httpServ.listen(process.env.PORT || 5200);
console.log("Web socket: "+process.env.PORT);
console.log("Mosca socket: "+process.env.PORT);
const URL_SERV = "http://127.0.0.1:3000";
var authenticate = function(client, username, password, callback) {
  console.log("TOKEN: "+password)
  console.log("USER: "+username);
  password=password.toString();
  fetch(URL_SERV+'/auth',{
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        email: username,
        password: password,
        })
    })
    .then(response => response.json())
    .then(m =>{
      console.log(m.auth)
      if (m.auth) {
        console.log("Authenticated")
        callback(null,true);
      }
      else{
        console.log("Not authenticated")
        callback(null,false);
      }
    })
    .catch(err =>{
      console.log(err)
    })

  
}
// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizePublish = function(client, topic, payload, callback) {
  payload=JSON.parse(payload);
  message=payload.message;
  token=payload.token;
  ertopic=topic.split('/');
  fetch(URL_SERV+'/apub',{
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        email: ertopic[1],
        token: token,
        })
    })
    .then(response => response.json())
    .then(m =>{
      console.log(m.auth)
      if (m.auth) {
        console.log("Authorized")
        callback(null,true);
      }
      else{
        console.log("Not authorized")
        callback(null,false);
      }
    })
    .catch(err =>{
      console.log(err)
    })
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
 // por favor no te lo cargues
// fired when a message is received
server.on('published', function(packet,client) {

    if(client!=null){
    try{payload=JSON.parse(packet.payload);
      console.log("message: "+payload)
      fetch(URL_SERV+'/publish',{
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        message: payload.message,
        token: payload.token,
        sentido: payload.sentido,
        })
    })
    .then(response => response.json())
    .then(m =>{
      if (m.auth) {
        console.log("Inserted")
      }
      else{
        console.log("Not inserted")
      }
    })
    .catch(err =>{
      console.log(err)
      })
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




