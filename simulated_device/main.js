var TRANSITIONS = require("transitions");

import Pins from "pins";
var currentScreen;
let myPins;
let opacityHex = {
	0: "#E6E1D1", 10: "#E6DFC7", 20: "#E7DCBA", 30: "#E7D8AA", 40: "#E8D496", 50: "#E9D083",
	60: "#EACC6F", 70: "#EDC85B", 80: "#EBC347", 90: "#ECBF34", 100: "#EDBB20",
}
let logoUrl = "assets/logo.png";
let readyUrl = "assets/ready.png";
let errorUrl = "assets/error.png";
let abzFont = new Style({ font: "24px ABeeZee", color: "white" });
let logo = new Picture({ height: 67, top: 0, bottom: 30, url: "assets/logo.png" });
let connectionError = new Picture({ height: 21, top:100, bottom: 0, url: "assets/error.png" });
let pinsReady = new Picture({ height: 21, top: 100, bottom: 0, url: "assets/ready.png" });
let icons = new Texture("assets/action_icons.png");
let iconSkin = new Skin({
	height: 80, width: 80,
	texture: icons,
	variants: 80
});
let IconContainer = Container.template($ => ({
	top: 0, bottom: 50, height: 80, width: 80,
	skin: iconSkin,
	variant: $.variant,
}));
let StringContainer = Container.template($ => ({
	top: 50, bottom: 0,
	contents: [Label($, {style: abzFont, string: $.string})]
}));

let MainContainer = Container.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0,
    skin: new Skin({ fill: $.backgroundColor }),
    contents: $.content
}));
/************************************/
/***********   HANDLERS   ***********/
/***********************************/
Handler.bind("/changeOpacity", Behavior({
    onInvoke: function(handler, message){
    	var query = parseQuery(message.query);
    	var opacity = query.param;
    	trace("OPACITY IN HANDLER: " + opacity + "\n");
    	switchToScreen("lamp", opacity);
    }
}));
Handler.bind("/onFed", Behavior({
	onInvoke: function(handler, message){
    	switchToScreen("feed");
	}
}));
Handler.bind("/onWeighed", Behavior({
	onInvoke: function(handler, message){
		var query = parseQuery(message.query);
    	var weight = query.param;
    	switchToScreen("weigh", weight);
	}
}));
Handler.bind("/onBack", Behavior({
	onInvoke: function(handler, message){
    	switchToScreen("home");
	}
}));

//var lastOpacity;
function switchToScreen(screen, value){
	var toScreen;	
	if (screen == "lamp"){	
//		if (lastOpacity != value){
//			lastOpacity = value;
			trace("opacity: " + value + "\n");	
			while(!toScreen){
				trace("setting toScreen\n");
				toScreen = new MainContainer({ 
                		content: [new IconContainer({ variant: 0 }),
                				  new StringContainer({ string: "toasty" })], 
                		backgroundColor: opacityHex[value]  });
            }
            trace("toScreen set and executing run\n\n");	
        	application.run( new TRANSITIONS.CrossFade(), currentScreen, toScreen, { duration: 100 } );
      //  }
    } 
    else {
    	if (screen == "weigh") {
    		toScreen = new MainContainer({ 
                			content: [new IconContainer({ variant: 1 }),
                					  new StringContainer({ string: value })], 
                			backgroundColor: "#5DD454"  });
    	} else if (screen == "feed") {
    		toScreen = new MainContainer({ 
                			content: [new IconContainer({ variant: 2 }),
                					  new StringContainer({ string: "yum!" })], 
                			backgroundColor: "#20B46C"  });
   	 	} else if (screen == "home") {
    		toScreen = new MainContainer({             							
            				content: [
            					new Picture({ height: 67, top: 0, bottom: 30, url: logoUrl }), 
            					new Picture({ height: 21, top: 100, bottom: 0, url: readyUrl })], 
            				backgroundColor: "#E8F9E0" })
    	}
    	application.run( new TRANSITIONS.CrossFade(), currentScreen, toScreen, { duration: 600 } );
    }
    
    currentScreen = toScreen;
}


var currentScreen = new MainContainer({             							
            				content: [
            					new Picture({ height: 67, top: 0, bottom: 30, url: logoUrl }), 
            					new Picture({ height: 21, top: 100, bottom: 0, url: readyUrl })
            				], 
            				backgroundColor: "#E8F9E0" });
            				
class AppBehavior extends Behavior {
    onQuit(application) {
        application.shared = false;
    }
    onLaunch(application) {
    	application.shared = true;
    	
        Pins.configure({
            /*** lamp turns on when turtle is on the platform and off otherwise ***/            
            lamp_platform: {			// digital input to toggle lamp
            	require: "Digital",
            	pins: {
            		ground: { pin: 55, type: "Ground" },
            		digital: { pin: 56, direction: "input" }
            	}
            },
            
            /*** adjusting lamp brightness from companion app ***/
            lamp: {		// analog output 
            	require: "pwmBLL",
            	pins: {
            		pwm: { pin: 28 }
            	}
            },
                        
            /*** reading in weight when turtle is on scale ***/
            scale: {				// analog input to display weight from scale
            	require: "Analog",
            	pins: {
            		ground: { pin: 53, type: "Ground" },
            		analog: { pin: 54 }
            	}
            },
            
            /*** rotating feeder servo to dispense food from companion app ***/  
            feed_servo: {
            	require: "pwmBLL",
            	pins: {
                	pwm: { pin: 30 },
            	}
            },   
        },  success => {
            if (success) {            	
            	Pins.share("ws", {zeroconf: true, name: "pins-share"});
				application.add(currentScreen);
            } else {
            	currentScreen = new MainContainer({ 
            						content: [
            							new Picture($, { height: 67, top: 0, bottom: 30, url: logoUrl }), 
            							new Picture($, { height: 21, top: 100, bottom: 0, url: errorUrl })], 
            						backgroundColor: "#E8F9E0" })
            	application.add(currentScreen);
            }
        });
    }
}
application.behavior = new AppBehavior();