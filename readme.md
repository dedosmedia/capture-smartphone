#Capture smartphone

Use smartphones as game controllers, get all events in another browser. Make your game in that web page. 


###Getting started

* Install and run the server
```sh
npm install
node app.js
```

* Open the web page in a desktop browser, click "Display"
* Open the web page in smartphones, click "Sensor"

### Make your own game

The purpose of this library is to solve the distribution of events from smartphones to the 
main game browser. Implementing the game (or other) is up to you. 

Subscribing to the events from the connected smartphones will be very easy*: 

```javascript
devices.addEventListener('touchstart', function(e){
  console.log('Touch event for device: ', e.id);
});
```

*Not actually working yet

The exact details of this API are in discussion and can change. 

### Tech talk

#### Which events are supported?

Currently, these events are supported: 

* deviceorientation
* devicemotion
* geolocation
* touchstart
* touchmove
* touchend

#### How does it work? 

The project consists of three parts: Smartphone, server and game.

##### Smartphone

DOM events are collected in a web page and sent to the server through a websocket. 

##### Server 

The server is simply proxying events from the connected smartphones to the game page. 

##### Game

The game can be run in any browser, for instance one connected to a TV or projector. 


License: MIT. 
http://tap5.mit-license.org/