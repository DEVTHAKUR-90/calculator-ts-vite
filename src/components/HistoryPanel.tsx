// History Panel Component
import React from 'react';
import { CalculationHistory } from '../types/calculator';
import { cn } from '../utils/cn';

interface HistoryPanelProps {
  history: CalculationHistory[];
  onLoad: (item: CalculationHistory) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onClear }) => {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const truncateExpression = (expr: string, maxLength: number = 50): string => {
    if (expr.length <= maxLength) return expr;
    return expr.slice(0, maxLength) + '...';
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg">No calculation history</p>
        <p className="text-sm mt-2">Your calculations will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">
          History ({history.length})
        </h2>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onLoad(item)}
            className={cn(
              'bg-gray-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-750 hover:shadow-lg border border-gray-700',
              'hover:border-blue-500/50'
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-gray-500">
                {formatTimestamp(item.timestamp)}
              </span>
              {item.verified && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <div className="text-gray-400 text-sm font-mono mb-1 break-all">
              {truncateExpression(item.expression)}
            </div>
            <div className="text-xl font-mono text-blue-400 break-all">
              = {item.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
