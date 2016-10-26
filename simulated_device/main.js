
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
            /***** INPUT PINS ******/
            /***********************/
            scale: {				// analog input to display weight from scale
            	require: "Analog",
            	pins: {
            		ground: { pin: 53, type: "Ground" },
            		analog: { pin: 54 }
            	}
            },            
            lamp_toggle: {			// digital input to toggle lamp off/on
            	require: "Digital",
            	pins: {
            		ground: { pin: 55, type: "Ground" },
            		digital: { pin: 56, direction: "input" }
            	}
            },
            /***********************/
            /***** OUTPUT PINS *****/
            /***********************/
            lamp_intensity: {		// analog output 
            	require: "pwmBLL",
            	pins: {
            		//ground: { pin: 26, type: "Ground" },
            		pwm: { pin: 28 }
            	}
            },
            led: {
                require: "Digital", // use built-in digital BLL
                pins: {
                    ground: { pin: 51, type: "Ground" },
                    digital: { pin: 52, direction: "output" },
                }
            },    
        },  success => {
            if (success) {
            	trace("Pins configured successfully\n");
                //Pins.invoke("/lamp_intensity/write", 0.5);
                application.add(new MainContainer({ string: "Ready!", backgroundColor: "#7DBF2E" }));
            } else {
                   application.add(new MainContainer({ string: "Error", backgroundColor: "red" }));
               };
        });
    }
}
application.behavior = new AppBehavior();