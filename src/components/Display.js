import React, { Component } from "react";
import ChatWindow from "./ChatWindow";

export default class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            subTarget: ""
        };
        this.sub = this.sub.bind(this);
        this.subOnChange = this.subOnChange.bind(this);
        this.pushMessage = this.pushMessage.bind(this);
    }
    subOnChange(e) {
        this.setState({ subTarget: e.target.value });
    }
    sub(event) {
        event.preventDefault();
        console.log("Subbed to:", this.state.subTarget);
    }
    pushMessage(message) {
        if (message === "") return;
        let index = 0;
        let messagesCopy = [...this.state.messages];
        if (this.state.messages.length === 0) {
            this.setState({ messages: [{ index: 0, message }] });
            return;
        } else if (this.state.messages.length === 10) {
            index = this.state.messages[9].index + 1;
            messagesCopy = messagesCopy.splice(1);
        } else {
            index = [...messagesCopy].sort((a, b) => a.index - b.index)[this.state.messages.length - 1].index + 1;
            console.log("inside index:", index);
        }
        this.setState({
            messages: [
                ...messagesCopy,
                {
                    index,
                    message
                }
            ]
        });
        // this.setState({
        //     messages: [
        //         ...this.state.messages.slice(1),
        //         {
        //             index,
        //             message
        //         }
        //     ]
        // });
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
