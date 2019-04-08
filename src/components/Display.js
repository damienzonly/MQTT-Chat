import InputArea from "./InputArea";
import React from "react";

export default function Display(props) {
    if (props.currentRoom) {
        return (
            <div className="container">
                <div className="container mt-3">Room: {props.currentRoom.capFirst()}</div>
                <div
                    className="container"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0
                    }}
                >
                    <InputArea />
                </div>
            </div>
        );
    }
    return <div className="mt-4 text-center">Select one room using the left sidebar</div>;
}
