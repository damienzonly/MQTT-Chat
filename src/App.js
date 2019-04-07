import React, { Component } from "react";
import Display from "./components/Display";
import Navbar from "./components/static/Navbar";
import Sidebar from "./components/Sidebar";

let mqtt = require("mqtt");

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "user " + Math.floor(Math.random() * 100),
            messageID: 0,
            roomID: 0,
            currentRoom: "",
            rooms: [
                {
                    room: "general",
                    id: 0,
                    messages: []
                }
            ]
        };
    }

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
            })
            .on("error", err => {
                if (err) console.error(err);
            })
            .on("message", (topic, message) => {
                console.log(message.toString());
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


                    <div className="col-md-2 border border-0 bg-dark text-light">
                        <Sidebar rooms={this.state.rooms} toggleRoom={this.toggleRoom} addRoom={this.addRoom} />
                    </div>


                    <div className="col-md-6 border border-0 bg-dark text-light">
                        <Display currentRoom={this.state.currentRoom} />
                    </div>


                    <div className="col-md-4 border border-0 bg-dark text-light">
                        <h4>User profile</h4>
                        <strong>Username</strong>: {this.state.account}
                    </div>
                </div>
            </>
        );
    }
}

export default App;
