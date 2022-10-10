(function () {
    var dirname = "";
    var __gvbvdxx_pack_log = {
        log: function (a, b) {
            console.log("%c[" + a + "]:" + b, "color:black;font-weight:bold;");
        },
        warn: function (a, b) {
            console.warn("%c[" + a + "]:" + b, "color:#ffa94d;font-weight:bold;background:#d9480f;");
        },
        error: function (a, b) {
            console.error("%c[" + a + "]:" + b, "color:#ff8787;font-weight:bold;background:#c92a2a;");
        }
    };
    var require = (a) => {
        if (a == "log") {
            return {
                log: function (b) {
                    console.log("%c[" + "Gvbvdxx Pack Script" + "]:" + b, "color:black;font-weight:bold;");
                },
                warn: function (b) {
                    console.warn("%c[" + "Gvbvdxx Pack Script" + "]:" + b, "color:#e67700;font-weight:bold;background:#fcc419;");
                },
                error: function (b) {
                    console.error("%c[" + "Gvbvdxx Pack Script" + "]:" + b, "color:#f03e3e;font-weight:bold;background:#c92a2a;");
                }
            };
        }
        if (a == "html") {
            return class HTMLEmmitter {
                constructor() {
					/*support for writing html*/
					this.writeHTML = (contents, object) => {
						var subject = null;
						if (object) {
							subject = object;
						} else {
							subject = document.body;
						}
						subject.innerHTML += contents;
						return subject;
					};
					/*support for setting html*/
					this.setHTML = (contents, object) => {
						var subject = null;
						if (object) {
							subject = object;
						} else {
							subject = document.body;
						}
						subject.innerHTML = contents;
						return subject;
					};
				}

            };
        }
        if (a == "file-loader") {
            return {
                readFile: function (a) {
                    for (var i in var__gvbvdxx_pack_filedata) {
                        if (var__gvbvdxx_pack_filedata[i].realdirNoReplacer.replaceAll("\\", "/") == a) {
                            return var__gvbvdxx_pack_filedata[i].data;
                        }
                    }
                    return null;
                }
            };
        }
        for (var i in var__gvbvdxx_pack_filedata) {
            if (var__gvbvdxx_pack_filedata[i].realdirNoReplacer.replaceAll("\\", "/") == a) {
				try{
					return eval(var__gvbvdxx_pack_filedata[i].data);
				} catch(e) {
					__gvbvdxx_pack_log.error("Gvbvdxx Pack", "Failed To Extucute "+var__gvbvdxx_pack_filedata[i].realdirNoReplacer+". "+e);
					throw Error(e);
					return;
				}
            }
        }
        throw Error("Unable To Find Module " + a)
    };
    var dirs = () => {
        var dirsgen = [];
        for (var i in var__gvbvdxx_pack_filedata) {
            dirsgen.push(var__gvbvdxx_pack_filedata[i].name.replaceAll("\\", "/"));
        }
        return dirsgen;
    };
    var var__gvbvdxx_pack_filedata = {};
    async function fetchFiles() {
		var response = await fetch("./gvbvdxxpack_files.json?n=1").catch(function () {
			throw Error("Fetch Fail")
		});
        var text = await response.text();
        return text;
    };
    var__gvbvdxx_pack_filedata = GPDATA.fileTemplate;
    __gvbvdxx_pack_log.log("Gvbvdxx Pack", "Loaded Files");
	try{
		require("src/index.js");
	}catch(e){}
	delete GPDATA;
})();
