if (!(window.AudioContext)) {
	throw Error("Sorry But It Looks Like You Have Not Set It Up Correctly. Are You Using Electron? If So Please Use Require In Renderer Proccess.");
}
require("dist/main.js"); //should work