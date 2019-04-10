let mqtt = require('mqtt');
let client = mqtt.connect("ws://localhost:8888");
client
    .on("connect", () => {
        console.log("fake conn");
        
        let users = Array(20).fill(0).map(_ => "User " + Math.floor(Math.random() * 1000000));
        setInterval(() => {
            users.map(user => {
                client.publish("global/discovery", JSON.stringify({
                    account: user,
                    room: "global",
                    last_seen: Date.now(),
                    online: true
                }))
            })
        }, 1000);
    });