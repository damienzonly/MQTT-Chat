import React from "react";
import Display from "./Display";
import Navbar from "./static/Navbar";
import Sidebar from "./Sidebar";
import OnlineStatus from "./OnlineStatus";
import PropTypes from "prop-types";

Dashboard.propTypes = {
    account: PropTypes.string,
    rooms: PropTypes.object,
    openRoom: PropTypes.func,
    addRoom: PropTypes.func,
    addMessageToRoom: PropTypes.func,
    currentRoom: PropTypes.string,
    getCurrentRoom: PropTypes.func,
    onTextareaSubmit: PropTypes.func,
    changeDraft: PropTypes.func,
    sendDraft: PropTypes.func,
    currentMessage: PropTypes.string,
    displayHeight: PropTypes.number
};

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

                <div className="col-md-6 dark-foreground text-light">
                    <Display
                        addMessageToRoom={props.addMessageToRoom}
                        account={props.account}
                        currentRoom={props.currentRoom}
                        getCurrentRoom={props.getCurrentRoom}
                        changeDraft={props.changeDraft}
                        sendDraft={props.sendDraft}
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
