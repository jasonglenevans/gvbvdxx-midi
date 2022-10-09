var audioCTX = new AudioContext();
setInterval(() => {
	if (!(audioCTX.state == "running")) {
		audioCTX = new AudioContext();
	}
},1);
var preload = {};
class AudioApiReplacement {
	constructor (data) {
		function loadSample(url) {
		  return fetch(url)
			.then(response => response.arrayBuffer());
		}
		this.data = data;
		this.source = null;
		this.playbackRate = 1;
		
	}
	play () {
		if (!(this.source)) {
			function loadSample(url) {
			  return fetch(url)
				.then(response => response.arrayBuffer());
			}
			const source = audioCTX.createBufferSource();
			function copy(src)  {
				var dst = new ArrayBuffer(src.byteLength);
				new Uint8Array(dst).set(new Uint8Array(src));
				return dst;
			}
			this.gainNode = audioCTX.createGain();
			audioCTX.decodeAudioData(copy(this.data),(buffer) => {

				source.buffer = buffer;
				source.playbackRate.value = this.playbackRate;
				source.connect(this.gainNode);
				this.gainNode.connect(audioCTX.destination);
				this.gainNode.gain.value = this.startVol;
				source.start(0);
				this.source = source;
				var s = this;
				source.onended = function () {
					s.sorce = null;
				};
			});
		}
	}
	pause () {
		if (this.source) {
			this.source.stop();
			this.source = null;
			this.gainNode = null
		}
	}
	remove () {
		delete this;
	}
	setVolume (value) {
		if (this.source) {
			//console.log(value);
			this.gainNode.gain.value = value;
		} else {
			this.startVol = value;
		}
	}
	getVolume () {
		return this.gainNode.gain.value;
	}
}
module.exports = {c:AudioApiReplacement,preload:preload};