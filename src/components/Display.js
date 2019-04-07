import InputArea from "./InputArea";
import React from "react";

export default function Display(props) {
    if (props.currentRoom) {
        return (
            <div className="container">
                <div className="container">{props.currentRoom.capFirst()}</div>
                <InputArea />
            </div>
        );
    }
    return <div className="mt-4 text-center">Select one room using the left sidebar</div>;
}
