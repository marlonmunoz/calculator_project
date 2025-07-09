import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const [result, setResult] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [operation, setOperation] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Add calculation to history
  const addToHistory = (expression, calculationResult) => {
    const calculation = {
      id: Date.now(),
      expression,
      result: calculationResult,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [calculation, ...prev].slice(0, 10)); // Keep last 10 calculations
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Handle number keys
      if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
        return;
      }
      
      switch(e.key) {
        case '+':
          e.preventDefault();
          setOperator('+');
          break;
        case '-':
          e.preventDefault();
          setOperator('-');
          break;
        case '*':
          e.preventDefault();
          setOperator('×');
          break;
        case '/':
          e.preventDefault();
          setOperator('÷');
          break;
        case '=':
        case 'Enter':
          e.preventDefault();
          calculate();
          break;
        case '.':
          e.preventDefault();
          appendDecimal();
          break;
        case 'Backspace':
          e.preventDefault();
          backspace();
          break;
        case 'Escape':
          e.preventDefault();
          resetAll();
          break;
        case 'Delete':
          e.preventDefault();
          clearInput();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Calculator functions
  function appendNumber(num) {
    if (waitingForOperand) {
      setCurrentInput(num);
      setWaitingForOperand(false);
    } else {
      setCurrentInput(currentInput === '0' ? num : currentInput + num);
    }
    inputRef.current.value = currentInput === '0' ? num : currentInput + num;
  }

  function appendDecimal() {
    if (waitingForOperand) {
      setCurrentInput('0.');
      setWaitingForOperand(false);
    } else if (currentInput.indexOf('.') === -1) {
      setCurrentInput(currentInput + '.');
    }
    inputRef.current.value = currentInput.indexOf('.') === -1 ? currentInput + '.' : currentInput;
  }

  function backspace() {
    if (currentInput.length > 1) {
      const newInput = currentInput.slice(0, -1);
      setCurrentInput(newInput);
      inputRef.current.value = newInput;
    } else {
      setCurrentInput('0');
      inputRef.current.value = '0';
    }
  }

  function clearInput() {
    setCurrentInput('0');
    inputRef.current.value = '0';
  }

  function resetAll() {
    setResult(0);
    setCurrentInput('0');
    setOperation('');
    setWaitingForOperand(false);
    inputRef.current.value = '0';
  }

  function setOperator(nextOperation) {
    const inputValue = parseFloat(currentInput);

    if (result === 0) {
      setResult(inputValue);
    } else if (operation) {
      const currentResult = result || 0;
      const calculationResult = performCalculation(currentResult, inputValue, operation);
      
      setResult(calculationResult);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }

  function calculate() {
    const inputValue = parseFloat(currentInput);
    
    if (result !== 0 && operation) {
      const calculationResult = performCalculation(result, inputValue, operation);
      const expression = `${result} ${operation} ${inputValue}`;
      
      addToHistory(expression, calculationResult);
      setResult(calculationResult);
      setOperation('');
      setCurrentInput(calculationResult.toString());
      setWaitingForOperand(true);
      inputRef.current.value = calculationResult.toString();
    }
  }

  function performCalculation(firstOperand, secondOperand, operation) {
    switch (operation) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        if (secondOperand === 0) {
          alert("Cannot divide by 0");
          return firstOperand;
        }
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }

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
              <span className="keyboard-hint">Use keyboard: 0-9, +, -, *, /, ., Enter, Esc, Backspace</span>
            </div>
          </div>
          
          <form>
            <div className="display">
              <div className="operation-display">
                {result !== 0 && operation ? `${result} ${operation}` : ''}
              </div>
              <p ref={resultRef} className="result">
                {currentInput || '0'}
              </p>
            </div>
            
            <input 
              id="calculator-input"
              name="calculator-input"
              ref={inputRef}
              type="text"
              value={currentInput || '0'}
              className="input-field"
              readOnly
              autoComplete="off"
            />
            
            <div className="calculator-grid">
              {/* Number pad */}
              <div className="number-grid">
                <button type="button" onClick={() => appendNumber('7')} className="number">7</button>
                <button type="button" onClick={() => appendNumber('8')} className="number">8</button>
                <button type="button" onClick={() => appendNumber('9')} className="number">9</button>
                
                <button type="button" onClick={() => appendNumber('4')} className="number">4</button>
                <button type="button" onClick={() => appendNumber('5')} className="number">5</button>
                <button type="button" onClick={() => appendNumber('6')} className="number">6</button>
                
                <button type="button" onClick={() => appendNumber('1')} className="number">1</button>
                <button type="button" onClick={() => appendNumber('2')} className="number">2</button>
                <button type="button" onClick={() => appendNumber('3')} className="number">3</button>
                
                <button type="button" onClick={() => appendNumber('0')} className="number zero">0</button>
                <button type="button" onClick={appendDecimal} className="number">.</button>
                <button type="button" onClick={backspace} className="action">⌫</button>
              </div>
              
              {/* Operations */}
              <div className="operations-grid">
                <button type="button" onClick={() => setOperator('÷')} className="operator">÷</button>
                <button type="button" onClick={() => setOperator('×')} className="operator">×</button>
                <button type="button" onClick={() => setOperator('-')} className="operator">-</button>
                <button type="button" onClick={() => setOperator('+')} className="operator">+</button>
                <button type="button" onClick={calculate} className="operator equals">=</button>
                <button type="button" onClick={clearInput} className="action">C</button>
                <button type="button" onClick={resetAll} className="action reset">AC</button>
              </div>
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
                      {calc.expression} = {calc.result}
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
