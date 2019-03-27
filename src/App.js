import React, { Component } from "react";
import Display from "./components/Display";
import Navbar from "./components/static/Navbar";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            subTarget: "",
            msgIndex: 0
        };
    }
    targetChange = event => {
        this.setState({ subTarget: event.target.value });
    };
    sub = event => {
        event.preventDefault();
        console.log("Subbed to:", this.state.subTarget);
        this.setState({ subTarget: "" });
    };
    keyPress = event => {
        if (event.target.value === "") return;
        if (event.keyCode === 13) {
            this.sub(event);
        }
    };
    pushMessage = message => {
        if (message === "") return;
        this.setState(state => {
            let newMessage = {
                index: state.msgIndex + 1,
                message
            }
            if (state.messages.length === 10) {
                return {
                    msgIndex: state.msgIndex + 1,
                    messages: [
                        ...state.messages.slice(1),
                        newMessage
                    ]
                }
            } else {
                return {
                    msgIndex: state.msgIndex + 1,
                    messages: [
                        ...state.messages,
                        newMessage
                    ]
                }
            }
        })
    };
    render() {
        return (
            <div className="row no-gutters">
                <div className="col-md-4 offset-md-4">
                    <Navbar />
                    <Display messages={this.state.messages} subTarget={this.state.subTarget} pushMessage={this.pushMessage} targetChange={this.targetChange} keyPress={this.keyPress} />
                </div>
            </div>
        )
    }
}

export default App;
