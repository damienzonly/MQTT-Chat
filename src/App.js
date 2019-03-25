import React, { Component } from "react";
import Display from "./components/Display";
import Navbar from "./components/static/Navbar";
class App extends Component {
    render() {
        return (
            <div className="row no-gutters">
                <div className="col-md-4 offset-md-4">
                    <Navbar />
                    <Display />
                </div>
            </div>
        )
    }
}

export default App;
