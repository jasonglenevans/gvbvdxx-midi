var fs = require("fs");
fs.writeFileSync("default-soundfont.js",`module.exports = "+${"data:text/plain;charset=utf-8;base64,"+fs.readFileSync("soundfont.gsf",{encoding:"base64"})}+";`)