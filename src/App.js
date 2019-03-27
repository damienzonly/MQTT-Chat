import React, { Component } from "react";
import Display from "./components/Display";
import Navbar from "./components/static/Navbar";

let mqtt = require("mqtt");

class App extends Component {
    constructor(props) {
        super(props);
        this.client = mqtt.connect("ws://localhost", {
            port: 8888,
            clientId: "mqtt-chat-user-" + Math.floor(Math.random() * 1000)
        });
        this.client
            .on("connect", () => {
                console.debug("Client mqtt connected");
            })
            .on("error", err => {
                if (err) console.error(err);
            })
            .on("message", (topic, message) => {
                this.pushMessage(message.toString(), "text-left");
            });
        this.state = {
            messages: [],
            subTarget: "",
            subSelf: "",
            msgIndex: 0
        };
    }
    subTargetChange = event => {
        this.setState({ subTarget: event.target.value });
    };
    subSelfChange = event => {
        this.setState({ subSelf: event.target.value });
    };
    subTargetKeyPress = event => {
        if (event.target.value === "") return;
        if (event.keyCode === 13) {
            this.subTargetChange(event);
        }
    };
    subSelfKeyPress = event => {
        if (event.target.value === "") return;
        if (event.keyCode === 13) {
            this.subSelfChange(event);
            this.setState(state => {
                this.client.subscribe(state.subSelf);
            });
        }
    };
    pushMessage = (message, side) => {
        if (message === "") return;
        this.setState(state => {
            this.client.publish(state.subTarget, message);
            let newMessage = {
                index: state.msgIndex + 1,
                message,
                side: side || "text-right"
            };
            if (state.messages.length === 10) {
                return {
                    msgIndex: state.msgIndex + 1,
                    messages: [...state.messages.slice(1), newMessage]
                };
            } else {
                return {
                    msgIndex: state.msgIndex + 1,
                    messages: [...state.messages, newMessage]
                };
            }
        });
    };
    render() {
        return (
            <div className="row no-gutters">
                <div className="col-md-4 offset-md-4">
                    <Navbar />
                    <Display
                        messages={this.state.messages}
                        subTarget={this.state.subTarget}
                        subSelf={this.state.subSelf}
                        pushMessage={this.pushMessage}
                        subTargetChange={this.subTargetChange}
                        subSelfChange={this.subSelfChange}
                        subSelfKeyPress={this.subSelfKeyPress}
                        subTargetKeyPress={this.subTargetKeyPress}
                    />
                </div>
            </div>
        );
    }
}

export default App;
