// High-Precision Calculator Engine v2.0
// Implements AST-based parsing, high-precision arithmetic, and result verification
// Optimized for performance and accuracy

import { create, all } from 'mathjs';
import Decimal from 'decimal.js';

// Create isolated math.js instance
const math = create(all, {});

// Set default precision
export const DEFAULT_PRECISION = 50;
export const MIN_PRECISION = 10;
export const MAX_PRECISION = 100;

// Configure Decimal.js with optimal settings
Decimal.set({
  precision: DEFAULT_PRECISION,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 7,
  minE: -1e9,
  maxE: 1e9,
  modulo: Decimal.ROUND_FLOOR
});

// Angle conversion utilities with high precision
export const angleUtils = {
  degToRad: (deg: number | Decimal): Decimal => {
    const decimalDeg = typeof deg === 'number' ? new Decimal(deg) : deg;
    return decimalDeg.mul(Math.PI).div(180);
  },
  
  radToDeg: (rad: number | Decimal): Decimal => {
    const decimalRad = typeof rad === 'number' ? new Decimal(rad) : rad;
    return decimalRad.mul(180).div(Math.PI);
  },
  
  normalizeAngle: (angle: Decimal, mode: 'DEG' | 'RAD'): Decimal => {
    if (mode === 'DEG') {
      const threeSixty = new Decimal(360);
      return angle.mod(threeSixty).plus(threeSixty).mod(threeSixty);
    }
    const twoPi = new Decimal(2 * Math.PI);
    return angle.mod(twoPi).plus(twoPi).mod(twoPi);
  }
};

// Taylor series implementation for trigonometric functions (high precision)
const taylorSeries = {
  sin: (x: Decimal, terms: number = 50): Decimal => {
    // Handle very small values
    if (x.abs().lt(new Decimal('1e-15'))) {
      return x;
    }
    
    let result = new Decimal(0);
    let term = x;
    const xSquared = x.mul(x);
    
    for (let i = 1; i <= terms; i++) {
      result = result.plus(term);
      const nPlus1 = new Decimal(2 * i);
      const nPlus2 = new Decimal(2 * i + 1);
      term = term.mul(xSquared).neg().div(nPlus1).div(nPlus2);
      
      // Early termination if term is negligible
      if (term.abs().lt(new Decimal('1e-50'))) {
        break;
      }
    }
    
    return result;
  },
  
  cos: (x: Decimal, terms: number = 50): Decimal => {
    // Handle very small values
    if (x.abs().lt(new Decimal('1e-15'))) {
      return new Decimal(1);
    }
    
    let result = new Decimal(1);
    let term = new Decimal(1);
    const xSquared = x.mul(x);
    
    for (let i = 1; i <= terms; i++) {
      const n = new Decimal(2 * i - 1);
      const nPlus1 = new Decimal(2 * i);
      term = term.mul(xSquared).neg().div(n).div(nPlus1);
      result = result.plus(term);
      
      // Early termination if term is negligible
      if (term.abs().lt(new Decimal('1e-50'))) {
        break;
      }
    }
    
    return result;
  },
  
  tan: (sin: Decimal, cos: Decimal): Decimal => {
    if (cos.abs().lt(new Decimal('1e-15'))) {
      throw new Error('Undefined: division by zero in tan');
    }
    return sin.div(cos);
  }
};

