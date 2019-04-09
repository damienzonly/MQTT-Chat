import React, { Component } from "react";
import Dashboard from "./components/Dashboard";

let mqtt = require("mqtt");

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
                            text: "Hello!",
                            sender: "default-account",
                            time: new Date()
                        }
                    ]
                }
            }
        };
    }

    addMessageToRoom = message => {
        if (message.text === "") return;
        this.setState(state => {
            let room = state.rooms[state.currentRoom];
            room.messages = [
                ...room.messages,
                {
                    text: message.text,
                    sender: message.sender,
                    time: new Date()
                }
            ];
            return {
                rooms: {
                    ...state.rooms,
                    [state.currentRoom]: room
                }
            };
        }, this.scrollMessagesToBottom);
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
                    console.debug("subscribed to", room);
                }
            })
            .on("error", err => {
                if (err) console.error(err);
            })
            .on("message", (topic, message) => {
                try {
                    message = JSON.parse(message);
                    console.debug("received", message);
                    if (message.sender === this.state.account) return;
                    this.addMessageToRoom(message);
                } catch (e) {
                    console.error(e);
                }
            });
    };

    openRoom = e => {
        let typeof_e = typeof e !== "string";
        if (typeof_e) e.preventDefault();
        let nextRoom = typeof_e ? e.target.value : e;
        this.client.subscribe(nextRoom);
        this.setState({ currentRoom: nextRoom });
        setTimeout(() => {
            this.scrollMessagesToBottom();
            this.focusTex1tArea();
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
                        messages: []
                    }
                }
            };
        });
        setImmediate(() => {
            this.openRoom(newRoomName);
        })
        
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
        setTimeout(() => {
            this.setState({ currentMessage: "" });
        }, 0);
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
