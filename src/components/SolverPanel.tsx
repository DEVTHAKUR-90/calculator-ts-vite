// Equation Solver Panel
import React, { useState } from 'react';
import { equationSolver, numericalDifferentiation, numericalIntegration } from '../utils/calculatorEngine';
import { cn } from '../utils/cn';

interface SolverPanelProps {
  onInsertExpression: (expression: string) => void;
}

const SolverPanel: React.FC<SolverPanelProps> = ({ onInsertExpression }) => {
  const [solverMode, setSolverMode] = useState<'quadratic' | 'derivative' | 'integration'>('quadratic');
  
  // Quadratic solver state
  const [a, setA] = useState<string>('1');
  const [b, setB] = useState<string>('0');
  const [c, setC] = useState<string>('-1');
  
  // Derivative state
  const [derivativeFn, setDerivativeFn] = useState<string>('x^2');
  const [derivativePoint, setDerivativePoint] = useState<string>('2');
  
  // Integration state
  const [integrand, setIntegrand] = useState<string>('x^2');
  const [lowerBound, setLowerBound] = useState<string>('0');
  const [upperBound, setUpperBound] = useState<string>('1');

  const solveQuadratic = () => {
    const aNum = parseFloat(a) || 0;
    const bNum = parseFloat(b) || 0;
    const cNum = parseFloat(c) || 0;
    
    const result = equationSolver.quadratic(aNum, bNum, cNum);
    
    if (result.roots.length === 0) {
      return 'No solution';
    }
    
    if (result.type === 'linear') {
      return `Linear equation: x = ${result.roots[0].real}`;
    }
    
    if (result.type === 'real') {
      const root1 = result.roots[0];
      const root2 = result.roots[1];
      if (root2) {
        return `x₁ = ${root1.real}, x₂ = ${root2.real}`;
      }
      return `x = ${root1.real}`;
    }
    
    // Complex roots
    const root1 = result.roots[0];
    const root2 = result.roots[1];
    const imagPart = root1.imag ?? 0;
    const real2 = root2?.real ?? root1.real;
    const imag2 = root2?.imag ?? -imagPart;
    return `x₁ = ${root1.real} ± ${imagPart}i, x₂ = ${real2} ∓ ${Math.abs(imag2)}i`;
  };

  const calculateDerivative = () => {
    try {
      const xVal = parseFloat(derivativePoint);
      if (Number.isNaN(xVal)) {
        return 'Error: Invalid point value';
      }
      const x = xVal;
      
      // Parse the function string and create a function
      const fnStr = derivativeFn.replace(/\^/g, '**').replace(/x/g, 'x');
      // eslint-disable-next-line no-new-func
      const fn: (x: number) => number = new Function('x', `return ${fnStr}`) as (x: number) => number;
      
      const derivative = numericalDifferentiation(fn, x);
      return `f'(${x}) = ${derivative}`;
    } catch (e) {
      return `Error: ${(e as Error).message}`;
    }
  };

  const calculateIntegration = () => {
    try {
      const aVal = parseFloat(lowerBound);
      const bVal = parseFloat(upperBound);
      if (Number.isNaN(aVal) || Number.isNaN(bVal)) {
        return 'Error: Invalid bounds';
      }
      const a = aVal;
      const b = bVal;
      
      // Parse the integrand string and create a function
      const fnStr = integrand.replace(/\^/g, '**').replace(/x/g, 'x');
      // eslint-disable-next-line no-new-func
      const fn: (x: number) => number = new Function('x', `return ${fnStr}`) as (x: number) => number;
      
      const result = numericalIntegration(fn, a, b);
      return `∫[${a}, ${b}] ${integrand} dx = ${result}`;
    } catch (e) {
      return `Error: ${(e as Error).message}`;
    }
  };

  const copyToExpression = (expr: string) => {
    onInsertExpression(expr);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Equation Solver & Analysis</h2>

        {/* Mode Selection */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Select Mode</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'quadratic', label: 'Quadratic' },
              { id: 'derivative', label: 'Derivative' },
              { id: 'integration', label: 'Integration' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSolverMode(mode.id as any)}
                className={cn(
                  'py-3 px-4 rounded-lg font-medium transition-all',
                  solverMode === mode.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quadratic Solver */}
        {solverMode === 'quadratic' && (
          <>
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quadratic Equation</h3>
              <div className="text-center text-xl text-blue-400 font-mono mb-6">
                ax² + bx + c = 0
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">a</label>
                  <input
                    type="number"
                    step="any"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">b</label>
                  <input
                    type="number"
                    step="any"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">c</label>
                  <input
                    type="number"
                    step="any"
                    value={c}
                    onChange={(e) => setC(e.target.value)}
                    className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => copyToExpression(solveQuadratic())}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all"
            >
              Solve Quadratic
            </button>
          </>
        )}

        {/* Derivative Calculator */}
        {solverMode === 'derivative' && (
          <>
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Numerical Derivative</h3>
              <div className="mb-4">
                <label className="text-gray-400 text-sm">Function f(x)</label>
                <input
                  type="text"
                  value={derivativeFn}
                  onChange={(e) => setDerivativeFn(e.target.value)}
                  placeholder="e.g., x^2, sin(x), x^3 + 2*x"
                  className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Evaluate at x =</label>
                <input
                  type="number"
                  step="any"
                  value={derivativePoint}
                  onChange={(e) => setDerivativePoint(e.target.value)}
                  className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Uses central difference method for accurate numerical differentiation
              </p>
            </div>
            <button
              onClick={() => copyToExpression(calculateDerivative())}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all"
            >
              Calculate Derivative
            </button>
          </>
        )}

        {/* Integration Calculator */}
        {solverMode === 'integration' && (
          <>
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Numerical Integration</h3>
              <div className="mb-4">
                <label className="text-gray-400 text-sm">Integrand f(x)</label>
                <input
                  type="text"
                  value={integrand}
                  onChange={(e) => setIntegrand(e.target.value)}
                  placeholder="e.g., x^2, sin(x), exp(-x)"
                  className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Lower bound (a)</label>
                  <input
                    type="number"
                    step="any"
                    value={lowerBound}
                    onChange={(e) => setLowerBound(e.target.value)}
                    className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Upper bound (b)</label>
                  <input
                    type="number"
                    step="any"
                    value={upperBound}
                    onChange={(e) => setUpperBound(e.target.value)}
                    className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Uses Simpson's rule for accurate numerical integration
              </p>
            </div>
            <button
              onClick={() => copyToExpression(calculateIntegration())}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all"
            >
              Calculate Integral
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SolverPanel;
