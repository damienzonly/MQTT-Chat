import InputArea from "./InputArea";
import React from "react";

export default function Display(props) {
    return (
        <>
            <div className="text-center">{props.screen}</div>
        </>
    );
}
