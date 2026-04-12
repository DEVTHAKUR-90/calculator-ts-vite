// Main App Component
import { useState, useEffect, useCallback } from 'react';
import Calculator from './components/Calculator';
import { CalculatorSettings } from './types/calculator';

const defaultSettings: CalculatorSettings = {
  precision: 50,
  angleMode: 'RAD',
  scientificNotation: false,
  showPreview: true,
  darkMode: true
};

export default function App() {
  const [settings, setSettings] = useState<CalculatorSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('calculatorSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: CalculatorSettings) => {
    setSettings(newSettings);
    localStorage.setItem('calculatorSettings', JSON.stringify(newSettings));
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-2 md:p-4 overflow-auto">
        <div className="w-full max-w-4xl h-full max-h-[95vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <h1 className="text-base md:text-xl font-bold text-white">Scientific Calculator</h1>
                  <p className="text-xs text-gray-400">High-Precision Computing</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-600 text-white">
                  {settings.angleMode}
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {settings.precision} digits
                </span>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="flex-1 overflow-hidden">
            <Calculator settings={settings} onUpdateSettings={updateSettings} />
          </div>
        </div>
      </div>
    </div>
  );
}
