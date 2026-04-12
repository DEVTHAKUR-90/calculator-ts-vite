// Calculator Keypad Component - Optimized for smooth performance
import React, { useMemo } from 'react';
import { cn } from '../utils/cn';

interface KeypadProps {
  onButtonPress: (value: string) => void;
  disabled: boolean;
}

const Keypad: React.FC<KeypadProps> = React.memo(({ onButtonPress, disabled }) => {
  // Memoize button configuration to prevent re-renders
  const buttons = useMemo(() => [
    // Row 1 - Scientific functions
    ['sin', 'cos', 'tan', 'log', 'ln'],
    // Row 2 - More scientific functions
    ['asin', 'acos', 'atan', 'log2', 'exp'],
    // Row 3 - Powers and roots
    ['x!', '√', '^', '(', ')'],
    // Row 4 - Constants and clear
    ['π', 'e', 'ANS', 'C', '⌫'],
    // Row 5 - Numbers and operations
    ['7', '8', '9', '/', '*'],
    // Row 6 - Numbers and operations
    ['4', '5', '6', '-', '+'],
    // Row 7 - Numbers and equals
    ['1', '2', '3', '=', ''],
    // Row 8 - Zero and decimal
    ['0', '.', '', '', ''],
  ], []);

  // Memoize button styling to prevent recalculations
  const getButtonConfig = useMemo(() => (value: string) => {
    const baseStyle = 'font-semibold rounded-lg transition-transform duration-75 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center no-select';
    
    if (!value) {
      return {
        style: 'opacity-0 cursor-default',
        padding: ''
      };
    }
    
    if (value === '=') {
      return {
        style: cn(baseStyle, 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg md:text-xl shadow-lg shadow-blue-500/25'),
        padding: 'p-3 md:p-4'
      };
    }
    
    if (['C', '⌫'].includes(value)) {
      return {
        style: cn(baseStyle, 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25'),
        padding: 'p-3 md:p-4'
      };
    }
    
    if (['/', '*', '-', '+', '^', '(', ')', '1/x'].includes(value)) {
      return {
        style: cn(baseStyle, 'bg-orange-600 hover:bg-orange-500 text-white text-base md:text-lg'),
        padding: 'p-3 md:p-4'
      };
    }
    
    if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'log2', 'exp', '√', 'x!', 'π', 'e', 'ANS'].includes(value)) {
      return {
        style: cn(baseStyle, 'bg-gray-700 hover:bg-gray-600 text-blue-300 text-xs md:text-sm'),
        padding: 'p-2 md:p-3'
      };
    }
    
    // Numbers
    return {
      style: cn(baseStyle, 'bg-gray-800 hover:bg-gray-700 text-white text-lg md:text-xl'),
      padding: 'p-3 md:p-4'
    };
  }, []);

  // Handle button click with memoized handler
  const handleButtonClick = React.useCallback((value: string) => {
    if (value) {
      onButtonPress(value);
    }
  }, [onButtonPress]);

  return (
    <div className="flex-1 p-2 md:p-3 bg-gray-900">
      <div className="grid grid-cols-5 gap-1.5 md:gap-2 h-full">
        {buttons.flat().map((button, index) => {
          const { style: buttonStyle, padding } = getButtonConfig(button);
          return (
            <button
              key={`${button}-${index}`}
              onClick={() => handleButtonClick(button)}
              disabled={disabled || !button}
              className={cn(
                buttonStyle,
                padding,
                'transform-gpu will-change-transform'
              )}
              type="button"
              aria-label={button || 'empty'}
            >
              {button}
            </button>
          );
        })}
      </div>
    </div>
  );
});

Keypad.displayName = 'Keypad';

export default Keypad;
