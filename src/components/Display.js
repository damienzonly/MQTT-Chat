import InputArea from "./InputArea";
import React from "react";

export default function Display(props) {
    if (props.currentRoom) {
        let room = props.getCurrentRoom();
        let messages = room.messages.map((item, index) => {
            let leftRight = item.sender === props.account ? "text-right" : "";
            let time = `${item.time.getHours().pad()}:${item.time.getMinutes().pad()}`;
            return (
                <li key={index} className={"list-group-item border-0 bg-dark text-light " + leftRight}>
                    <span style={{ color: "red" }}> {item.sender}</span>: {item.text}
                    <span className="d-block" style={{ fontSize: 12 }}>
                        {time}
                    </span>
                </li>
            );
        });
        return (
            <div className="container">
                <div className="container mt-3 mb-3">Room: {props.currentRoom.capFirst()}</div>
                <div className="container h-100">
                    <div
                        id="messages-list"
                        className="container list-group overflow-auto"
                        style={{
                            height: 400,
                            maxHeight: 400,
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
            </div>
        );
    }
    return <div className="mt-4 text-center">Select one room using the left sidebar</div>;
}
