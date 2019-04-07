import React, { Component } from "react";

export default class InputArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        };
    }
    submit = event => {
        event.preventDefault();
        this.props.pm(this.state.message);
        this.setState({ message: "" });
    };
    change = event => {
        this.setState({ message: event.target.value });
    };
    onKeyDown = event => {
        if (event.keyCode === 13) {
            this.submit(event);
        }
    };
    render() {
        return (
            <>
                <div />
            </>
        );
    }
}
