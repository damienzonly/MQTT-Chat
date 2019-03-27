import ChatWindow from "./ChatWindow";
import React from "react";

export default function Display(props) {
    let items = props.messages.map(message => {
        let cls = "list-group-item border-0 " + message.side;
        return (
            <li className={cls} key={message.index}>
                {message.message}
            </li>
        );
    });
    return (
        <>
            <small>Enter channels and press Enter</small>
            <div className="form-inline">
                <div className="form-group w-100">
                    <input
                        type="text"
                        value={props.subSelf}
                        onChange={props.subSelfChange}
                        onKeyDown={props.subSelfKeyPress}
                        placeholder="Self channel"
                        className="form-control w-100"
                    />
                </div>
            </div>
            <div className="form-inline">
                <div className="form-group w-100 mt-2 mb-2">
                    <input
                        type="text"
                        value={props.subTarget}
                        onChange={props.subTargetChange}
                        onKeyDown={props.subTargetKeyPress}
                        placeholder="Target channel"
                        className="form-control w-100"
                    />
                </div>
            </div>
            <div key="display" className="">
                <ul className="list-group">{items}</ul>
                <ChatWindow pm={props.pushMessage} />
            </div>
        </>
    );
}
