import React from "react";

export default function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <h1 className="navbar-brand" href="#">
                MQTT Chat
            </h1>
            <div className="ml-auto text-light">{props.account.toUpperCase()}</div>
        </nav>
    );
}
