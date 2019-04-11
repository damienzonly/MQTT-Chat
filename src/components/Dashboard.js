import React from "react";
import Display from "./Display";
import Navbar from "./static/Navbar";
import Sidebar from "./Sidebar";
import OnlineStatus from "./OnlineStatus";

export default function Dashboard(props) {
    return (
        <>
            <div className="row no-gutters">
                <div className="col-md-12 mb-4">
                    <Navbar account={props.account} />
                </div>
            </div>

            <div className="row no-gutters">
                <div className="col-md-2 dark-foreground text-light">
                    <Sidebar
                        rooms={props.rooms}
                        openRoom={props.openRoom}
                        addRoom={props.addRoom}
                    />
                </div>

                <div className="col-md-6 border dark-foreground border-top-0 border-bottom-0 text-light">
                    <Display
                        addMessageToRoom={props.addMessageToRoom}
                        account={props.account}
                        currentRoom={props.currentRoom}
                        getCurrentRoom={props.getCurrentRoom}
                        onTextareaSubmit={props.onTextareaSubmit}
                        onChangeCurrentDraft={props.onChangeCurrentDraft}
                        onSendCurrentDraft={props.onSendCurrentDraft}
                        onTextareaKeyDown={props.onTextareaKeyDown}
                        currentMessage={props.currentMessage}
                        displayHeight={props.displayHeight}
                    />
                </div>

                <div className="col-md-4 dark-foreground text-light">
                    <OnlineStatus
                        displayHeight={props.displayHeight}
                        account={props.account}
                        currentRoom={props.getCurrentRoom()}
                    />
                </div>
            </div>
        </>
    );
}
