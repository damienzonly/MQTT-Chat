import React, { Component } from "react";

export default class Sidebar extends Component {
    render() {
        let roomsGroup = Object.keys(this.props.rooms).map((item, index) => (
            <input
                type="button"
                key={index}
                onClick={this.props.toggleRoom}
                className="list-group-item border border-0 bg-dark text-light"
                value={item}
            />
        ));
        return (
            <div className="list-group">
                {roomsGroup}
                <button onClick={this.props.addRoom} type="button" className="bg-dark border border-0 text-light">
                    <i className="fa fa-plus p-3" />
                </button>
            </div>
        );
    }
}
