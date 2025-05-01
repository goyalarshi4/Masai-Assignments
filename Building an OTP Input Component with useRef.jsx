//Building an OTP Input Component with useRef//
import React, { useRef } from "react";

const OTPInput = () => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length === 1 && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{ width: "2rem", textAlign: "center", marginRight: "0.5rem" }}
          />
        ))}
    </div>
  );
};

export default OTPInput;