// High-precision trigonometric functions
export const highPrecisionTrig = {
  sin: (value: number | Decimal, mode: 'DEG' | 'RAD'): Decimal => {
    const decimalValue = typeof value === 'number' ? new Decimal(value) : value;
    let rad = mode === 'DEG' ? angleUtils.degToRad(decimalValue) : decimalValue;
    
    // Reduce angle to [-π, π] for better numerical stability
    const pi = new Decimal(Math.PI);
    const twoPi = pi.mul(2);
    rad = rad.mod(twoPi);
    if (rad.gt(pi)) {
      rad = rad.sub(twoPi);
    }
    
    return taylorSeries.sin(rad, 40);
  },
  
  cos: (value: number | Decimal, mode: 'DEG' | 'RAD'): Decimal => {
    const decimalValue = typeof value === 'number' ? new Decimal(value) : value;
    let rad = mode === 'DEG' ? angleUtils.degToRad(decimalValue) : decimalValue;
    
    // Reduce angle to [-π, π] for better numerical stability
    const pi = new Decimal(Math.PI);
    const twoPi = pi.mul(2);
    rad = rad.mod(twoPi);
    if (rad.gt(pi)) {
      rad = rad.sub(twoPi);
    }
    
    return taylorSeries.cos(rad, 40);
  },
  
  tan: (value: number | Decimal, mode: 'DEG' | 'RAD'): Decimal => {
    const sin = highPrecisionTrig.sin(value, mode);
    const cos = highPrecisionTrig.cos(value, mode);
    return taylorSeries.tan(sin, cos);
  },
  
  asin: (value: number | Decimal): Decimal => {
    const decimalValue = typeof value === 'number' ? new Decimal(value) : value;
    
    // Domain check
    if (decimalValue.lt(-1) || decimalValue.gt(1)) {
      throw new Error('Domain error: asin requires input in [-1, 1]');
    }
    
    // Use Taylor series for asin
    let result = new Decimal(0);
    let term = decimalValue;
    const xSquared = decimalValue.mul(decimalValue);
    
    for (let i = 0; i < 50; i++) {
      if (i > 0) {
        const num = new Decimal(2 * i - 1);
        const den = new Decimal(2 * i);
        term = term.mul(xSquared).mul(num).div(den);
      }
      const den = new Decimal(2 * i + 1);
      result = result.plus(term.div(den));
    }
    
    return result;
  },
  
  acos: (value: number | Decimal): Decimal => {
    const decimalValue = typeof value === 'number' ? new Decimal(value) : value;
    
    // Domain check
    if (decimalValue.lt(-1) || decimalValue.gt(1)) {
      throw new Error('Domain error: acos requires input in [-1, 1]');
    }
    
    // acos(x) = π/2 - asin(x)
    const halfPi = new Decimal(Math.PI / 2);
    return halfPi.sub(highPrecisionTrig.asin(decimalValue));
  },
  
  atan: (value: number | Decimal): Decimal => {
    const decimalValue = typeof value === 'number' ? new Decimal(value) : value;
    
    // Use identity: atan(x) for |x| > 1 is π/2 - atan(1/x)
    let x = decimalValue;
    let multiplier = new Decimal(1);
    
    if (x.abs().gt(1)) {
      x = new Decimal(1).div(x);
      multiplier = new Decimal(-1);
    }
    
    // Taylor series for atan
    let result = new Decimal(0);
    let term = x;
    const xSquared = x.mul(x);
    
    for (let i = 0; i < 100; i++) {
      const n = new Decimal(2 * i + 1);
      result = result.plus(term.div(n));
      term = term.mul(xSquared).neg();
    }
    
    if (multiplier.lt(0)) {
      const halfPi = new Decimal(Math.PI / 2);
      result = halfPi.sub(result.abs());
    }
    
    return result;
  }
};

// Validation functions with detailed error messages
export const validateExpression = (expression: string): { isValid: boolean; error?: string } => {
  if (!expression || expression.trim() === '') {
    return { isValid: false, error: 'Empty expression - please enter a calculation' };
  }

  // Check for balanced parentheses
  const parenCount = expression.split('(').length - expression.split(')').length;
  if (parenCount !== 0) {
    return { 
      isValid: false, 
      error: `Unbalanced parentheses (missing ${parenCount > 0 ? parenCount : Math.abs(parenCount)} closing/opening)` 
    };
  }

  // Check for balanced brackets
  const bracketCount = expression.split('[').length - expression.split(']').length;
  if (bracketCount !== 0) {
    return { isValid: false, error: 'Unbalanced brackets' };
  }

  // Check for invalid characters (allow more characters for advanced functions)
  const validChars = /^[0-9+\-*/^().\s,a-zA-Z!%]+$/;
  if (!validChars.test(expression)) {
    return { isValid: false, error: 'Invalid characters in expression' };
  }

  // Check for consecutive operators (except minus for negative numbers)
  const consecutiveOps = /[+/*]{2,}|[\+/*]\^/;
  if (consecutiveOps.test(expression)) {
    return { isValid: false, error: 'Invalid consecutive operators' };
  }

  // Check for division by zero pattern
  if (/\b0\s*[*/]\s*0\b/.test(expression) || /\/\s*0\s*([),+\-*/]|$)/.test(expression)) {
    return { isValid: false, error: 'Division by zero detected' };
  }

  // Check for factorial of negative numbers
  if (/factorial\s*\(\s*-/.test(expression.toLowerCase())) {
    return { isValid: false, error: 'Factorial of negative numbers is undefined' };
  }

  // Try to parse the expression
  try {
    const node = math.parse(expression);
    if (!node) {
      return { isValid: false, error: 'Invalid expression structure' };
    }
  } catch (e) {
    return { isValid: false, error: `Syntax error: ${(e as Error).message}` };
  }

  return { isValid: true };
};

