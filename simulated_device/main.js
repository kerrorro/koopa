import Pins from "pins";

let textStyle = new Style({ font: "bold 50px", color: "white" });
let MainContainer = Container.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0,
    skin: new Skin({ fill: $.backgroundColor }),
    contents: [
        Label($, {
            top: 70, bottom: 70, left: 70, right: 70,
            style: textStyle,  string: $.string
        }),
    ],
}));

class AppBehavior extends Behavior {
    onLaunch(application) {
        Pins.configure({
         	/***********************/
            /***** OUTPUT PINS *****/
            /***********************/
            
        	/*** switching lamp on/off from companion app ***/
        	lamp_app: {
                require: "Digital", // digital output to toggle lamp
                pins: {
                    //ground: { pin: 51, type: "Ground" },
                    digital: { pin: 52, direction: "output" },
                }
            }, 
           
            /*** adjusting lamp brightness from companion app ***/
            lamp_intensity: {		// analog output 
            	require: "pwmBLL",
            	pins: {
            		pwm: { pin: 28 }
            	}
            },
            
            /*** rotating feeder servo to dispense food from companion app ***/
            feed_servo: {
            	require: "servo",
            	pins: {
                	servo: { pin: 59 },
                	pwr:   { pin: 60, voltage: 5, type: "Power" },
               		gnd:   { pin: 61, type: "Ground" } 
            	},
            	servoData: this.servoData,
            },
       		/***********************/
            /***** INPUT PINS ******/
            /***********************/
            
            /*** reading in weight when turtle is on scale ***/
            scale: {				// analog input to display weight from scale
            	require: "Analog",
            	pins: {
            		ground: { pin: 53, type: "Ground" },
            		analog: { pin: 54 }
            	}
            },
            
            /*** lamp turns on when turtle is on the platform and off otherwise ***/            
            lamp_platform: {			// digital input to toggle lamp
            	require: "Digital",
            	pins: {
            		ground: { pin: 55, type: "Ground" },
            		digital: { pin: 56, direction: "input" }
            	}
            },
            
               
        },  success => {
            if (success) {
            	trace("Pins configured successfully\n");
                //Pins.invoke("/lamp_intensity/write", 0.5);
                Pins.share("ws", {zeroconf: true, name: "pins-share"});
                application.add(new MainContainer({ string: "Ready!", backgroundColor: "#7DBF2E" }));
            } else {
                   application.add(new MainContainer({ string: "Error", backgroundColor: "red" }));
               };
        });
    }
}
application.behavior = new AppBehavior();