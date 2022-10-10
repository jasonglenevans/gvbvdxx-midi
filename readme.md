### Gvbvdxx Midi

Gvbvdxx Midi Is An Simple To Use, Javascript Midi Player.

### Examples Of Why You (Probaly) Want This

You Have Too Many Midi Files To Convert, Or Your Converter Is Poor

Your Making An Chrome Extension, And Want It To Play Midis

An Midi Player (Electron/NW.JS)

### Install The Libary


To Install, Do The Following:

open into dist.

copy the file "index.js" into your root path.

open into dist/static.

create an directory named static.

put the soundfont.gsf into the static directory (you just created).

load main.js in your root directory


### API

Examples Of Usage

The Soundfont Is Not An Atual Soundfont Format, It Instead Is An Zip, Containing The Instruments And Drums, with an soundfont.json containing the data for the instruments (like tuning and fade speed)

await GvbvdxxMidi.async({File Path / URL / Unit8Array},{soundfontPath (optional, default is "./static/soundfont.gsf")})

Note: if your using file path, then you use an server to use it/ install electron.

```
/*Do not use the new constructor on GvbvdxxMidi.async, it will not work.*/
var playButton = document.getElementById("toggle");
var playButtonTextToggle = false;
playButton.innerHTML = "loading...";
playButton.disabled = true;
(async function () {
	var gmidi = await GvbvdxxMidi.async("./music.mid");
	playButton.disabled = false;
	playButton.onclick = function () {
		playButtonTextToggle = !(playButtonTextToggle);
		if (playButtonTextToggle) {
			gmidi.play();
			playButton.innerHTML = "pause";
		} else {
			
		}
	}
})();
```

Not Only That, You Can Use It A Diffrent Way:

```

var gmidi = new GvbvdxxMidi(file); //same as before, file and soundfont src, the same stuff applies to this as above
gmidi.addEventListener("soundfontLoaded",function () {
	gmidi.play(); //reqiures page interaction to play audio (unless electron)
});

```


### Featured Apps Using This

None Yet, Still Being Worked On!