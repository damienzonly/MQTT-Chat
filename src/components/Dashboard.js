import React from "react";
import Display from "./Display";
import Navbar from "./static/Navbar";
import Sidebar from "./Sidebar";
import OnlineStatus from "./OnlineStatus";

export default function Dashboard(props) {
    return (
        <>
            <div className="row no-gutters">
                <div className="col-md-12 mb-4 ">
                    <Navbar account={props.account} />
                </div>
            </div>

            <div className="row no-gutters">
                <div className="col-md-2 bg-dark text-light">
                    <Sidebar rooms={props.rooms} toggleRoom={props.toggleRoom} addRoom={props.addRoom} />
                </div>

                <div className="col-md-6 border border-top-0 border-bottom-0 bg-dark text-light">
                    <Display addMessageToRoom={props.addMessageToRoom} account={props.account} currentRoom={props.currentRoom} />
                </div>

                <div className="col-md-4 bg-dark text-light">
                    <OnlineStatus />
                </div>
            </div>
        </>
    );
}
