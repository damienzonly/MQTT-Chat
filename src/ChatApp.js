import React, { Component } from "react";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ChangeUsername from "./components/ChangeUsername";

let mqtt = require("mqtt");

let DISCOVERY_INTERVAL = 500;
let PURGE_INTERVAL = 5000;
let ONLINE_CHECK_INTERVAL = 2000;
let DASHBOARD_HEIGHT = 500;

let username =
    process.env.REACT_APP_USERNAME !== "" ? process.env.REACT_APP_USERNAME : "";
let password =
    process.env.REACT_APP_PASSWORD !== "" ? process.env.REACT_APP_PASSWORD : "";

let credentials = username && password ? { username, password } : {};
let useExternalBroker = Number(process.env.REACT_APP_USE_EXTERNAL_BROKER);
let externalBrokerURL = process.env.REACT_APP_EXTERNAL_BROKER_URL;
let externalBrokerPort = process.env.REACT_APP_EXTERNAL_BROKER_PORT;
let externalBrokerPath = process.env.REACT_APP_EXTERNAL_BROKER_PATH;
let internalBrokerURL = process.env.REACT_APP_INTERNAL_BROKER_URL;
let internalBrokerPort = process.env.REACT_APP_INTERNAL_BROKER_PORT;

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "user " + Math.floor(Math.random() * 1000),
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

    changeAccountName = name => {
        if (name === "") return;
        if (name === this.state.account) return;
        let room = this.getRoom(this.state.currentRoom);
        if (name in room.members) {
            console.error(`Username "${name}" already exists`);
            return;
        }
        this.setState({ account: name });
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
                        let time_passed = now - last_seen;
                        if (time_passed < ONLINE_CHECK_INTERVAL) {
                            members[member].online = true;
                        } else if (time_passed > PURGE_INTERVAL) {
                            delete members[member];
                        } else {
                            members[member].online = false;
                        }
                    }
                }
                return {
                    rooms
                };
            });
        }, 2000);
    };
    componentWillMount = () => {
        // initialize mqtt
        if (useExternalBroker) {
            console.debug("Using external broker");
            this.client = mqtt.connect(
                [
                    "ws://",
                    externalBrokerURL,
                    ":",
                    externalBrokerPort,
                    externalBrokerPath
                ].join(""),
                credentials
            );
        } else {
            console.debug("Using internal broker");
            this.client = mqtt.connect(
                ["ws://", internalBrokerURL, ":", internalBrokerPort].join(""),
                credentials
            );
        }
        this.client
            .on("connect", () => {
                console.debug("Connected");
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
                        if (message.room in this.state.rooms) {
                            this.addMemberToRoom(message, message.room);
                        } else {
                            this.client.subscribe(message.room);
                            this.setState(state => {
                                return {
                                    rooms: {
                                        ...state.rooms,
                                        [message.room]: {
                                            members: {},
                                            messages: []
                                        }
                                    }
                                };
                            });
                        }
                        return;
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
        if (this.state.currentRoom === nextRoom) return;
        delete this.state.rooms[this.state.currentRoom].members[
            this.state.account
        ];
        this.client.subscribe(nextRoom);
        this.setState({
            ...this.state,
            currentRoom: nextRoom
        });
        this.sendDiscovery(nextRoom);
        setImmediate(() => {
            this.scrollMessagesToBottom();
            this.resetDraft();
            this.focusTextArea();
        });
    };

    resetDraft = () => {
        this.setState({ currentMessage: "" });
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
        this.setState(
            state => {
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
            },
            () => {
                this.openRoom(newRoomName);
            }
        );
    };

    getRoom = room => {
        return this.state.rooms.hasOwnProperty(room)
            ? this.state.rooms[room]
            : null;
    };

    getCurrentRoom = () => {
        return this.state.rooms[this.state.currentRoom];
    };

    onSendCurrentDraft = event => {
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
            this.setState({
                currentMessage: ""
            });
        });
    };
    onChangeCurrentDraft = event => {
        this.setState({
            currentMessage: event.target.value
        });
    };

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
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
                            onChangeCurrentDraft={this.onChangeCurrentDraft}
                            onSendCurrentDraft={this.onSendCurrentDraft}
                            displayHeight={DASHBOARD_HEIGHT}
                        />
                    </Route>
                    <Route
                        exact
                        path="/account-name"
                        render={p => (
                            <ChangeUsername
                                {...p}
                                account={this.state.account}
                                changeAccountName={this.changeAccountName}
                            />
                        )}
                    />
                </Switch>
            </Router>
        );
    }
}

export default ChatApp;
