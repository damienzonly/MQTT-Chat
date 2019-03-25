import React, { Component } from "react";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
class App extends Component {
    render() {
        return (
            <div className="row no-gutters">
                <div className="col-md-4 offset-md-4">
                    <Navbar />
                    <Dashboard />
                </div>
            </div>
        )
    }
}

export default App;
