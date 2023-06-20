import React from "react";

function Popup2({ trigger, setTrigger, children }) {
  return trigger ? (
    <div className="popup2">
      <div className="popup2-inner">
        {children}
        <button className="btn btn-close" onClick={() => setTrigger(false)}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}

export default Popup2;
