import React, { Component } from "react";

export default class InputArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        };
    }
    onSubmit = event => {
        event.preventDefault();
        this.props.addMessageToRoom({
            sender: this.props.account,
            text: this.state.message
        });
        this.setState({ message: "" });
    };
    onChange = event => {
        this.setState({ message: event.target.value });
    };
    onKeyDown = event => {
        if (event.keyCode === 13) {
            if (!event.shiftKey) {
                this.onSubmit(event);
            }
        }
    };
    render() {
        return (
            <div className="container">
                <div className="form-group">
                    <textarea
                        placeholder="Type a message..."
                        value={this.state.message}
                        className="form-control"
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                    />
                </div>
            </div>
        );
    }
}
