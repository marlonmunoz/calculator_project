import { useState, useRef } from 'react'
import './App.css'

function App() {
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const [result, setResult] = useState(0);

  function plus(e) {
    e.preventDefault();
    setResult((result) => + Number(inputRef.current.value))
  };

  function minus(e) {
  };

  function times(e) {
  };

  function divide(e) {
  };

  function resetInput(e) {
  };

  function resetResult(e) {
  };

  return (
    <div className='App'>
      <div>
        <h1>Simplest Working Calculator</h1>
      </div>
    </div>
  )
}

export default App
