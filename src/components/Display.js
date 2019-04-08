import InputArea from "./InputArea";
import React from "react";

export default function Display(props) {
    if (props.currentRoom) {
        let messages = props.currentRoom.messages.map((item, index) => {
            let leftRight = item.sender === props.account ? "text-right" : "";
            return (
                <li key={index} className={"list-group-item border-0 bg-dark text-light " + leftRight}>
                    <span style={{ color: "red" }}> {item.sender}</span>: {item.text}
                    <span
                        style={{
                            fontSize: 12,
                            display: "block"
                        }}
                    >
                        {item.time.getHours()}:{item.time.getMinutes()}{" "}
                    </span>
                </li>
            );
        });
        return (
            <div className="container">
                <div className="container mt-3">Room: {props.currentRoom.room.capFirst()}</div>
                <div
                    className="container"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0
                    }}
                >
                    <div className="container border-0 list-group">{messages}</div>
                    <InputArea addMessageToRoom={props.addMessageToRoom} account={props.account} />
                </div>
            </div>
        );
    }
    return <div className="mt-4 text-center">Select one room using the left sidebar</div>;
}
