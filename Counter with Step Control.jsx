//Counter with Step Control//
import React, { useState } from 'react';

function CounterWithStepControl() {
  const [counter, setCounter] = useState(0);
  const [step, setStep] = useState(1);

  const handleIncrease = () => {
    setCounter(prevCounter => prevCounter + step);
  };

  const handleDecrease = () => {
    setCounter(prevCounter => (prevCounter - step >= 0 ? prevCounter - step : 0));
  };

  const handleStepChange = (event) => {
    setStep(Number(event.target.value));
  };

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <input
        type="number"
        value={step}
        onChange={handleStepChange}
        min="1"
      />
      <button onClick={handleIncrease}>Increase</button>
      <button onClick={handleDecrease}>Decrease</button>
    </div>
  );
}

export default CounterWithStepControl;
