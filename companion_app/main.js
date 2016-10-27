import Pins from "pins";

/*******************************/
/*******    TEXTURES  *********/
/*******************************/

let lampTexture = new Texture("assets/lamp_buttons.png");
let weighTexture = new Texture("");
let feedTexture = new Texture("");

/*******************************/
/*********    SKINS  ***********/
/*******************************/
let headerSkin = new Skin({fill: "green"})
let tierSkin = new Skin({fill: "white"})

/******** button skins *******/
// Grid of skin states (on/off) and variants (up/down)
let lampSkin = new Skin({
	height: 100, width: 100, // dimensions of grid cell
	texture: lampTexture,
	states: 100, variants: 100 // state and variant offsets
})
let weighSkin = new Skin({
	height: 100, width: 100, // dimensions of grid cell
	texture: feedTexture,
	states: 100, variants: 100 // state and variant offsets
})
let feedSkin = new Skin({
	height: 100, width: 100, // dimensions of grid cell
	texture: feedTexture,
	states: 100, variants: 100 // state and variant offsets
})



let header = new Container({
	left: 0, right: 0, top: 0, height: 60,
	skin: headerSkin
})

// CircleButton({ skin }) - skin should be a button skin with states/variants
var CircleButton = Content.template ( $ => ({
	height: 100, width: 100,
	skin: $.skin, 
	state: 0, variant: 0
}))

// NestedTier({ skin, content })
var NestedTier = Container.template( $ => ({
	left: 0, right: 0, top: 0, bottom: 0, 
	skin: tierSkin,
	contents: [],
	behavior: Behavior({
		onCreate(container){
			if ($.content == "button"){
				trace("content is a button\n");
				container.add(new CircleButton({ skin: lampSkin }));
			}
			if ($.content == "string"){
				container.skin = $.skin;
				trace("content is a string\n");
			}
		}
	})
}))

let mainScreen = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	contents: [
		new NestedTier({ skin: new Skin({fill: "white"}), content: "button" }),
		new NestedTier({ skin: new Skin({fill: "orange"}), content: "button" }),
		new NestedTier({ skin: new Skin({fill: "red"}), content: "button" }),
		
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