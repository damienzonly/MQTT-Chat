import InputArea from "./InputArea";
import React from "react";

export default function Display(props) {
    if (props.currentRoom) {
        return <div className="text-center">{props.currentRoom}</div>
    }
    return <div className="mt-4 text-center">Select one room using the left sidebar</div>
}
