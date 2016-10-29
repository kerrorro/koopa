import Pins from "pins";
let myPins;
let opacityHex = {
	50: "#E9D083",
	60: "#EACC6F",
	70: "#EDC85B",
	80: "#EBC347",
	90: "#ECBF34",
	100: "#EDBB20",
}

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
    contents: $.content ,
}));

class AppBehavior extends Behavior {
    onLaunch(application) {
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
            	Pins.repeat("/lamp/read", 700, 
							lampState => { trace(Math.round(lampState * 10) * 10 + "\n") });
     			           
                /*application.add(new MainContainer({ 
                		content: [new IconContainer({ variant: 0 }),
                				  new StringContainer({ string: "toasty" })], 
                		backgroundColor: "black"  }));*/
               // application.add(new MainContainer({ content: [logo, pinsReady], backgroundColor: "#E8F9E0" }));
                //application.distribute("onListening");
            } else {
                   application.add(new MainContainer({ content: [logo, pinsReady], backgroundColor: "#E8F9E0" }));
               };
        });
    }
}
application.behavior = new AppBehavior();