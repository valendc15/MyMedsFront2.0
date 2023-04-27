import React from "react";
import { useState } from "react";

function Popup2(props) {
  const [nose1, setNose1] = useState("");
  const [nose2, setNose2] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    // Add any form submission logic here
    props.setTrigger(false);
  }

  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nose1" className="form-label">
              Nose1
            </label>
            <input
              type="text"
              className="form-control"
              id="nose1"
              value={nose1}
              onChange={(e) => setNose1(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nose2" className="form-label">
              Nose2
            </label>
            <input
              type="text"
              className="form-control"
              id="nose2"
              value={nose2}
              onChange={(e) => setNose2(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        {props.children}
      </div>
    </div>
  ) : null;
}


export default Popup2;