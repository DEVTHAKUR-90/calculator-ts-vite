// Calculator Type Definitions

export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  verified: boolean;
}

export interface CalculatorSettings {
  precision: number;
  angleMode: 'DEG' | 'RAD';
  scientificNotation: boolean;
  showPreview: boolean;
  darkMode: boolean;
}

export interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export interface CalculationResult {
  value: string;
  verified: boolean;
  precision: number;
  computationTime: number;
}

export type CalculatorTab = 'calculator' | 'history' | 'settings' | 'matrix' | 'solver';
