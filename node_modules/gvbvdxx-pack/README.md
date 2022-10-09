### gvbvdxx-pack

Node JS Based API For HTML,
Hide Variables, And Make Node JS Programs Do The Build And Devlopement Server For You.

Get Started:

```
mkdir my-gvbvdxx-pack-project
cd my-gvbvdxx-pack-project
npm init
npm install https://github.com/jasonglenevans/gvbvdxx-pack
mkdir src/
cd src/
echo "//put some code here" >> index.js
cd ../
mkdir static/
```

# Usage

To do things, like build and devlopment server, use node js programs,
like this:

To open a devlopment server:

```
var gvbvdxxPack = require("gvbvdxx-pack");
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
            return filepathlist.push(absolute);
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
 * Port Number (HTTP)
 * @number
 **/
gvbvdxxPack.devServer(files, null, 4524);
```

To build your code:

```
var gvbvdxxPack = require("gvbvdxx-pack");
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
gvbvdxxPack.build(files, null);
```

To Build An Electron App

```
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
```

For API Used A Good Example Is:

```
var log = require("log");
log.log("Hello, world!")
```

and for requiring you must do:

```
cost someModule = require("src/module/index.js");
```

also, there is no support for webpack modules, you must make your own, and you cannot use the import,
your forced to use require, because im to lazy to add the import.

there are two ways of exporting modules:

First way:

```
module.exports = "something goes here";
```

Second Way:

```
return "something goes here";
```

and YES, they both work, for now.

# Notes

When requiring modules, you may see that you need to first put the src in front of it like this:
```
require("src/moduleName.js")
```

and if your script is in a directory, for example, "src/scripts/index.js" the you need to do:

```
require("src/scripts/someOtherScript.js")
```

same thing for modules, and other stuff.