import React from "react";
import PropTypes from "prop-types";

InputArea.propTypes = {
    sendDraft: PropTypes.func,
    currentMessage: PropTypes.string
};

export default function InputArea(props) {
    function onCurrentDraftKeyDown(event) {
        if (event.keyCode === 13) {
            if (!event.shiftKey) {
                props.sendDraft(event);
            }
        }
    }
    return (
        <div className="container mt-5">
            <div className="form-group">
                <textarea
                    id="message-field"
                    placeholder="Type a message..."
                    value={props.currentMessage}
                    className="form-control"
                    onChange={event => {
                        event.preventDefault();
                        props.changeDraft(event.target.value)
                    }}
                    onKeyDown={onCurrentDraftKeyDown}
                />
            </div>
        </div>
    );
}
