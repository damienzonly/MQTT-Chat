import React, { Component } from "react";
import Dashboard from "./components/Dashboard";

let mqtt = require("mqtt");

let DISCOVERY_INTERVAL = 1000;
let PURGE_INTERVAL = 10000;
let ONLINE_CHECK_INTERVAL = 2000;
class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "user " + Math.floor(Math.random() * 100),
            currentRoom: "global",
            currentMessage: "",
            rooms: {
                global: {
                    messages: [
                        {
                            text: "Welcome to the IRC chat",
                            sender: "default-account",
                            time: new Date()
                        }
                    ],
                    members: {}
                }
            }
        };
        this.handleOnlinePeople();
    }

    addMessageToRoom = (message, room) => {
        if (message.text === "") return;
        this.setState(state => {
            room = room || state.currentRoom;
            let nextRoom = state.rooms[room];
            nextRoom.messages = [
                ...nextRoom.messages,
                {
                    text: message.text,
                    sender: message.sender,
                    time: new Date()
                }
            ];
            return {
                rooms: {
                    ...state.rooms,
                    [room]: nextRoom
                }
            };
        }, this.scrollMessagesToBottom);
    };

    handleOnlinePeople = () => {
        setInterval(() => {
            this.setState(state => {
                let rooms = state.rooms;
                for (const room in rooms) {
                    let members = rooms[room].members;
                    for (const member in members) {
                        let last_seen = members[member].last_seen;
                        let now = Date.now();
                        if (now - last_seen < ONLINE_CHECK_INTERVAL) {
                            members[member].online = true;
                        } else if (now - last_seen > PURGE_INTERVAL) {
                            delete members[member];
                        } else {
                            members[member].online = false;
                        }
                    }
                }
                return { rooms };
            });
        }, 2000);
    };
    componentWillMount = () => {
        // initialize mqtt
        this.client = mqtt.connect("ws://localhost", {
            port: 8888
        });
        this.client
            .on("connect", () => {
                console.debug("Client mqtt connected");
                for (const room of Object.keys(this.state.rooms)) {
                    this.client.subscribe(room);
                    this.client.subscribe(room + "/discovery");
                    console.debug("subscribed to", room);
                    console.debug("subscribed to", room + "/discovery");
                    setInterval(() => {
                        this.sendDiscovery(room);
                    }, DISCOVERY_INTERVAL);
                }
            })
            .on("error", err => {
                if (err) console.error(err);
            })
            .on("message", (topic, message) => {
                try {
                    message = JSON.parse(message);
                    if (topic.match(/\w+\/discovery$/)) {
                        // add new detected user
                        return this.addMemberToRoom(message, message.room);
                    }
                    if (message.sender === this.state.account) return;
                    this.addMessageToRoom(message, topic);
                } catch (e) {
                    console.error(e);
                }
            });
    };

    sendDiscovery = room => {
        this.client.publish(
            room + "/discovery",
            JSON.stringify({
                account: this.state.account,
                room: this.state.currentRoom,
                last_seen: Date.now(),
                online: true
            })
        );
    };

    addMemberToRoom = (member, room) => {
        let nextRoom = this.getRoom(room);
        let roomMembers = Object.keys(nextRoom.members);
        if (roomMembers.indexOf(member) !== -1) return;
        nextRoom.members = {
            ...nextRoom.members,
            [member.account]: member
        };
        this.setState(state => {
            return {
                rooms: {
                    ...state.rooms,
                    [room]: nextRoom
                }
            };
        });
    };

    openRoom = e => {
        if (!e) return;
        let typeof_e = typeof e !== "string";
        if (typeof_e) e.preventDefault();
        let nextRoom = typeof_e ? e.target.value : e;
        this.client.subscribe(nextRoom);
        this.setState({ currentRoom: nextRoom });
        this.sendDiscovery(nextRoom);
        setTimeout(() => {
            this.scrollMessagesToBottom();
            this.focusTextArea();
        }, 0);
    };

    focusTextArea = () => {
        document.getElementById("message-field").focus();
    };

    scrollMessagesToBottom = () => {
        let g = document.getElementById("messages-list");
        g.scrollTop = g.scrollHeight;
    };

    addRoom = () => {
        let newRoomName;
        this.setState(state => {
            newRoomName = prompt("Enter the new room name");
            if (!newRoomName) return;
            if (this.state.rooms.hasOwnProperty(newRoomName)) return;
            this.client.subscribe(newRoomName);
            return {
                rooms: {
                    ...state.rooms,
                    [newRoomName]: {
                        messages: [],
                        members: {}
                    }
                }
            };
        });
        setImmediate(() => {
            this.openRoom(newRoomName);
        });
    };

    getRoom = room => {
        return this.state.rooms.hasOwnProperty(room) ? this.state.rooms[room] : null;
    };

    getCurrentRoom = () => {
        return this.state.rooms[this.state.currentRoom];
    };

    onTextareaSubmit = event => {
        event.preventDefault();
        this.addMessageToRoom({
            sender: this.state.account,
            text: this.state.currentMessage
        });
        setImmediate(() => {
            this.client.publish(
                this.state.currentRoom,
                JSON.stringify({
                    sender: this.state.account,
                    text: this.state.currentMessage
                })
            );
            this.setState({ currentMessage: "" });
        });
    };
    onTextareaChange = event => {
        this.setState({ currentMessage: event.target.value });
    };
    onTextareaKeyDown = event => {
        if (event.keyCode === 13) {
            if (!event.shiftKey) {
                this.onTextareaSubmit(event);
            }
        }
    };

    render() {
        return (
            <Dashboard
                account={this.state.account}
                rooms={this.state.rooms}
                openRoom={this.openRoom}
                addRoom={this.addRoom}
                addMessageToRoom={this.addMessageToRoom}
                currentRoom={this.state.currentRoom}
                getCurrentRoom={this.getCurrentRoom}
                currentRoomName={this.state.currentRoom}
                currentMessage={this.state.currentMessage}
                onTextareaChange={this.onTextareaChange}
                onTextareaKeyDown={this.onTextareaKeyDown}
            />
        );
    }
}

export default ChatApp;
