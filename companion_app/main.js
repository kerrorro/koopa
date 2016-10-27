import Pins from "pins";
let remotePins;

/*******************************/
/*******    BEHAVIORS  *********/
/*******************************/
class AppBehavior extends Behavior {
    onLaunch(application) {
        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "pins-share") {
                    trace("Connecting to remote pins\n");
                    remotePins = Pins.connect(connectionDesc);
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
    	trace("Toggling light\n");
        if (remotePins) remotePins.invoke("/lamp_app/write", value);
    }
}

var buttonBehavior = Behavior({
	onTouchBegan: function(button){
		if (button.variant !== 2) button.variant == 0? button.variant = 1 : button.variant = 0;
	},
	onTouchEnded: function(button){
		button.state == 0? button.state = 1 : button.state = 0;
		if (button.variant !== 2) button.variant == 0? button.variant = 1 : button.variant = 0;
		if (button.name == "lamp"){
			// Write HIGH to lamp if button state turned on
			button.state == 0? application.distribute("onToggleLight", 0) : application.distribute("onToggleLight", 1);
		}
		else if (button.name == "weigh" && button.variant !== 2){
			button.container.skin = new Skin({ fill: "#5DD454" });
			button.variant = 2;
			button.container.add(new BackArrow);
			if (remotePins) {
				remotePins.invoke("/scale/read", function(result){
					if (result){
						var displayString = result + " lbs";
						button.container.add(new Label({ style: abzFont, string: displayString}))
					}
				})
			}
		}
		else if (button.name == "feed" && button.variant !== 2){
			button.container.skin = new Skin({ fill: "#20B46C" });
			button.variant = 2;
		}
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



var BackArrow = Container.template( $ => ({
	left: 20, height: 31, width: 19,
	skin: backSkin, variant: 0,
	active: true,
	behavior: Behavior({
		onTouchBegan: function(button){
			button.variant = 1;
		},
		onTouchEnded: function(button){
			button.variant = 0;
			application.distribute("defaultView");
		}
	})

}))

let header = new Container({
	left: 0, right: 0, top: 0, height: 60,
	skin: headerSkin,
	contents: [new Label({ style: titleFont, string: "koopa" })]
})



// CircleButton({ skin }) - skin should be a button skin with states/variants
var CircleButton = Content.template ( $ => ({
	height: 110, width: 110,
	name: $.name, skin: $.skin, 
	state: 0, variant: 0,
	active: true,
	behavior: buttonBehavior
}))

// NestedTier({ skin, content })
var NestedTier = Container.template( $ => ({
	left: 0, right: 0, top: 0, height: 140, 
	name: "tier", skin: $.boxSkin,
	contents: [],
	behavior: Behavior({
		onCreate(container){
			if ($.content == "button"){
				trace("content is a button\n");
				container.add(new CircleButton({ name: $.name, skin: $.buttonSkin }));
			}
			if ($.content == "string"){
				container.skin = $.skin;
				trace("content is a string\n");
			//	container.add(new Label({style: abzFont, top: 0, left: 0, right: 0, bottom: 0, string: "Your pet was fed." }))
			}
		}
	})
}))

let mainScreen = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	contents: [
		new NestedTier({ name: "lamp", boxSkin: new Skin({ fill: "#E8F9E0" }), buttonSkin: lampSkin, content: "button" }),
		new NestedTier({ name: "weigh", boxSkin: new Skin({ fill: "#CFF1BF" }), buttonSkin: weighSkin, content: "button" }),
		new NestedTier({ name: "feed", boxSkin: new Skin({ fill: "#B8F99A" }), buttonSkin: feedSkin, content: "button" }),
		
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