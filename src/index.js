import React from "react";
import ReactDOM from "react-dom";
import ChatApp from "./ChatApp";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<ChatApp />, document.getElementById("root"));

serviceWorker.unregister();
