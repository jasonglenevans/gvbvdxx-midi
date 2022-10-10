var MidiConvert = require("src/converter.js");
var gconsole = require("log");
var JSZip = require("src/jszip.js");
var audReplacement = require("src/audio.js");
var Audio = require("src/audio.js").c;
function BinaryToString(binary) {
    var error;

    try {
        return decodeURIComponent(escape(binary));
    } catch (_error) {
        error = _error;
        if (error instanceof URIError) {
            return binary;
        } else {
            throw error;
        }
    }
}
function ArrayBufferToString(buffer) {
    return BinaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
}
class GvbvdxxMidi { 
	constructor (file,soundfontFile) {
		if (typeof file == "object" || typeof file == "string") {
			var obj = this;
			var sfFile = "static/soundfont.gsf";
			if (soundfontFile) {
				sfFile = soundfontFile;
			}
			if (typeof file == "string") {
				obj.data = "LOADING";
				fetch(file).then((request) => {
					var response = request.status;
					if (response == 200) {
						request.arrayBuffer().then((arrayBuffer) => {
							obj.data = MidiConvert.parse(ArrayBufferToString(new Uint8Array(arrayBuffer)));
						})
					} else {
						this.data = null;
						gconsole.error(`Gvbvdxx Midi Failed To Load Midi File From URL "${file}", Check Your Spelling, And Make Sure The File Exists. Error Code: QUEST RESPONSE ${response}`);
					}
				}).catch((e) => {
					gconsole.error(`Gvbvdxx Midi Failed To Load Midi File From URL "${file}", Check Your Spelling, And Make Sure The File Exists. Error Code: FETCH ERROR ${e}`);
				});
			} else {
				this.data = MidiConvert.parse(ArrayBufferToString(file));
			}
			this.listeners = {play:[],stop:[],ended:[],soundfontLoaded:[],looped:[]};
			this.fx = {};
			this.fx.tickAsync = function () {return new Promise((a) => {setTimeout(a,1)})};
			this.tickAsync = function () {return new Promise((a) => {setTimeout(a,1)})};
			this.fx.waitAsync = function (secs) {return new Promise((a) => {setTimeout(a,secs*1000)})};
			this.fx.fadeOut = async function (audio,fx) {
				if (fx.releaseSpeed) {
					var vol = audio.getVolume()*100;
					while (Math.round(vol*50) > 0) {
						await this.tickAsync();
						vol += (0 - vol)/(fx.releaseSpeed*40);
						audio.setVolume(vol/100);
					}
				}
				audio.setVolume(0);
				audio.pause();
				audio.remove();
				audio = null;
			};
			this.sf = null;
			this.detune = 0;
			this.loading = true;
			(async function () {
				obj.loading = true;
				var req = await fetch(sfFile);
				obj.sf = {};
				obj.sf.zip = await JSZip.loadAsync(await req.arrayBuffer());
				obj.sf.json = JSON.parse(await obj.sf.zip.files["soundfont.json"].async("text"));
				obj.context = new AudioContext();
				obj.sf.preload = {};
				for (var file of Object.keys(obj.sf.zip.files)) {
					obj.sf.preload[file] = await obj.sf.zip.files[file].async("arrayBuffer");
				}
				obj.listeners.soundfontLoaded.forEach((e) => {e();});
				obj.loading = false;
			})();
			obj.fx.loadSample = function (url) {
			return fetch(url)
			.then(response => response.arrayBuffer())
			.then(buffer => context.decodeAudioData(buffer));
			}

			obj.fx.playSample = function (sample) {
				const source = context.createBufferSource();
				source.buffer = sample;
				source.connect(context.destination);
				source.start(0);
			}
			this.fx.note = async function (instrumentNum,ch,note,length,vel) {
				if (ch == 9) {
					var data = obj.sf.json.drums[note.toString()];
					if (data) {
						this.playInstrument(data,true,note,length,vel)
					}
				} else {
					var data = obj.sf.json.instruments[instrumentNum.toString()];
					if (data) {
						this.playInstrument(data,false,note,length,vel)
					}
				}
			}
			this.fx.preload = {};
			this.fx.playInstrument = async function (fx,drums,note,length,vel) {
				var src = "instruments/"+fx.file;
				if (drums) {
					src = "drums/"+fx.file;
				}
				var audio = new Audio(obj.sf.preload[src]);
				audio.setVolume(vel);
				var tuningNote = 60;
				var fixedNote = false;
				if (fx.tuning) {
					if (fx.tuning.note) {
						tuningNote = fx.tuning.note;
					}
					if (fx.tuning.fixedNote) {
						fixedNote = fx.tuning.fixedNote;
					}
				}
				if (!(fixedNote)) {
					audio.preservesPitch = false;
					audio.playbackRate = (2 ** ((note - tuningNote) / 12))-obj.detune;
				}
				audio.play();
				await this.waitAsync(length);
				await this.fadeOut(audio,fx);
			};
			this.currentTime = 0;
			this.startTime = 0;
			this.playing = false;
			this.channelsDone = 0;
			this.channelsActive = 0;
			this.pausedTime = 0;
			this.channelInfo = {};
			this._applyNoteOn = async function (a,b,c,d,e) {
				this.channelInfo[b+1].on = true;
				await obj.fx.note(a,b,c,d,e);
				this.channelInfo[b+1].on = false;
			}
			this.playTrack = async function (track) {
				var notes = track.notes.sort((a,b) => {return a.time-b.time;});
				if (notes.length > 0) {
					this.channelsActive += 1;
				}
				var i = 0;
				var inst = track.instrumentNumber;
				Math.max(inst,0)
				var volume = 100;
				if (this.channelInfo[track.channelNumber+1]) {
					var chInfo = this.channelInfo[track.channelNumber+1];
					if (chInfo.volume) {
						volume = chInfo.volume;
					}
				} else {
					var chInfo = {
						volume:100,
						on:false
					};
					this.channelInfo[track.channelNumber+1] = chInfo;
				}
				//console.log(inst);
				while (notes.length > i && obj.playing) {
					if (notes[i].time < obj.currentTime/(obj.data.header.bpm/1)) {
						var vel = notes[i].velocity;
						this._applyNoteOn(inst,track.channelNumber,notes[i].midi,notes[i].duration,(vel*(chInfo.volume/100))*this.volume)
						i += 1;
					} else {
						await obj.tickAsync();
					}
				}
				//console.log("track "+track.channelNumber+" done.");
				this.channelsDone += 1;
			};
			this.daysSince2000 = function () {
					const msPerDay = 24 * 60 * 60 * 1000;
					const start = new Date(2000, 0, 1); // Months are 0-indexed.
					const today = new Date();
					const dstAdjust = today.getTimezoneOffset() - start.getTimezoneOffset();
					let mSecsSinceStart = today.valueOf() - start.valueOf();
					mSecsSinceStart += ((today.getTimezoneOffset() - dstAdjust) * 60 * 1000);
					return mSecsSinceStart / msPerDay;
			};
			this.paused = false;
			this.volume = 1;
			this.looped = false;
		} else {
			throw Error("GvbvdxxMidi Failed To Create Object: Unknown Typeof \""+(typeof file)+"\"");
		}
	}
	addEventListener (name,funct) {
		if (this.listeners[name]) {
			this.listeners[name].push(funct);
		} else {
			gconsole.warn("GvbvdxxMidi cannot find listener \""+name+"\"")
		}
	}
	play () {
		if (this.data) {
			if (this.data == "LOADING") {
				throw Error("Midi Player In LOADING State.")
			} else {
				this.pausedTime = 0;
				if (this.paused) {
					this.paused = false;
				} else {
					this.listeners.play.forEach((e) => {e();});
					this.playing = false;
					setTimeout(() => {
						function daysSince2000() {
							const msPerDay = 24 * 60 * 60 * 1000;
							const start = new Date(2000, 0, 1); // Months are 0-indexed.
							const today = new Date();
							const dstAdjust = today.getTimezoneOffset() - start.getTimezoneOffset();
							let mSecsSinceStart = today.valueOf() - start.valueOf();
							mSecsSinceStart += ((today.getTimezoneOffset() - dstAdjust) * 60 * 1000);
							return mSecsSinceStart / msPerDay;
						};
						var obj = this;
						obj.channelsActive = 0;
						obj.playing = true;
						obj.startTime = daysSince2000()*86400;
						obj.currentTime = (daysSince2000()*86400)-obj.startTime;
						obj.currentTime = 0;
						this.channelInfo = {};
						function loadTracks () {
							for (const track of obj.data.tracks) {
								obj.playTrack(track);
							}
						}
						loadTracks();
						(async function () {
							obj.channelsDone = 0;
							while (obj.playing) {
								await obj.tickAsync();
								//obj.currentTime += (4*(obj.data.header.bpm/117))/6;
								if (obj.paused) {
									obj.startTime = (daysSince2000()*86400)-obj.pauseTime;
								} else {
									var time = (daysSince2000()*86400)-obj.startTime;
									obj.currentTime = (time*120)*(obj.data.header.bpm/117);
									if (obj.channelsDone+1 > obj.channelsActive) {
										if (obj.looped && obj.playing) {
											obj.listeners.looped.forEach((e) => {e();});
											obj.stop();
											obj.play();
										} else {
											obj.playing = false;
											//console.log("done.")
											obj.listeners.ended.forEach((e) => {e();});
										}
									}
								}
							}
						})();
					},30);
				}
			}
		} else {
			gconsole.error("The File Cannot Be Played: The Data Is Null/Undefined, Check Any Console Errors For Reason Of Failure.")
		}
	}
	stop () {
		this.listeners.stop.forEach((e) => {e();});
		this.channelsDone = 0;
		this.channelsActive = 0;
		this.playing = false;
		this.pausedTime = 0;
		this.paused = false;
	}
	loadMidi (file) {
		if (typeof file == "string") {
			var obj = this;
			var prevData = this.data;
			this.data = "LOADING";
			fetch(file).then((request) => {
				var response = request.status;
				if (response == 200) {
					request.arrayBuffer().then((arrayBuffer) => {
						obj.data = MidiConvert.parse(ArrayBufferToString(new Uint8Array(arrayBuffer)));
					})
				} else {
					this.data = prevData;
					gconsole.error(`Gvbvdxx Midi Failed To Load Midi File From URL "${file}", Check Your Spelling, And Make Sure The File Exists. Error Code: QUEST RESPONSE ${response}`);
				}
			}).catch((e) => {
				gconsole.error(`Gvbvdxx Midi Failed To Load Midi File From URL "${file}", Check Your Spelling, And Make Sure The File Exists. Error Code: FETCH ERROR ${e}`);
			});
		} else {
			this.data = MidiConvert.parse(ArrayBufferToString(file));
		}
	}
}
function asyncTick() {
	return new Promise(() => {
		
	})
}
GvbvdxxMidi.async = function (file,sf) {
	return new Promise((resolve) => {
		var gmid = new GvbvdxxMidi(file,sf);
		gmid.addEventListener("soundfontLoaded",() => {
			resolve(gmid);
		})
	});
};
GvbvdxxMidi.GUI = require("src/gui.js");
window.GvbvdxxMidi = GvbvdxxMidi;
module.exports = GvbvdxxMidi;