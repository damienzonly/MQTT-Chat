import React, { Component } from "react";

export default class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
        this.submit = this.submit.bind(this)
    }
    submit(event) {
        event.preventDefault();
        this.props.pm(this.state.message);
    }
    change(event) {
        this.setState({message: event.target.value})
    }
    render() {
        return (
            <form onSubmit={this.submit} className="form-group">
                <textarea
                    className="form-control mt-5"
                    onChange={event => {
                        this.setState({ message: event.target.value });
                    }}
                />
                <input type="submit" className="btn btn-outline-primary mt-3" value="Send"/>
            </form>
        );
    }
}
