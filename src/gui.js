var gconsole = require("log");
var srcs = require("src/gui-src.js");
class GvbvdxxMidiUI {
	constructor (gmidi) {
		if (gmidi) {
			this.gmidi = gmidi;
			this.div = document.createElement("div");
			this.div.setAttribute("style","width: 430px;height: 40px;background: #adb5bd;border-radius: 32px;");
			this.div.innerHTML = `
				<img height=40 src="${srcs.play}" style="float:left;margin-left:10px;">
				<progress max=100 min=0 value=0 style="float:left;height:20px;margin-top:10px;width:55%;"></progress>
				<input type="range" width="50%" min=0 max=100 value="100" style="float:left;height:20px;margin-top:10px;">
			`;
			this.togglePlayButton = this.div.children[0];
			this.progress = this.div.children[1];
			this.volume = this.div.children[2];
			var gmidi = this.gmidi;
			this.volume.oninput = function () {
				gmidi.volume = this.value/100;
			};
		} else {
			gconsole.error("Gvbvdxx Midi UI: GvbvdxxMidi Is Not Put In Constructor, Please Make Sure It Is Correctly Entered.")
		}
	}
	appendChild (obj) {
		obj.appendChild(this.div);
	}
	getContainer () {
		return this.div;
	}
}
module.exports = GvbvdxxMidiUI;