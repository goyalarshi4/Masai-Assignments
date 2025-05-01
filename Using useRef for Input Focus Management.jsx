//Using useRef for Input Focus Management//
import React, { useRef } from "react";

const InputFocusComponent = () => {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus(); // Focus the input when button is clicked
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type something..." />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
};

export default InputFocusComponent;