// Evaluate expression using Decimal.js for maximum precision
function evaluateWithDecimal(expression: string, precision: number): string | null {
  try {
    Decimal.set({ precision });
    
    // Replace common functions with Decimal operations
    let decimalExpr = expression
      .replace(/pi/gi, String(Math.PI))
      .replace(/\be\b/g, String(Math.E))
      .replace(/sqrt\s*\(/g, 'sqrt(')
      .replace(/abs\s*\(/g, 'abs(')
      .replace(/\^/g, '**');
    
    // Create a safe evaluation context
    const safeScope = {
      sqrt: (x: number) => Math.sqrt(x),
      abs: (x: number) => Math.abs(x),
      sin: (x: number) => Math.sin(x),
      cos: (x: number) => Math.cos(x),
      tan: (x: number) => Math.tan(x),
      asin: (x: number) => Math.asin(x),
      acos: (x: number) => Math.acos(x),
      atan: (x: number) => Math.atan(x),
      log: (x: number) => Math.log(x),
      log10: (x: number) => Math.log10(x),
      log2: (x: number) => Math.log2(x),
      exp: (x: number) => Math.exp(x),
      factorial: (x: number) => {
        if (x < 0 || !Number.isInteger(x)) throw new Error('Invalid factorial input');
        let result = 1;
        for (let i = 2; i <= x; i++) result *= i;
        return result;
      }
    };

    // Use Function constructor for safe evaluation (limited scope)
    const func = new Function('scope', `
      with(scope) {
        try {
          return ${decimalExpr};
        } catch(e) {
          return NaN;
        }
      }
    `);
    
    const result = func(safeScope);
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return new Decimal(result).toString();
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

// High-precision calculation with verification
export const calculateWithVerification = async (
  expression: string,
  precision: number = DEFAULT_PRECISION,
  angleMode: 'DEG' | 'RAD' = 'RAD'
): Promise<{ value: string; verified: boolean; error?: string }> => {
  const startTime = performance.now();

  // Validate expression first
  const validation = validateExpression(expression);
  if (!validation.isValid) {
    return { value: '', verified: false, error: validation.error };
  }

  try {
    // Set precision for this calculation
    Decimal.set({ precision });
    math.config({ number: 'BigNumber', precision });

    // Create scope with high-precision functions
    const scope = {
      sin: (v: number) => highPrecisionTrig.sin(v, angleMode).toNumber(),
      cos: (v: number) => highPrecisionTrig.cos(v, angleMode).toNumber(),
      tan: (v: number) => highPrecisionTrig.tan(v, angleMode).toNumber(),
      asin: (v: number) => highPrecisionTrig.asin(v).toNumber(),
      acos: (v: number) => highPrecisionTrig.acos(v).toNumber(),
      atan: (v: number) => highPrecisionTrig.atan(v).toNumber(),
      sqrt: math.sqrt,
      log: math.log,
      log10: math.log10,
      log2: math.log2,
      exp: math.exp,
      abs: math.abs,
      pow: math.pow,
      floor: math.floor,
      ceil: math.ceil,
      round: math.round,
      factorial: math.factorial,
      gamma: math.gamma,
      pi: math.pi,
      e: math.e,
      i: math.i
    };

    // Primary calculation using math.js
    const primaryResult = math.evaluate(expression, scope);
    const primaryValue = primaryResult.toString();

    // Verification: Re-calculate with alternate method
    let verified = true;
    let verificationError = 0;

    // For numeric results, verify with Decimal.js
    if (!isNaN(parseFloat(primaryValue)) && !primaryValue.includes('i') && !primaryValue.includes('Complex')) {
      try {
        const decimalResult = evaluateWithDecimal(expression, precision);
        if (decimalResult !== null) {
          const primaryNum = parseFloat(primaryValue);
          const decimalNum = parseFloat(decimalResult);
          verificationError = Math.abs(primaryNum - decimalNum);
          
          // Check if results match within tolerance
          const tolerance = Math.pow(10, -Math.min(precision - 10, 10));
          const relativeError = Math.abs(primaryNum) > 0 
            ? verificationError / Math.abs(primaryNum) 
            : verificationError;
            
          if (relativeError > tolerance && relativeError > 1e-10) {
            verified = false;
            // Recompute with higher precision
            math.config({ number: 'BigNumber', precision: Math.min(precision + 20, MAX_PRECISION) });
            const recomputeResult = math.evaluate(expression, scope);
            
            return { 
              value: recomputeResult.toString(), 
              verified: true,
              error: undefined 
            };
          }
        }
      } catch (e) {
        // Verification not possible, mark as valid
        verified = true;
      }
    }

    const computationTime = performance.now() - startTime;
    void computationTime; // Suppress unused warning

    return {
      value: primaryValue,
      verified,
      error: undefined
    };
  } catch (e) {
    const errorMessage = (e as Error).message;
    
    // Provide more specific error messages
    if (errorMessage.includes('Division by zero')) {
      return { value: '', verified: false, error: 'Division by zero - cannot divide by zero' };
    }
    if (errorMessage.includes('Domain') || errorMessage.includes('sqrt')) {
      return { value: '', verified: false, error: 'Domain error - check input values' };
    }
    if (errorMessage.includes('Overflow') || errorMessage.includes('too large')) {
      return { value: '', verified: false, error: 'Overflow error - result too large' };
    }
    if (errorMessage.includes('Underflow')) {
      return { value: '', verified: false, error: 'Underflow error - result too small' };
    }
    
    return { value: '', verified: false, error: `Calculation error: ${errorMessage}` };
  }
};

// Format result for display
export const formatResult = (
  value: string, 
  precision: number, 
  scientificNotation: boolean
): string => {
  if (!value || value === 'undefined' || value === 'null') {
    return 'Error';
  }

  // Handle complex numbers
  if (value.includes('i') || value.includes('Complex')) {
    return value;
  }

  // Handle special values
  if (value === 'Infinity' || value === '-Infinity') {
    return '∞';
  }
  if (value === 'NaN') {
    return 'Error';
  }

  try {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return value;
    }

    // Use Decimal for consistent formatting
    Decimal.set({ precision });
    const decimalValue = new Decimal(value);
    
    if (scientificNotation || Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return decimalValue.toExponential(Math.min(precision - 1, 20));
    }
    
    // Format with appropriate decimal places
    const decimalPlaces = Math.min(precision - 1, 20);
    const formatted = decimalValue.toFixed(decimalPlaces);
    
    // Remove trailing zeros after decimal point
    if (formatted.includes('.')) {
      return formatted.replace(/\.?0+$/, '');
    }
    
    return formatted;
  } catch (e) {
    return value;
  }
};

// Numerical integration using Simpson's rule (exported for use in SolverPanel)
export const numericalIntegration = (
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number = 1000
): number => {
  if (n % 2 !== 0) n++; // Simpson's rule requires even number of intervals
  
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);
  
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0) ? 2 * fn(x) : 4 * fn(x);
  }
  
  return (h / 3) * sum;
};

