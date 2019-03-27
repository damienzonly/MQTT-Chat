import ChatWindow from "./ChatWindow";
import React from 'react'

export default function Display(props) {
    let items = props.messages.map(message => (
        <li className="list-group-item text-right border-0" key={message.index}>
            {message.message}
        </li>
    ));
    return (
        <>
            <div className="form-inline">
                <div className="form-group w-100">
                    <input type="text" value={props.subTarget} onChange={props.targetChange} onKeyDown={props.keyPress} placeholder="Sub to user" className="form-control w-100"/>
                </div>
            </div>
    
            <div key="display" className="">
                <ul className="list-group">{items}</ul>
                <ChatWindow pm={props.pushMessage} />
            </div>
        </>
    );
}
