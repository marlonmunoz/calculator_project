import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Add calculation to history
  const addToHistory = (operation, inputValue, previousResult, newResult) => {
    const calculation = {
      id: Date.now(),
      operation,
      inputValue,
      previousResult,
      result: newResult,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [calculation, ...prev].slice(0, 10)); // Keep last 10 calculations
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      const inputValue = Number(inputRef.current?.value || 0);
      
      switch(e.key) {
        case '+':
        case '=':
          e.preventDefault();
          plus(e);
          break;
        case '-':
          e.preventDefault();
          minus(e);
          break;
        case '*':
          e.preventDefault();
          times(e);
          break;
        case '/':
          e.preventDefault();
          divide(e);
          break;
        case 'Escape':
          e.preventDefault();
          resetResult(e);
          break;
        case 'Delete':
          e.preventDefault();
          resetInput(e);
          break;
        case 'Enter':
          e.preventDefault();
          plus(e);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  function plus(e) {
    e.preventDefault();
    const inputValue = Number(inputRef.current.value);
    if (isNaN(inputValue)) return;
    
    const newResult = result + inputValue;
    addToHistory('+', inputValue, result, newResult);
    setResult(newResult);
    inputRef.current.value = "";
  };
  
  function minus(e) {
    e.preventDefault();
    const inputValue = Number(inputRef.current.value);
    if (isNaN(inputValue)) return;
    
    const newResult = result - inputValue;
    addToHistory('-', inputValue, result, newResult);
    setResult(newResult);
    inputRef.current.value = "";
  };
  
  function times(e) {
    e.preventDefault();
    const inputValue = Number(inputRef.current.value);
    if (isNaN(inputValue)) return;
    
    const newResult = result * inputValue;
    addToHistory('×', inputValue, result, newResult);
    setResult(newResult);
    inputRef.current.value = "";
  };

  function divide(e) {
    e.preventDefault();
    const inputValue = Number(inputRef.current.value);
    if (isNaN(inputValue)) return;
    
    if(inputValue === 0) {
      alert("Cannot divide by 0");
      return;
    }
    
    const newResult = result / inputValue;
    addToHistory('÷', inputValue, result, newResult);
    setResult(newResult);
    inputRef.current.value = "";
  };

  function resetInput(e) {
    e.preventDefault();
    inputRef.current.value = "";
  };

  function resetResult(e) {
    e.preventDefault();
    setResult(0);
    setHistory([]);
  };

  function clearHistory() {
    setHistory([]);
  };

  function toggleHistory() {
    setShowHistory(!showHistory);
  };

  return (
    <div className='App'>
      <div className="calculator-container">
        <div className="calculator">
          <div className="header">
            <h1>Enhanced Calculator</h1>
            <div className="header-buttons">
              <button className="history-toggle" onClick={toggleHistory}>
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
              <span className="keyboard-hint">Use keyboard: +, -, *, /, Enter, Esc</span>
            </div>
          </div>
          
          <form>
            <div className="display">
              <p ref={resultRef} className="result">
                {result}
              </p>
            </div>
            
            <input 
              pattern='[0-9]'
              ref={inputRef}
              type="number"
              placeholder='Type a number'
              className="input-field"
              autoFocus
            />
            
            <div className="button-grid">
              <button onClick={plus} className="operator">Add (+)</button>
              <button onClick={minus} className="operator">Subtract (-)</button>
              <button onClick={times} className="operator">Multiply (×)</button>
              <button onClick={divide} className="operator">Divide (÷)</button>
              <button onClick={resetInput} className="action">Clear Input</button>
              <button onClick={resetResult} className="action reset">Reset All</button>
            </div>
          </form>
        </div>
        
        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h3>Calculation History</h3>
              <button onClick={clearHistory} className="clear-history">Clear</button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">No calculations yet</p>
              ) : (
                history.map((calc) => (
                  <div key={calc.id} className="history-item">
                    <div className="calculation">
                      {calc.previousResult} {calc.operation} {calc.inputValue} = {calc.result}
                    </div>
                    <div className="timestamp">{calc.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
