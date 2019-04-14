import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg dark-foreground text-light">
            <Link className="navbar-brand text-light" to="/">
                Home
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>

            <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
            >
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="account-name">
                            <button className="btn btn-outline-secondary text-light">
                                Change username
                            </button>
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">{props.account.toUpperCase()}</li>
                </ul>
            </div>
        </nav>
    );
}
