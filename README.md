# Cordova-PushNotification
A Phonegap-Cordova working example using PushPlugin in AngularJS

It's use [Pushd](https://github.com/rs/pushd) (Very easy to install! Follow the instructions), but can be changed to use PubNub, Pushwoosh, Parse.com, etc. It's using GCM (Google Cloud Message, for Android) but it's easy do include iOS, BlackBerry, Windows Phone, etc.

## How to use:

Create your [Pushd](https://github.com/rs/pushd) server (follow the instructions in the link)

Add the PushPlugin to your Cordova Application:
> cordova plugin add https://github.com/phonegap-build/PushPlugin.git

In your controller, call the function push.register:
```javascript
var username = userLgn.signinUsername;
push.register(username);
```

Create a function to return the Pushd Server URL:
```javascript
SERVER_PUSH = "http://198.199.123.156";
var server=function(url){
    return SERVER_URL + url;
};
```

## Explanation:

1. The function push.register call the pushNotification.register (PushPlugin) in async mode to register on GCM. The callback is set to onNotificationGCM, that receive all GCM notifications
2. The onNotificationGCM is called receivind the token from GCM, and start the push.registerPushd to register this token in Pushd server. Because this is outside the AngularJS scope, we do a little hack (thanks to [Michael Mendelson](http://intown.biz/2014/04/11/android-notifications/)) locating ng-app and calling it
3. When the promise returns the Pushd id of this device, we call the push.subscribe(response) to subscribe the username to this service.

After this, just send a Push in the server (must be local, because the default config of Pushd) and voila!

```
root@Server ~/pushd # curl -d title=Hi%20there -d msg=This%20is%20a%20Push! http://localhost:7080/event/myusername
```

![Push Received](/img/screenshot01.png?raw=true "Push Received")

Feel free to complement, comment, hack, fork and let's go!
