import React, { Component } from "react";
import Navbar from "./static/Navbar";
import { Redirect } from "react-router-dom";

export default class ChangeUsername extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draftUsername: "",
            redirect: false
        };
    }
    onDraftUsernameChange = e => {
        e.preventDefault();
        this.setState({ draftUsername: e.target.value });
    };

    componentDidMount = () => {
        document.getElementById("change-account-name").focus();
    };

    setRedirect = bool => {
        this.setState({ redirect: bool });
    };

    redirect = () => {
        if (this.state.redirect) return <Redirect to="/" />;
    };

    render() {
        return (
            <>
                {this.redirect()}
                <Navbar account={this.props.account} />
                <div className="row no-gutters mt-4 h-100 text-light">
                    <div className="col-md-4 p-4 offset-md-4 dark-foreground ">
                        <div className="h2 text-light mb-4">
                            Change your account name
                        </div>
                        <form
                            className="form-group"
                            onSubmit={e => {
                                e.preventDefault();
                                this.props.changeAccountName(
                                    this.state.draftUsername
                                );
                                this.setState({ draftUsername: "" });
                                this.setRedirect(true);
                            }}
                        >
                            <input
                                id="change-account-name"
                                type="text"
                                className="form-control mb-3"
                                placeholder="New account name"
                                value={this.state.draftUsername}
                                onChange={e =>
                                    this.setState({
                                        draftUsername: e.target.value
                                    })
                                }
                            />
                            <input
                                type="submit"
                                className="form-control btn btn-lg btn-outline-secondary text-light"
                                value="Confirm"
                            />
                        </form>
                    </div>
                </div>
            </>
        );
    }
}
