import Pins from "pins";

let headerSkin = new Skin({fill: "green"})




let header = new Container({
	left: 0, right: 0, top: 0, height: 40,
	skin: headerSkin
})

let nestedTier = Container.template( $ => ({
	left: 0, right: 0, top: 0, bottom: 0, 

}))

let mainScreen = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	contents: [
		new Container({ left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "blue" }) }),
		new Container({ left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "orange" }) }),
		new Container({ left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "red" }) })
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