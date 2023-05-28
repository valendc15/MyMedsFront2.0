import React from 'react';

const SuccessPage = () => {
  return (
    <div className="success-page">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        width="200px"
        height="200px"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21.42 6.59 20 5.17z" />
      </svg>
      <p>Recipe scanned and dispensed successfully</p>
    </div>
  );
};

export default SuccessPage;
