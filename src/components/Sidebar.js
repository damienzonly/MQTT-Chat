import React, { Component } from "react";

export default class Sidebar extends Component {
    render() {
        let roomsGroup = Object.keys(this.props.rooms).map((item, index) => (
            <button
                type="button"
                key={index}
                onClick={this.props.openRoom}
                className="list-group-item btn bg-dark text-white border border-0 rounded-0"
                value={item}
            > {item} </button>
        ));
        return (
            <>
                <div className="h2 mt-3 text-light text-center">Rooms</div>
                <hr className="bg-light m-0 p-0" />
                <div className="list-group mt-0">
                    {roomsGroup}
                    <button onClick={this.props.addRoom} type="button" className="btn bg-dark border border-0 text-light rounded-0">
                        <i className="fa fa-plus p-3" />
                    </button>
                </div>
            </>
        );
    }
}
