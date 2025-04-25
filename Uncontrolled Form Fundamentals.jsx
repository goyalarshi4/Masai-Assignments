//Uncontrolled Form Fundamentals//
import React, { useRef } from "react";

function UncontrolledForm() {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredText = inputRef.current.value;

    if (enteredText.trim() !== "") {
      alert(`Submitted Text: ${enteredText}`);
      inputRef.current.value = ""; // Clear input after submission
    } else {
      alert("Please enter something before submitting.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Uncontrolled Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Text:
          <input
            type="text"
            ref={inputRef}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default UncontrolledForm;
