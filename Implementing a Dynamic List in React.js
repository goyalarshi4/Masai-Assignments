//Implementing a Dynamic List in React//
import React from 'react';

function App() {
  const items = ["React", "JavaScript", "CSS"];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>My Tech Stack</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index} style={{ fontSize: '20px', margin: '10px 0' }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
