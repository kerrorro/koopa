let mainTexture = new Texture('assets/main.png', 1);let horizontalSliderBarSkin = new Skin({ texture: mainTexture, x: 45, y: 50, width: 60, height: 50, states: 50, tiles: { left:15, right:25 } });let horizontalSliderButtonSkin = new Skin({ texture: mainTexture, x: 110, y: 50, width: 30, height: 50, states: 50 });let verticalSliderBarSkin = new Skin({ texture: mainTexture, x: 200, y: 95, width: 50, height: 60, states: 50, tiles: { top:15, bottom:25 } });let verticalSliderButtonSkin = new Skin({ texture: mainTexture, x: 250, y: 110, width: 50, height: 30, states: 50 });

export var THEME = {
	mainTexture, horizontalSliderBarSkin, horizontalSliderButtonSkin, verticalSliderBarSkin, verticalSliderButtonSkin,
}