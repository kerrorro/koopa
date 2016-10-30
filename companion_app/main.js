import {
	VerticalSlider, VerticalSliderBehavior,
} from 'sliders';
import Pins from "pins";
let remotePins;
var TRANSITIONS = require("transitions");
var deviceURL = "";
var feedbackContainer;				// End point container for push transition
var platformState = false;			
var servoPulseWidth = 0;


/************************************/
/**** DEVICE DETECTION HANDLERS ****/
/***********************************/
Handler.bind("/discover", Behavior({
    onInvoke: function(handler, message){
    	//trace("Device connected\n");
        deviceURL = JSON.parse(message.requestText).url;
    }
}));

Handler.bind("/forget", Behavior({
    onInvoke: function(handler, message){
        deviceURL = "";
    }
}));

/*******************************/
/*******    BEHAVIORS  *********/
/*******************************/
class AppBehavior extends Behavior {
	onDisplayed(application) {
        application.discover("p3-device");
    }
    onQuit(application) {
        application.forget("p3-device");
    }
    onLaunch(application) {
        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "pins-share") {
                    trace("Connecting to remote pins\n");
                    remotePins = Pins.connect(connectionDesc);
                    application.distribute("onListening");
                }
            }, 
            connectionDesc => {
                if (connectionDesc.name == "pins-share") {
                    trace("Disconnected from remote pins\n");
                    remotePins = undefined;
                }
            }
        );
    }
    onToggleLight(application, value) {
    	var statusStr;
    	value == 1 ? statusStr = "on" : statusStr = "off";
    	trace("Toggling light " + statusStr + "\n");
        if (remotePins) {
        	remotePins.invoke("/lamp/write", value);
        }
    }
    onWeigh(application, button){
    	if (remotePins) {
    		trace("Getting weight from scale\n");
			remotePins.invoke("/scale/read", function(result){
				if (result){
					var displayString = result.toFixed(2) + " lbs";
				} else {
					var displayString = "nothing on scale";
				}
				feedbackContainer.add(new Label({ style: abzFont, string: displayString}));
				if (deviceURL != "") new Message(deviceURL + "onWeighed?" + serializeQuery({param: displayString})).invoke(Message.JSON);
			})
		} else {
			var displayString = "no scale connection";
			feedbackContainer.add(new Label({ style: abzFont, string: displayString}));
		}
		
    }
    onFeed(application, button){
   		if (remotePins) {
   			var displayString = "your pet was fed";
   			trace("Rotating servo to dispense food\n");
   			servoPulseWidth == 0? servoPulseWidth = 10 : servoPulseWidth = 0;
   			var period = 10; 
   			remotePins.invoke("/feed_servo/writeDutyCyclePeriod", {dutyCycle: servoPulseWidth, period: period});
   		} else {
   			var displayString = "no motor connection";	
   		}
		feedbackContainer.add(new Label({ style: abzFont, string: displayString}));
		if (deviceURL != "") new Message(deviceURL + "onFed").invoke(Message.JSON);		
    }
    onListening(application){
    	// Read lamp platform input every 200 ms and toggle light button on if turtle is on platform
    	var previousSensorState = 0;
    	var platformStateChanged = false;
    	remotePins.repeat("/lamp_platform/read", 700, 
							sensorState => { 
    							//var lampButtonState = mainScreen.first.first.state;
    							if (sensorState != previousSensorState) {
    								previousSensorState = sensorState;
    								platformStateChanged = true;
    							}
    							if (platformStateChanged) {
    								platformStateChanged = false;
    								platformState = sensorState;
    								application.distribute("onPlatformChanged");
    								application.distribute("onToggleLight", sensorState);
    								platformState == 1 ? application.distribute("generateSlider") : application.distribute("removeSlider");
    							}
    						});
    }
    generateSlider(application){
    	var lampSlider = new Slider({ min: 0, max: 100, value: 100 });
    	mainScreen.first.add(lampSlider);
    }
    removeSlider(application){
    	mainScreen.first.remove(mainScreen.first.last);
    }
}

let buttonBehavior = Behavior({
	onPlatformChanged: function(button){
		if (button.name == "lamp"){
		trace(platformState + '\n');
			if (platformState == 1){
				button.state = 1;
				button.variant = 1;
			} else {
				button.state = 0;
				button.variant = 0;
			}
		}
	},
	onTouchBegan: function(button){
		if (button.name == "lamp"){		// If lamp button isn't already on, then allow user to hold turn lamp on temporarily
			if (button.state == 0){
				trace("changing button state\n");
				button.state = 1;
				button.variant = 1;
				application.distribute("onToggleLight", 1);
			}
		}
		else {
			if (button.variant !== 2) button.variant == 1;		// Turns scale and feed buttons to pressed variant onTouchBegan
		}
	},
	onTouchEnded: function(button){
		if (button.name == "lamp") {
			if (button.state == 1 && platformState == 0) {
				button.state = 0; 
				button.variant = 0;
				application.distribute("onToggleLight", 0);
			}
		} else {
			var currentVariant = button.variant;
			var toVariant;
			if (currentVariant !== 2) {
				currentVariant == 0? button.variant = 1 : button.variant = 0;
				toVariant = button.variant;
			}
			if (toVariant) {
				button.visible = 0;  
				let fillHex;
				let buttonSkin;
				if (button.name == "weigh"){
					fillHex = "#5DD454"
					buttonSkin = weighSkin;
				} else if (button.name == "feed"){
					fillHex = "#20B46C"
					buttonSkin = feedSkin;
				}
				feedbackContainer = new NestedTier({ name: button.name, boxSkin: new Skin({ fill: fillHex }), buttonSkin: buttonSkin, variant: 2});
		  		button.container.run( new TRANSITIONS.Push(), button.container.last, feedbackContainer, 
	                     				{ direction: "right", duration: 200 } );
				if (button.name == "weigh"){
					application.distribute("onWeigh", button);
				} else if (button.name == "feed"){
					application.distribute("onFeed", button);
				}
			}
		}
	},
});

