// Main Calculator Component - Optimized for Performance
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { calculateWithVerification, formatResult, validateExpression } from '../utils/calculatorEngine';
import { CalculationHistory, CalculatorSettings, CalculatorTab } from '../types/calculator';
import Keypad from './Keypad';
import Display from './Display';
import HistoryPanel from './HistoryPanel';
import SettingsPanel from './SettingsPanel';
import MatrixPanel from './MatrixPanel';
import SolverPanel from './SolverPanel';
import { cn } from '../utils/cn';

interface CalculatorProps {
  settings: CalculatorSettings;
  onUpdateSettings: (settings: CalculatorSettings) => void;
}

// Memoized tab button for performance
const TabButton = memo(({ tab, activeTab, onClick }: { tab: CalculatorTab; activeTab: CalculatorTab; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-4 py-3 text-sm font-medium transition-colors cursor-pointer select-none',
      'hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
      activeTab === tab
        ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400'
        : 'text-gray-400 hover:text-white'
    )}
  >
    {tab.charAt(0).toUpperCase() + tab.slice(1)}
  </button>
));
TabButton.displayName = 'TabButton';

const Calculator: React.FC<CalculatorProps> = ({ settings, onUpdateSettings }) => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<CalculatorTab>('calculator');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  
  const displayRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('calculatorHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Save history to localStorage (debounced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
      } catch (e) {
        console.error('Failed to save history:', e);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [history]);

  // Auto-scroll display only when expression changes significantly
  useEffect(() => {
    if (displayRef.current && expression.length > 0) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [result]);

  // Optimized debounced preview calculation
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (!expression || error) {
      setPreview('');
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        const validation = validateExpression(expression);
        if (validation.isValid) {
          const { value } = await calculateWithVerification(
            expression,
            settings.precision,
            settings.angleMode
          );
          if (value) {
            setPreview(formatResult(value, settings.precision, settings.scientificNotation));
          }
        }
      } catch (e) {
        // Silently fail for preview
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [expression, settings.precision, settings.angleMode, settings.scientificNotation, error]);

  // Handle button press - optimized with useCallback
  const handleButtonPress = useCallback((value: string) => {
    setError('');
    setVerificationStatus('');

    switch (value) {
      case 'C':
        setExpression('');
        setResult('');
        setPreview('');
        break;
      case '⌫':
        setExpression(prev => prev.slice(0, -1));
        break;
      case '=':
        handleCalculate();
        break;
      case 'ANS':
        setExpression(prev => prev + (history[0]?.result || ''));
        break;
      case 'π':
        setExpression(prev => prev + 'pi');
        break;
      case 'e':
        setExpression(prev => prev + 'e');
        break;
      case '√':
        setExpression(prev => prev + 'sqrt(');
        break;
      case '^':
        setExpression(prev => prev + '^');
        break;
      case 'x!':
        setExpression(prev => prev + 'factorial(');
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
      case 'log':
      case 'ln':
      case 'log2':
      case 'exp':
        setExpression(prev => prev + value + '(');
        break;
      case '(':
      case ')':
      case '+':
      case '-':
      case '*':
      case '/':
      case '.':
      case '1/x':
        setExpression(prev => prev + value);
        break;
      default:
        setExpression(prev => prev + value);
    }
  }, [history]);

  // Handle calculation - optimized
  const handleCalculate = useCallback(async () => {
    if (!expression.trim()) return;

    setIsCalculating(true);
    setError('');
    setShowVerification(false);

    try {
      const { value, verified, error: calcError } = await calculateWithVerification(
        expression,
        settings.precision,
        settings.angleMode
      );

      if (calcError) {
        setError(calcError);
        setResult('');
      } else {
        const formattedResult = formatResult(value, settings.precision, settings.scientificNotation);
        setResult(formattedResult);
        
        // Add to history
        const newHistory: CalculationHistory = {
          id: Date.now().toString(),
          expression: expression,
          result: formattedResult,
          timestamp: Date.now(),
          verified: verified
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 100));

        // Verification check
        if (!verified) {
          setShowVerification(true);
          setVerificationStatus('Recomputing...');
          
          // Recompute with higher precision
          const { value: highPrecisionValue } = await calculateWithVerification(
            expression,
            Math.min(settings.precision + 20, 100),
            settings.angleMode
          );
          
          if (highPrecisionValue) {
            const highPrecisionResult = formatResult(highPrecisionValue, settings.precision, settings.scientificNotation);
            setResult(highPrecisionResult);
            setVerificationStatus('✓ Verified');
            
            setHistory(prev => {
              const updated = [...prev];
              if (updated.length > 0) {
                updated[0] = { ...updated[0], result: highPrecisionResult, verified: true };
              }
              return updated;
            });
          }
        } else {
          setVerificationStatus('✓ Verified');
        }

        setExpression(formattedResult);
      }
    } catch (e) {
      setError('Error: Calculation failed');
      setResult('');
    } finally {
      setIsCalculating(false);
    }
  }, [expression, settings.precision, settings.angleMode, settings.scientificNotation]);

  // Load expression from history
  const loadFromHistory = useCallback((historyItem: CalculationHistory) => {
    setExpression(historyItem.expression);
    setResult(historyItem.result);
    setActiveTab('calculator');
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  }, []);

  // Keyboard support - optimized
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;
      
      if (/[0-9+\-*/.^()]/.test(key)) {
        e.preventDefault();
        handleButtonPress(key);
      } else if (key === 'Enter') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleButtonPress('⌫');
      } else if (key === 'Escape') {
        e.preventDefault();
        handleButtonPress('C');
      } else if (key === '.') {
        e.preventDefault();
        handleButtonPress('.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButtonPress, handleCalculate]);

  // Tab content with overflow handling
  const renderTabContent = () => {
    switch (activeTab) {
      case 'calculator':
        return (
          <div className="flex flex-col h-full">
            <Display
              expression={expression}
              result={result}
              preview={preview}
              error={error}
              isCalculating={isCalculating}
              showVerification={showVerification}
              verificationStatus={verificationStatus}
              angleMode={settings.angleMode}
              ref={displayRef}
            />
            <Keypad onButtonPress={handleButtonPress} disabled={isCalculating} />
          </div>
        );
      case 'matrix':
        return (
          <MatrixPanel onInsertExpression={(expr: string) => {
            setExpression(expr);
            setActiveTab('calculator');
          }} />
        );
      case 'solver':
        return (
          <SolverPanel onInsertExpression={(expr: string) => {
            setExpression(expr);
            setActiveTab('calculator');
          }} />
        );
      case 'history':
        return (
          <HistoryPanel
            history={history}
            onLoad={loadFromHistory}
            onClear={clearHistory}
          />
        );
      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800 flex-shrink-0 overflow-x-auto">
        {(['calculator', 'matrix', 'solver', 'history', 'settings'] as CalculatorTab[]).map((tab) => (
          <TabButton
            key={tab}
            tab={tab}
            activeTab={activeTab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </div>

      {/* Main Content - with proper overflow handling */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Calculator;
