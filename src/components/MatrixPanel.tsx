// Matrix Operations Panel
import React, { useState } from 'react';
import { matrixOperations } from '../utils/calculatorEngine';
import { cn } from '../utils/cn';

interface MatrixPanelProps {
  onInsertExpression: (expression: string) => void;
}

const MatrixPanel: React.FC<MatrixPanelProps> = ({ onInsertExpression }) => {
  const [matrixSize, setMatrixSize] = useState<{ rows: number; cols: number }>({ rows: 2, cols: 2 });
  const [matrixData, setMatrixData] = useState<number[][]>([
    [1, 0],
    [0, 1]
  ]);
  const [matrixB, setMatrixB] = useState<number[][]>([
    [2],
    [3]
  ]);
  const [result, setResult] = useState<string>('');
  const [operation, setOperation] = useState<string>('determinant');

  const updateMatrixCell = (matrixIndex: 0 | 1, row: number, col: number, value: string) => {
    const newValue = parseFloat(value) || 0;
    if (matrixIndex === 0) {
      const newData = matrixData.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? newValue : c))
      );
      setMatrixData(newData);
    } else {
      const newData = matrixB.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? newValue : c))
      );
      setMatrixB(newData);
    }
  };

  const handleSizeChange = (rows: number, cols: number) => {
    setMatrixSize({ rows, cols });
    const newData: number[][] = [];
    for (let i = 0; i < rows; i++) {
      newData[i] = [];
      for (let j = 0; j < cols; j++) {
        newData[i][j] = i === j ? 1 : 0;
      }
    }
    setMatrixData(newData);
  };

  const calculateMatrix = () => {
    try {
      let res: any = null;

      switch (operation) {
        case 'determinant':
          res = matrixOperations.determinant(matrixData);
          setResult(`det(A) = ${res}`);
          onInsertExpression(`det(${JSON.stringify(matrixData)})`);
          break;
        case 'transpose':
          res = matrixOperations.transpose(matrixData);
          setResult(`A^T = ${JSON.stringify((res as any).toArray ? (res as any).toArray() : res)}`);
          break;
        case 'inverse':
          res = matrixOperations.inverse(matrixData);
          setResult(`A^-1 = ${JSON.stringify((res as any).toArray ? (res as any).toArray() : res)}`);
          break;
        case 'add':
          res = matrixOperations.add(matrixData, matrixB);
          setResult(`A + B = ${JSON.stringify((res as any).toArray ? (res as any).toArray() : res)}`);
          break;
        case 'subtract':
          res = matrixOperations.subtract(matrixData, matrixB);
          setResult(`A - B = ${JSON.stringify((res as any).toArray ? (res as any).toArray() : res)}`);
          break;
        case 'multiply':
          res = matrixOperations.multiply(matrixData, matrixB);
          setResult(`A × B = ${JSON.stringify((res as any).toArray ? (res as any).toArray() : res)}`);
          break;
      }
    } catch (e) {
      setResult(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Matrix Operations</h2>

        {/* Matrix Size */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Matrix Size</h3>
          <div className="flex gap-4">
            <div>
              <label className="text-gray-400 text-sm">Rows</label>
              <input
                type="number"
                min="1"
                max="5"
                value={matrixSize.rows}
                onChange={(e) => handleSizeChange(parseInt(e.target.value), matrixSize.cols)}
                className="mt-1 w-20 bg-gray-700 text-white rounded-lg px-3 py-2 text-center"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Columns</label>
              <input
                type="number"
                min="1"
                max="5"
                value={matrixSize.cols}
                onChange={(e) => handleSizeChange(matrixSize.rows, parseInt(e.target.value))}
                className="mt-1 w-20 bg-gray-700 text-white rounded-lg px-3 py-2 text-center"
              />
            </div>
          </div>
        </div>

        {/* Matrix A */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Matrix A</h3>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixSize.cols}, 1fr)` }}>
            {matrixData.map((row, i) =>
              row.map((cell, j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  step="any"
                  value={cell}
                  onChange={(e) => updateMatrixCell(0, i, j, e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                />
              ))
            )}
          </div>
        </div>

        {/* Matrix B (for binary operations) */}
        {['add', 'subtract', 'multiply'].includes(operation) && (
          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Matrix B</h3>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixB[0].length}, 1fr)` }}>
              {matrixB.map((row, i) =>
                row.map((cell, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    step="any"
                    value={cell}
                    onChange={(e) => updateMatrixCell(1, i, j, e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-2 text-center font-mono"
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Operation Selection */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Operation</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'determinant', label: 'Determinant' },
              { id: 'transpose', label: 'Transpose' },
              { id: 'inverse', label: 'Inverse' },
              { id: 'add', label: 'Add (A + B)' },
              { id: 'subtract', label: 'Subtract (A - B)' },
              { id: 'multiply', label: 'Multiply (A × B)' }
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id)}
                className={cn(
                  'py-3 px-4 rounded-lg font-medium transition-all',
                  operation === op.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateMatrix}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all"
        >
          Calculate
        </button>

        {/* Result */}
        {result && (
          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Result</h3>
            <pre className="text-blue-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixPanel;
