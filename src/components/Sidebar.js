import React, { Component } from "react";

export default class Sidebar extends Component {
    render() {
        let roomsGroup = this.props.rooms.map(item => (
            <input
                type="button"
                key={item.id}
                onClick={this.props.onFocus}
                className="list-group-item border border-0 bg-dark text-light"
                value={item.room}
            />
        ));
        roomsGroup.push(
            <>
                <button type="button" className="bg-dark border border-0 text-light"> <i className="fa fa-plus"></i></button>
            </>
        );
        return (
            <>
                <ul className="list-group">{roomsGroup}</ul>
            </>
        );
    }
}