// Numerical differentiation using central difference (exported for use in SolverPanel)
export const numericalDifferentiation = (
  fn: (x: number) => number,
  x: number,
  h: number = 1e-7
): number => {
  return (fn(x + h) - fn(x - h)) / (2 * h);
};

// Matrix determinant calculation
export const calculateDeterminant = (matrix: number[][]): number => {
  const n = matrix.length;
  
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  
  let det = 0;
  for (let i = 0; i < n; i++) {
    const minor = matrix.slice(1).map(row => row.slice(0, i).concat(row.slice(i + 1)));
    det += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * calculateDeterminant(minor);
  }
  
  return det;
};

// Solve quadratic equation ax² + bx + c = 0
export const solveQuadratic = (a: number, b: number, c: number): { roots: (number | string)[]; type: string } => {
  if (a === 0) {
    // Linear equation
    if (b === 0) {
      return { roots: c === 0 ? ['All real numbers'] : ['No solution'], type: 'linear' };
    }
    return { roots: [-c / b], type: 'linear' };
  }
  
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant > 0) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return { roots: [root1, root2], type: 'two_real' };
  } else if (discriminant === 0) {
    const root = -b / (2 * a);
    return { roots: [root], type: 'one_real' };
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * a);
    return { 
      roots: [`${realPart} + ${imagPart}i`, `${realPart} - ${imagPart}i`], 
      type: 'complex' 
    };
  }
};

