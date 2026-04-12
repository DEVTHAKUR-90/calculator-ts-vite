// Calculator Display Component - Optimized for smooth scrolling
import { forwardRef, useMemo } from 'react';
import { cn } from '../utils/cn';

interface DisplayProps {
  expression: string;
  result: string;
  preview: string;
  error: string;
  isCalculating: boolean;
  showVerification: boolean;
  verificationStatus: string;
  angleMode: 'DEG' | 'RAD';
}

const Display = forwardRef<HTMLDivElement, DisplayProps>((
  { expression, result, preview, error, isCalculating, showVerification, verificationStatus, angleMode },
  _ref
) => {
  // Memoize status indicators to prevent unnecessary re-renders
  const verificationIndicator = useMemo(() => (
    showVerification ? (
      <span className="text-xs text-yellow-400 animate-pulse flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {verificationStatus}
      </span>
    ) : null
  ), [showVerification, verificationStatus]);

  const calculatingIndicator = useMemo(() => (
    isCalculating ? (
      <span className="text-xs text-blue-400 flex items-center gap-1">
        <svg className="w-3 h-3 spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Calculating...
      </span>
    ) : null
  ), [isCalculating]);

  return (
    <div className="flex-shrink-0 bg-gray-950 p-3 md:p-4 border-b border-gray-800 overflow-y-auto">
      {/* Mode Indicator and Status */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <span className={cn(
          'text-xs font-medium px-2 py-1 rounded',
          angleMode === 'DEG' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
        )}>
          {angleMode}
        </span>
        <div className="flex items-center gap-3">
          {calculatingIndicator}
          {verificationIndicator}
        </div>
      </div>

      {/* Expression Display - Horizontal scroll for long expressions */}
      <div className="bg-gray-900 rounded-lg p-3 md:p-4 mb-2 min-h-[50px] md:min-h-[60px]">
        <div className="text-gray-400 text-xs md:text-sm mb-1">Expression:</div>
        <div 
          className="text-white text-base md:text-xl font-mono overflow-x-auto overflow-y-hidden whitespace-pre scrollbar-thin"
          style={{ direction: 'ltr' }}
        >
          {expression || '0'}
        </div>
      </div>

      {/* Preview Display */}
      {preview && !error && (
        <div className="bg-gray-800 rounded-lg p-2 md:p-3 mb-2">
          <div className="text-gray-500 text-xs mb-1">Preview:</div>
          <div className="text-gray-300 text-base md:text-lg font-mono result-text">
            = {preview}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-2">
          <div className="text-red-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && !error && (
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-3 md:p-4 border border-blue-700/50">
          <div className="text-blue-300 text-xs mb-1">Result:</div>
          <div className="text-lg md:text-2xl font-mono text-white break-all result-text">
            = {result}
          </div>
        </div>
      )}
    </div>
  );
});

Display.displayName = 'Display';

export default Display;
