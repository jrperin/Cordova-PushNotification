// Alert Debug 0-Off or 1-On
var debug = 0;

angular.module('starter.services', ['ngStorage'])
.factory('push', function($http){
	var username = '';
    return {
		register : function(user) {
			if (debug) alert('Register for [' + user + ']');
			username = user;
			if (window.plugins && window.plugins.pushNotification) {
				if (debug) alert('pushNotification plugin ok');
				var pushNotification = window.plugins.pushNotification;
				if ( device.platform == 'android' || device.platform == 'Android'){
					if (debug) alert('android');
					pushNotification.register(
						function(result) {
							if (debug) alert('success = ' + result);
						},
						function(result) {
							if (debug) alert('error = ' + result);
						},
						{
							"senderID":"705691889961",
							"ecb": "onNotificationGCM"
						});
				}
			}

		},
        registerPushd : function(deviceId) {
			if (debug) alert ('Registering [' + deviceId + '] for [' + username + ']');
			var req = {
				method: 'POST',
				url: serverPush(':7080/subscribers'),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: 'proto=gcm&token=' + deviceId,
			}
			if (debug) alert ('Calling');
            return $http(req).then(
				function(response){
					console.debug(response);
					if (debug) alert('Success!: ' + JSON.stringify(response));
					return response.data.id;
				},
				function(response){
					console.debug(response);
					if (debug) alert('Error: ' + JSON.stringify(response));
					return false;
				});
        },
		subscribe : function(subscriberId) {
			if (debug) alert ('Subscribing to [' + subscriberId + ':' + username + ']');
			var req = {
				method: 'POST',
				url: serverPush(':7080/subscriber/' + subscriberId + '/subscriptions/' + username),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: '',
			}
			if (debug) alert ('Calling 2');
            return $http(req).then(
				function(response){
					console.debug(response);
					if (debug) alert('Success!: ' + JSON.stringify(response));
					return true;
				},
				function(response){
					console.debug(response);
					if (debug) alert('Error: ' + JSON.stringify(response));
					return false;
				});
		}
    }
    
})
;

function onNotificationGCM(e) {
	if (debug) alert("notification! " + JSON.stringify(e));
	switch( e.event )
	{
	case 'registered':
		if ( e.regid.length > 0 )
		{
			//$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			console.log("regID = " + e.regid);
			if (debug) alert("regID = " + e.regid);
			var ngapp = angular.element(document.querySelector('[ng-app]'));
			var injector = ngapp.injector();
			var push = injector.get('push');
			push.registerPushd(e.regid).then(
				function(response) {
					if (debug) alert('ok [' + JSON.stringify(response) + ']');
					push.subscribe(response);
				},
				function(response) {
					if (debug) alert('nok [' + JSON.stringify(response) + ']');
				});
		}
	break;

	case 'message':
		// if this flag is set, this notification happened while we were in the foreground.
		// you might want to play a sound to get the user's attention, throw up a dialog, etc.
		if ( e.foreground )
		{
			//$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

			// on Android soundname is outside the payload.
			// On Amazon FireOS all custom attributes are contained within payload
			//var soundfile = e.soundname || e.payload.sound;
			// if the notification contains a soundname, play it.
			//var my_media = new Media("/android_asset/www/"+ soundfile);
			//my_media.play();
			if (debug) alert("foreground");
		}
		else
		{  // otherwise we were launched because the user touched a notification in the notification tray.
			if ( e.coldstart )
			{
				//$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
				if (debug) alert("coldstart");
			}
			else
			{
				//$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
				if (debug) alert("background");
			}
		}

		//$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
		//Only works for GCM
		//$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
		//Only works on Amazon Fire OS
		//$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
		alert(e.payload.message);
	break;

	case 'error':
		//$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
		if (debug) alert("err [" + e.msg + "]");
	break;

	default:
		//$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
		if (debug) alert("unknown");
	break;
  }
}
