document.getElementById("midiFile").innerHTML = "";
function PlayMidi(file) {
	//here is where the real time starts!
	//console.log(file);
	document.getElementById("midiFile").innerHTML = `
	<option value="static/sample.mid?n=1">Sample</option>
	<option value="static/GreenHillZone.mid?n=1">Green Hill Zone</option>
	<option value="static/test.mid?n=1">Test</option>
	<option value="static/sonic/Angel Island Zone Act 1.mid?n=1">Angel Island Zone Act 1</option>
	<option value="static/EmeraldHillZone.mid?n=1">Emerald Hill Zone</option>
	<option value="static/CasinoNightZone2P.mid?n=1">Casino Night Zone 2P</option>
	<option value="static/GarysRoom.mid?n=1">Gary's Room</option>
	<option value="static/sonic/Flying Battery Zone Act 1.mid?n=1">Sonic The Hedgehog 3 Flying Battery Act 1</option>
	<option value="static/PizzaTheme.mid?n=1">Pizza Time</option>
	<option value="static/Bad_Piggies_MIDIPIANO.mid?n=1">Bad Piggies</option>
	<option value="static/sonic/Data Select.mid?n=1">Data Select From Sonic The Hedgehog 3</option>
	<option value="static/PoseMii.mid?n=1">Pose Mii Main Theme</option>
	<option value="static/magickey.mid?n=1">Magickey</option>
	<option value="static/express.mid?n=1">Express</option>
	<option value="static/outside.mid?n=1">Outside</option>
	<option value="static/huh.mid?n=1">?????????????????</option>
	`;
	window.GMidi = new GvbvdxxMidi(file);
	document.getElementById("play").disabled = true;
	document.getElementById("stop").disabled = true;
	document.getElementById("midiFile").disabled = true;
	document.getElementById("selectMidi").onchange = function () {
		var file = document.getElementById("selectMidi").files[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = function () {
				document.getElementById("midiFile").innerHTML += `<option value="${reader.result}">${file.name}</option>`;
			}
			reader.readAsDataURL(file);
		}
	};
	GMidi.addEventListener("soundfontLoaded",function () {
		document.getElementById("play").disabled = false;
		document.getElementById("stop").disabled = false;
		document.getElementById("midiFile").disabled = false;
		document.getElementById("midiFile").onchange = async function () {
			document.getElementById("midiFile").disabled = true;
			var request = await fetch(this.value);
			var arrayBuffer = await request.arrayBuffer();
			GMidi.loadMidi(new Uint8Array(arrayBuffer));
			document.getElementById("midiFile").disabled = false;
		};
		document.getElementById("play").onclick = function(){GMidi.play();document.getElementById("midiFile").disabled = true;};
		document.getElementById("stop").onclick = function(){GMidi.stop();document.getElementById("midiFile").disabled = false;};
		GMidi.addEventListener("ended",() => {
			document.getElementById("midiFile").disabled = false;
		})
	});
}
//this part is not needed, you can get the binary data, any way you like!
(async function () {
	var request = await fetch("static/sample.mid?n=1");
	var arrayBuffer = await request.arrayBuffer();
	PlayMidi(new Uint8Array(arrayBuffer));
})();