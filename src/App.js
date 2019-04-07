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
            screens: [],
            subscriptions: [],
            msgIndex: 0,
            currentScreen: ""
        };
    }
    incrementMsgIndex = () => {
        let next;
        this.setState(state => {
            next = state.msgIndex;
            return {
                msgIndex: state.msgIndex + 1
            };
        });
        return next;
    };
    componentDidMount = () => {
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
                // this.pushMessage(message.toString(), "text-left");
            });
    };

    toggleScreen = e => {
        e.preventDefault();
        this.setState({currentScreen: e.target.value})
        console.log(e.target.value);
    };

    render() {
        let display;
        if (this.state.currentScreen) {
            display = <Display screen={this.state.currentScreen} />;
        } else {
            display = <div className="text-center">Select one room using the left sidebar</div>;
        }
        return (
            <>
                <div className="row">
                    <div className="col-md-12 mb-4 ">
                        <Navbar account={this.state.account} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 bg-dark text-light">
                        <Sidebar
                            rooms={[
                                {
                                    room: "room 1",
                                    id: 1
                                },
                                {
                                    room: "room 2",
                                    id: 2
                                },
                                {
                                    room: "room 3",
                                    id: 3
                                },
                                {
                                    room: "room 4",
                                    id: 4
                                },
                                {
                                    room: "room 5",
                                    id: 5
                                }
                            ]}
                            onFocus={this.toggleScreen}
                        />
                    </div>
                    <div className="col-md-6 border border-0 bg-dark text-light">{display}</div>
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
