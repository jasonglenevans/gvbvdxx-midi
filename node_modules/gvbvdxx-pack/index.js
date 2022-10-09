const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const http = require("http");
var packageFunction = (p) => {
	return require("./packager/").packager(fs.readFileSync(path.join("./",p),{encoding:"UTF-8"}),p);
};
var {convertStringToFile} = require("./packager/");
let filepathlist = [];
let dirpathlist = [];
//get all files in directories
function ThroughDirectory(directory) {
    fs.readdirSync(directory).forEach(File => {
        const absolute = path.join(directory, File);
        if (fs.statSync(absolute).isDirectory()) {
			dirpathlist.push(absolute);
            return ThroughDirectory(absolute);
        } else {
            return filepathlist.push(absolute);
		}
    });
}
var expo = require("./main.js");
expo.buildElectron = require("./electron.js");
module.exports = expo;