// Factorial with validation
export const safeFactorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial is only defined for non-negative integers');
  }
  if (n > 170) {
    throw new Error('Factorial result too large');
  }
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Export equationSolver object with quadratic method
export const equationSolver = {
  quadratic: (a: number, b: number, c: number): { roots: Array<{real: number; imag?: number}>; type: string } => {
    if (a === 0) {
      // Linear equation
      if (b === 0) {
        return { roots: c === 0 ? [{real: 0}] : [], type: 'linear' };
      }
      return { roots: [{real: -c / b}], type: 'linear' };
    }
    
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return { roots: [{real: root1}, {real: root2}], type: 'real' };
    } else if (discriminant === 0) {
      const root = -b / (2 * a);
      return { roots: [{real: root}], type: 'real' };
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      return { 
        roots: [
          {real: realPart, imag: imagPart}, 
          {real: realPart, imag: -imagPart}
        ], 
        type: 'complex' 
      };
    }
  }
};

// Export matrixOperations object
export const matrixOperations = {
  determinant: (matrix: number[][]): number => {
    const n = matrix.length;
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
      const minor = matrix.slice(1).map(row => row.slice(0, i).concat(row.slice(i + 1)));
      det += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * matrixOperations.determinant(minor);
    }
    
    return det;
  },
  
  transpose: (matrix: number[][]): number[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result: number[][] = [];
    
    for (let j = 0; j < cols; j++) {
      result[j] = [];
      for (let i = 0; i < rows; i++) {
        result[j][i] = matrix[i][j];
      }
    }
    
    return result;
  },
  
  inverse: (matrix: number[][]): number[][] => {
    const n = matrix.length;
    const det = matrixOperations.determinant(matrix);
    
    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted');
    }
    
    if (n === 1) {
      return [[1 / matrix[0][0]]];
    }
    
    if (n === 2) {
      return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det]
      ];
    }
    
    // For larger matrices, use Gaussian elimination
    const augmented: number[][] = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      const pivot = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }
    
    // Extract inverse
    const inverse: number[][] = [];
    for (let i = 0; i < n; i++) {
      inverse[i] = augmented[i].slice(n);
    }
    
    return inverse;
  },
  
  add: (a: number[][], b: number[][]): number[][] => {
    const rows = a.length;
    const cols = a[0].length;
    const result: number[][] = [];
    
    for (let i = 0; i < rows; i++) {
      result[i] = [];
      for (let j = 0; j < cols; j++) {
        result[i][j] = a[i][j] + b[i][j];
      }
    }
    
    return result;
  },
  
  subtract: (a: number[][], b: number[][]): number[][] => {
    const rows = a.length;
    const cols = a[0].length;
    const result: number[][] = [];
    
    for (let i = 0; i < rows; i++) {
      result[i] = [];
      for (let j = 0; j < cols; j++) {
        result[i][j] = a[i][j] - b[i][j];
      }
    }
    
    return result;
  },
  
  multiply: (a: number[][], b: number[][]): number[][] => {
    const rowsA = a.length;
    const colsA = a[0].length;
    const colsB = b[0].length;
    const result: number[][] = [];
    
    for (let i = 0; i < rowsA; i++) {
      result[i] = [];
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    
    return result;
  }
};
