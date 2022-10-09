module.exports ={
	a:"test, a",
	b:"test, b",
	functionTest: function () {
		try{
			if (log) {
				console.log(log);
			}
		}catch(e){}
		var log = require("log");
		log.log("test");
	}
};