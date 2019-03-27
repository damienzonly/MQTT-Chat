import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
export default class Display extends Component {
    render() {
        let items = this.props.messages.map(message => (
            <li className="list-group-item text-right border-0" key={message.index}>
                {message.message}
            </li>
        ));
        return (
            <>
                <div className="form-inline">
                    <div className="form-group w-100">
                        <input type="text" value={this.props.subTarget} onChange={this.props.targetChange} onKeyDown={this.props.keyPress} placeholder="Sub to user" className="form-control w-100"/>
                    </div>
                </div>

                <div key="display" className="">
                    <ul className="list-group">{items}</ul>
                    <ChatWindow pm={this.props.pushMessage} />
                </div>
            </>
        );
    }
}
