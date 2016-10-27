import Pins from "pins";

/*******************************/
/*******    TEXTURES  *********/
/*******************************/
let lampTexture = new Texture("assets/lamp_buttons.png");
let weighTexture = new Texture("assets/weigh_buttons.png");
let feedTexture = new Texture("assets/feed_buttons.png");

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
	height: 110, width: 110, // dimensions of grid cell
	texture: weighTexture,
	variants: 110 			// weigh button has no on/off (state)
})
let feedSkin = new Skin({
	height: 110, width: 110, // dimensions of grid cell
	texture: feedTexture,
	variants: 110 			// feed button has no on/off (state)
})



let header = new Container({
	left: 0, right: 0, top: 0, height: 60,
	skin: headerSkin,
	contents: [new Label({ style: titleFont, string: "koopa" })]
})

var buttonBehavior = Behavior({
	onTouchBegan: function(button){
		button.variant == 0? button.variant = 1 : button.variant = 0;
	},
	onTouchEnded: function(button){
		button.state == 0? button.state = 1 : button.state = 0;
		button.variant == 0? button.variant = 1 : button.variant = 0;
	}
})

// CircleButton({ skin }) - skin should be a button skin with states/variants
var CircleButton = Content.template ( $ => ({
	height: 110, width: 110,
	skin: $.skin, 
	state: 0, variant: 0,
	active: true,
	behavior: buttonBehavior
}))

// NestedTier({ skin, content })
var NestedTier = Container.template( $ => ({
	left: 0, right: 0, top: 0, height: 140, 
	name: $.name, skin: $.boxSkin,
	contents: [],
	behavior: Behavior({
		onCreate(container){
			if ($.content == "button"){
				trace("content is a button\n");
				container.add(new CircleButton({ skin: $.buttonSkin }));
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

application.add(appContainer);



/*

let backgroundSkin = new Skin({ fill : ["#202020", "#7DBF2E"] });
let textStyle = new Style({ font: "bold 50px", color: "white" });
let MainContainer = Container.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0,
    active: true, skin: backgroundSkin, state: 0,
    contents: [
        Label($, { name: "statusString", top: 0, bottom: 0, left: 0, right: 0, style: textStyle, string: "OFF" }),
    ],
    Behavior: class extends Behavior {
        onTouchBegan(container) {
            container.state = 1;
            application.distribute("onToggleLight", 1);
        }
        onTouchEnded(container) {
            container.state = 0;
            application.distribute("onToggleLight", 0);
        }
        onToggleLight(container, value) {
            container.statusString.string = (value) ? "ON" : "OFF";
        }
    }
}));

let remotePins;
class AppBehavior extends Behavior {
    onLaunch(application) {
        application.add(new MainContainer());
        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "pins-share-led") {
                    trace("Connecting to remote pins\n");
                    remotePins = Pins.connect(connectionDesc);
                }
            }, 
            connectionDesc => {
                if (connectionDesc.name == "pins-share-led") {
                    trace("Disconnected from remote pins\n");
                    remotePins = undefined;
                }
            }
        );
    }
    onToggleLight(application, value) {
        if (remotePins) remotePins.invoke("/led/write", value);
    }
}
application.behavior = new AppBehavior();
*/