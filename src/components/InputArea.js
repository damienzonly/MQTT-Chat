import React from "react";

export default function InputArea(props) {
    return (
        <div className="container mt-5">
            <div className="form-group">
                <textarea
                    id="message-field"
                    placeholder="Type a message..."
                    value={props.currentMessage}
                    className="form-control"
                    onChange={props.onTextareaChange}
                    onKeyDown={props.onTextareaKeyDown}
                />
            </div>
        </div>
    );
}