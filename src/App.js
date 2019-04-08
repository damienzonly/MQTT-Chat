import React, { Component } from "react";
import Display from "./components/Display";
import Navbar from "./components/static/Navbar";
import Sidebar from "./components/Sidebar";
import OnlineStatus from "./components/OnlineStatus";

let mqtt = require("mqtt");

class App extends Component {
    constructor(props) {
        super(props);
        let rooms = [
            {
                room: "global",
                messages: [
                    {
                        text: "Hello!",
                        sender: "default-account",
                        time: new Date()
                    }
                ]
            }
        ];
        this.state = {
            account: "user " + Math.floor(Math.random() * 100),
            currentRoom: "global",
            rooms
        };
    }

    addMessageToRoom = message => {
        if (message.text === "") return;
        this.setState(state => {
            let rooms = state.rooms;
            let roomPosition = state.rooms.map(item => item.room).indexOf(this.state.currentRoom);
            let roomFound = state.rooms[roomPosition];
            roomFound.messages.push({
                text: message.text,
                sender: message.sender,
                time: new Date()
            });
            return {
                rooms
            };
        });
    };

    incrementMsgIndex = () => {
        let nextIndex;
        this.setState(state => {
            nextIndex = state.msgIndex;
            return {
                msgIndex: state.msgIndex + 1
            };
        });
        return nextIndex;
    };

    componentWillMount = () => {
        // initialize mqtt
        this.client = mqtt.connect("ws://localhost", {
            port: 8888
        });

        this.client
            .on("connect", () => {
                console.debug("Client mqtt connected");
                for (const room of this.state.rooms.map(item => item.room)) {
                    this.client.subscribe(room);
                    console.log("subscribed to", room);
                }
            })
            .on("error", err => {
                if (err) console.error(err);
            })
            .on("message", (topic, message) => {
                try {
                    message = JSON.parse(message)
                    console.log("received", message);
                    if (message.sender === this.state.account) return;
                    this.addMessageToRoom(message)
                } catch(e) {
                    console.error(e)
                }
                
            });
    };

    toggleRoom = e => {
        e.preventDefault();
        this.client.subscribe(e.target.value);
        this.setState({ currentRoom: e.target.value });
        console.log("switching room:", e.target.value);
    };

    addRoom = () => {
        this.setState(state => {
            let newRoomName = prompt("Enter the new room name");
            if (!newRoomName) return;
            if (state.rooms.map(item => item.room).indexOf(newRoomName) !== -1) return;
            this.client.subscribe(newRoomName);
            let newRoomID = state.roomID + 1;
            return {
                roomID: newRoomID,
                rooms: [
                    ...state.rooms,
                    {
                        room: newRoomName,
                        id: newRoomID,
                        messages: []
                    }
                ]
            };
        });
    };

    getCurrentRoom = () => {
        let room = this.state.rooms.filter(item => item.room === this.state.currentRoom);
        if (room.length === 1) {
            return room[0];
        } else {
            throw Error("too many rooms with the same name");
        }
    };

    render() {
        return (
            <>
                <div className="row no-gutters">
                    <div className="col-md-12 mb-4 ">
                        <Navbar account={this.state.account} />
                    </div>
                </div>

                <div className="row no-gutters">
                    <div className="col-md-2 bg-dark text-light">
                        <Sidebar rooms={this.state.rooms} toggleRoom={this.toggleRoom} addRoom={this.addRoom} />
                    </div>

                    <div
                        className="col-md-6 border border-top-0 border-bottom-0 bg-dark text-light"
                        style={{
                            height: 600
                        }}
                    >
                        <Display
                            addMessageToRoom={this.addMessageToRoom}
                            account={this.state.account}
                            currentRoom={this.getCurrentRoom()}
                        />
                    </div>

                    <div className="col-md-4 bg-dark text-light">
                        <OnlineStatus />
                    </div>
                </div>
            </>
        );
    }
}

export default App;
