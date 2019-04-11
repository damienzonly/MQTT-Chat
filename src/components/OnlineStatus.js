import React, { Component } from "react";

export default class OnlineStatus extends Component {
    render() {
        let onlinePeople = Object.keys(this.props.currentRoom.members).map(
            (member, index) => {
                member = this.props.currentRoom.members[member];
                if (member.account !== this.props.account) {
                    let cls = member.online ? "text-success" : "text-danger";
                    return (
                        <li
                            key={index}
                            className="list-group-item border-0 bg-dark text-light"
                        >
                            <i className={"fa fa-circle " + cls} />{" "}
                            {member.account}
                        </li>
                    );
                } else return <div key={index} />;
            }
        );
        return (
            <>
                <div className="p-1 h3 text-center">Online status</div>
                <div
                    className="list-group overflow-auto"
                    style={{
                        minHeight: this.props.displayHeight + 150,
                        maxHeight: this.props.displayHeight + 150
                    }}
                >
                    {onlinePeople}
                </div>
            </>
        );
    }
}
