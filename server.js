var mosca = require("mosca");
var settings = {
    port: 1883,
    host: "192.168.1.145"
};

var server = new mosca.Server(settings);

server.on("ready", function() {
    console.log("ready");
});
