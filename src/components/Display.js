import React, { Component } from "react";
import ChatWindow from "./ChatWindow";

export default class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            subTarget: "",
            msgIndex: 0
        };
    }
    subOnChange = e => {
        this.setState({ subTarget: e.target.value });
    }
    sub = event => {
        event.preventDefault();
        console.log("Subbed to:", this.state.subTarget);
    }
    keyPress = event => {
        console.log(event.key, event.keyCode)
        if (event.keyCode === 13) {
            this.sub(event);
        }
    }
    pushMessage = message => {
        if (message === "") return;
        let messagesCopy = [...this.state.messages];
        if (this.state.messages.length === 0) {
            this.setState(state => {
                return {
                    msgIndex: state.msgIndex + 1,
                    messages: [{ index: state.msgIndex + 1, message }]
                };
            });
            return;
        } else if (this.state.messages.length === 10) {
            messagesCopy = messagesCopy.splice(1);
        }
        this.setState(state => {
            return {
                msgIndex: state.msgIndex + 1,
                messages: [
                    ...messagesCopy,
                    {
                        index: state.msgIndex +1,
                        message
                    }
                ]
            };
        });
    }
    render() {
        let items = this.state.messages.map(message => <li className="list-group-item text-right border-0" key={message.index}>{message.message}</li>);
        return (
            <>
                <div className="form-inline">
                    <div className="form-group w-100">
                        <input type="text" onChange={this.subOnChange} onKeyDown={this.keyPress} placeholder="Sub to user" className="form-control w-100" value={this.state.subTarget} />
                    </div>
                </div>
                
                <div key="display" className="">
                    <ul className="list-group">{items}</ul>
                    <ChatWindow pm={this.pushMessage} />
                </div>
            </>
        );
    }
}
