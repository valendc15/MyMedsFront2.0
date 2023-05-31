import React from 'react';

const FailurePage = () => {
  return (
    <div style={{ backgroundColor: 'red', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        width="200px"
        height="200px"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
      <p style={{ color: 'white', fontSize: '24px', marginLeft: '10px' }}>Recipe scan failed</p>
    </div>
  );
};

export default FailurePage;