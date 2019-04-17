import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Sidebar extends Component {
    render() {
        let roomsGroup = Object.keys(this.props.rooms).map((item, index) => (
            <button
                type="button"
                key={index}
                onClick={event => {
                    this.props.openRoom(event.target.value);
                }}
                className="list-group-item btn dark-foreground text-white border border-0 rounded-0"
                value={item}
            >
                {" "}
                {item}{" "}
            </button>
        ));
        return (
            <>
                <div className="h2 mt-3 text-light text-center">Rooms</div>
                <div className="list-group mt-0">
                    {roomsGroup}
                    <button
                        onClick={e => {
                            e.preventDefault();
                            let newRoom = prompt("Enter the new room name");
                            this.props.addRoom(newRoom);
                        }}
                        type="button"
                        className="btn dark-foreground text-light rounded-0"
                    >
                        <i className="fa fa-plus p-3" />
                    </button>
                </div>
            </>
        );
    }
}

Sidebar.propTypes = {
    rooms: PropTypes.object,
    openRoom: PropTypes.func,
    addRoom: PropTypes.func
};