let pushBackBehavior = Behavior({
	onTouchBegan(button){
		button.variant = 1;
	},
	onTouchEnded(button){
		button.variant = 0;
		let fillHex;
		let buttonSkin;
		if (button.name == "weigh"){
			fillHex = "#CFF1BF"
			buttonSkin = weighSkin;
		} else if (button.name == "feed"){
			fillHex = "#B8F99A"
			buttonSkin = feedSkin;
		}
		feedbackContainer = new NestedTier({ name: button.name, boxSkin: new Skin({ fill: fillHex }), buttonSkin: buttonSkin});
	  	button.container.run( new TRANSITIONS.Push(), button.container.last, feedbackContainer, 
                     			{ direction: "left", duration: 200 } );
        if (deviceURL != "") new Message(deviceURL + "onBack").invoke(Message.JSON);	
	}			
})


/*******************************/
/*******    TEXTURES  *********/
/*******************************/
let lampTexture = new Texture("assets/lamp_buttons.png");
let weighTexture = new Texture("assets/weigh_buttons.png");
let feedTexture = new Texture("assets/feed_buttons.png");
let backTexture = new Texture("assets/back.png");

var titleFont = new Style({ font: "36px ABeeZee", color: "white" })
var abzFont = new Style({ font: "24px ABeeZee", color: "white" })


/*******************************/
/*********    SKINS  ***********/
/*******************************/
let headerSkin = new Skin({fill: "#5BAC55"})

/******** button skins *******/
// Grid of skin states (on/off) and variants (up/down)
let lampSkin = new Skin({
	height: 110, width: 110, // dimensions of grid cell
	texture: lampTexture,
	states: 110, variants: 110 // state and variant offsets
})
let weighSkin = new Skin({
	height: 110, width: 110, 
	texture: weighTexture,
	variants: 110 			// weigh button has no on/off (state)
})
let feedSkin = new Skin({
	height: 110, width: 110, 
	texture: feedTexture,
	variants: 110 			// feed button has no on/off (state)
})
let backSkin = new Skin({
	height: 31, width: 19,
	texture: backTexture,
	variants: 19
})


/*******************************/
/*******    TEMPLATES  *********/
/*******************************/
// Slider({ min, max, value })
var lastOpacity;
let Slider = VerticalSlider.template($ => ({
    height: 100, right: 50,
    Behavior: class extends VerticalSliderBehavior {
        onValueChanged(container) {
            if(remotePins){
            	var value = Math.round(this.data.value) / 100;		// Convert values 0-100 to 0-1 decimals for analog output
            	remotePins.invoke("/lamp/write", value);
            	value = Math.round(value * 10) * 10;				// Round original value to nearest 10 for opacity thresholds
            	if (value != lastOpacity){							// Only change opacity if it's different than current screen
            		trace("invoking changeopacity handler\n");
            		lastOpacity = value;
            		if (deviceURL != "") new Message(deviceURL + "changeOpacity?" + serializeQuery({param: value})).invoke(Message.JSON);
            	}
            }
        }
    }
}));

// BackArrow({ name })
var BackArrow = Container.template( $ => ({
	left: 20, height: 31, width: 19,
	name: $.name, skin: backSkin, variant: 0,
	active: true,
	behavior: pushBackBehavior
}))


// CircleButton({ name, skin, variant }) - skin should be a button skin with states/variants
var CircleButton = Content.template ( $ => ({
	height: 110, width: 110,
	name: $.name, skin: $.skin, 
	state: 0, variant: $.variant,
	active: true,
	behavior: buttonBehavior
}))

// NestedTier({ boxSkin, name, buttonSkin, variant })
var NestedTier = Container.template( $ => ({
	left: 0, right: 0, top: 0, height: 140, 
 	skin: $.boxSkin,
	contents: [],
	behavior: Behavior({
		onCreate(container){
			var button = new CircleButton({ name: $.name, skin: $.buttonSkin, variant: $.variant })
			container.add(button);
			if (button.variant == 2){
				container.add(new BackArrow({ name: $.name }));
			}
		}
	})
}))


/*******************************/
/*****    APP COMPONENTS  ******/
/*******************************/
let header = new Container({
	left: 0, right: 0, top: 0, height: 60,
	skin: headerSkin,
	contents: [new Label({ style: titleFont, string: "koopa" })]
})

let mainScreen = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	contents: [
		new NestedTier({ name: "lamp", boxSkin: new Skin({ fill: "#E8F9E0" }), buttonSkin: lampSkin, variant: 0 }),
		new NestedTier({ name: "weigh", boxSkin: new Skin({ fill: "#CFF1BF" }), buttonSkin: weighSkin, variant: 0 }),
		new NestedTier({ name: "feed", boxSkin: new Skin({ fill: "#B8F99A" }), buttonSkin: feedSkin, variant: 0 }),
	]
})

let appContainer = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: new Skin({fill: "white"}),
	contents: [header, mainScreen]
})



/*******************************/
/*********    MAIN  ***********/
/*******************************/
application.behavior = new AppBehavior();
application.add(appContainer);