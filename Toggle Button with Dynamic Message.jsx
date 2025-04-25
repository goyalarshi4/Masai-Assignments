//Toggle Button with Dynamic Message
//
import React, { useState } from 'react';

function ToggleButton() {
  const [isVisible, setIsVisible] = useState(false);

  function toggleMessage() {
    setIsVisible(!isVisible);
  }

  return (
    <div>
      <button onClick={toggleMessage}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>Hello, welcome to React state management!</p>}
    </div>
  );
}

export default ToggleButton;
