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

    scrollMessagesToBottom = () => {
        let g = document.getElementById("messages-list");
        g.scrollTop = g.scrollHeight;
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
                    console.log("subscribed to", room);
                }
            })
            .on("error", err => {
                if (err) console.error(err);
            })
            .on("message", (topic, message) => {
                try {
                    message = JSON.parse(message);
                    console.log("received", message);
                    if (message.sender === this.state.account) return;
                    this.addMessageToRoom(message);
                } catch (e) {
                    console.error(e);
                }
            });
    };

    openRoom = e => {
        e.preventDefault();
        let nextRoom = e.target.value;
        this.client.subscribe(nextRoom);
        this.setState({ currentRoom: nextRoom });
        console.log("switching room:", nextRoom);
    };

    addRoom = () => {
        this.setState(state => {
            let newRoomName = prompt("Enter the new room name");
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
        console.log("keydown", event.key);
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
                currentRoom={{
                    name: this.state.currentRoom,
                    room: this.getCurrentRoom()
                }}
                currentRoomName={this.state.currentRoom}
                currentMessage={this.state.currentMessage}
                onTextareaChange={this.onTextareaChange}
                onTextareaKeyDown={this.onTextareaKeyDown}
            />
        );
    }
}

export default ChatApp;
