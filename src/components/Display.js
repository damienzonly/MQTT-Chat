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
        let items = this.state.messages.map(message => <li key={message.index}>{message.message}</li>);
        return (
            <>
                <form className="form-inline">
                    <div className="form-group">
                        <input type="text" onChange={this.subOnChange} placeholder="Sub to user" className="form-control" />
                        <button onClick={this.sub} type="submit" className="btn btn-outline-primary ml-2">
                            Submit
                        </button>
                    </div>
                </form>
                
                <div key="display" className="">
                    <ul>{items}</ul>
                    <ChatWindow pm={this.pushMessage} />
                </div>
            </>
        );
    }
}
