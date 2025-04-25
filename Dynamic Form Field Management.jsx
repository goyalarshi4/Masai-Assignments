//Dynamic Form Field Management

//
import React, { useState } from "react";

function DynamicEmailForm() {
  const [emails, setEmails] = useState([{ value: "", error: "" }]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (index, newValue) => {
    const updatedEmails = [...emails];
    updatedEmails[index].value = newValue;
    updatedEmails[index].error = emailRegex.test(newValue)
      ? ""
      : "Invalid email format";
    setEmails(updatedEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, { value: "", error: "" }]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Dynamic Email Form</h2>
      <form>
        {emails.map((email, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="email"
              placeholder={`Email ${index + 1}`}
              value={email.value}
              onChange={(e) => handleChange(index, e.target.value)}
              style={{ padding: "5px", width: "250px" }}
            />
            {email.error && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {email.error}
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={addEmailField}>
          Add Email
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h4>Entered Emails:</h4>
        <ul>
          {emails.map((email, index) => (
            <li key={index}>
              {email.value || <span style={{ color: "gray" }}>(empty)</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DynamicEmailForm;
