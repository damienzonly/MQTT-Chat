import React from "react";
import PropTypes from "prop-types";

InputArea.propTypes = {
    onSendCurrentDraft: PropTypes.func,
    currentMessage: PropTypes.string
};

export default function InputArea(props) {
    function onCurrentDraftKeyDown(event) {
        if (event.keyCode === 13) {
            if (!event.shiftKey) {
                props.onSendCurrentDraft(event);
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
                    onChange={props.onChangeCurrentDraft}
                    onKeyDown={onCurrentDraftKeyDown}
                />
            </div>
        </div>
    );
}
