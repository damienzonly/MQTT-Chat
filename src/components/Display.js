import InputArea from "./InputArea";
import React from "react";

export default function Display(props) {
    let displayHeight = 600;
    if (props.currentRoom) {
        let room = props.getCurrentRoom();
        let messages = room.messages.map((item, index) => {
            let leftRight = item.sender === props.account ? "ml-auto" : "mr-auto";
            let sender = item.sender === props.account ? "" : item.sender + ": ";
            let time = `${item.time.getHours().pad()}:${item.time.getMinutes().pad()}`;
            return (
                <div
                    key={index}
                    className={leftRight}
                    style={{
                        minWidth: 150
                    }}
                >
                    <li className={"list-group-item mt-2 border border-circle bg-dark text-light"}>
                        <span className="mb-2" style={{ color: "red" }}>
                            {sender}
                        </span>
                        {item.text}
                        <span className="mt-3 d-block" style={{ fontSize: 12 }}>
                            <i className="fa fa-check" /> {time}
                        </span>
                    </li>
                </div>
            );
        });
        return (
            <div className="container">
                <div className="container mt-3 mb-3">Room: {props.currentRoom.capFirst()}</div>
                <div
                    id="messages-list"
                    className="list-group overflow-auto"
                    style={{
                        height: displayHeight,
                        maxHeight: displayHeight,
                        overflowY: "scroll"
                    }}
                >
                    {messages}
                </div>
                <InputArea
                    onTextareaChange={props.onTextareaChange}
                    onTextareaKeyDown={props.onTextareaKeyDown}
                    currentMessage={props.currentMessage}
                />
            </div>
        );
    }
    return <div className="mt-4 text-center">Select one room using the left sidebar</div>;
}
