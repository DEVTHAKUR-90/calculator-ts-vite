// Settings Panel Component
import React from 'react';
import { CalculatorSettings } from '../types/calculator';
import { DEFAULT_PRECISION } from '../utils/calculatorEngine';
import { cn } from '../utils/cn';

interface SettingsPanelProps {
  settings: CalculatorSettings;
  onUpdateSettings: (settings: CalculatorSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings }) => {
  const updateSetting = <K extends keyof CalculatorSettings>(key: K, value: CalculatorSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
          <p className="text-gray-400">Configure calculator behavior and appearance</p>
        </div>

        {/* Angle Mode */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Angle Mode</h3>
          <div className="flex gap-4">
            <button
              onClick={() => updateSetting('angleMode', 'DEG')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
                settings.angleMode === 'DEG'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              Degrees (DEG)
            </button>
            <button
              onClick={() => updateSetting('angleMode', 'RAD')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
                settings.angleMode === 'RAD'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              Radians (RAD)
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Affects trigonometric functions (sin, cos, tan, etc.)
          </p>
        </div>

        {/* Precision */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Calculation Precision
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Decimal Places</span>
              <span className="text-blue-400 font-mono text-lg">{settings.precision}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.precision}
              onChange={(e) => updateSetting('precision', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Higher precision = more accurate results but slower computation
          </p>
        </div>

        {/* Display Options */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Display Options</h3>
          <div className="space-y-4">
            {/* Scientific Notation */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-300">Scientific Notation</span>
                <p className="text-xs text-gray-500">Use exponential format for very large/small numbers</p>
              </div>
              <button
                onClick={() => updateSetting('scientificNotation', !settings.scientificNotation)}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.scientificNotation ? 'bg-blue-600' : 'bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.scientificNotation ? 'left-7' : 'left-1'
                  )}
                />
              </button>
            </label>

            {/* Show Preview */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-300">Real-time Preview</span>
                <p className="text-xs text-gray-500">Show calculation result while typing</p>
              </div>
              <button
                onClick={() => updateSetting('showPreview', !settings.showPreview)}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.showPreview ? 'bg-blue-600' : 'bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.showPreview ? 'left-7' : 'left-1'
                  )}
                />
              </button>
            </label>
          </div>
        </div>

        {/* About */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">About</h3>
          <p className="text-gray-400 text-sm">
            High-Precision Scientific Calculator
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built with math.js and Decimal.js for maximum accuracy.<br />
            Results are verified using multiple calculation methods.
          </p>
        </div>

        {/* Reset Settings */}
        <button
          onClick={() => onUpdateSettings({
            precision: DEFAULT_PRECISION,
            angleMode: 'RAD',
            scientificNotation: false,
            showPreview: true,
            darkMode: true
          })}
          className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Reset to Default Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
