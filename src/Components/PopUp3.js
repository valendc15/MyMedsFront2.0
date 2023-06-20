import React from "react";

function Popup3({ trigger, setTrigger, title, buttonText, onClick, onCancel }) {
  return trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <h4>{title}</h4>
        <button className="btn btn-success" onClick={onClick}>
          {buttonText}
        </button>
        <button className="btn btn-danger" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  ) : null;
}

export default Popup3;
