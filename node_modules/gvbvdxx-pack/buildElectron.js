var gvbvdxxPack = require("./index.js");
var fs = require("fs");
var path = require("path");
const FS = fs;
let filepathlist = [];
//get all files in directories
function ThroughDirectory(directory) {
    fs.readdirSync(directory).forEach(File => {
        const absolute = path.join(directory, File);
        if (fs.statSync(absolute).isDirectory()) {
            return ThroughDirectory(absolute);
        } else {
            return filepathlist.push(path.normalize(absolute));
		}
    });
}
filepathlist = [];
ThroughDirectory("./src/");
/**
 * File Paths
 * @array
 * Disable Logging
 * @boolean
 **/
var files = gvbvdxxPack.compile(filepathlist,false);
/**
 * Compiled Files
 * @array
 * HTML Template
 * @string OR @null
 **/
gvbvdxxPack.buildElectron(files, null);