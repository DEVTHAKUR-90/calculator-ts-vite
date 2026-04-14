```
 ██████╗ █████╗ ██╗      ██████╗
██╔════╝██╔══██╗██║     ██╔════╝
██║     ███████║██║     ██║
██║     ██╔══██║██║     ██║
╚██████╗██║  ██║███████╗╚██████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝
```

<div align="center">

**A precision-first, browser-based Scientific Calculator**

[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

*As dependable as a Casio fx-991CW — but it runs in your browser.*

</div>

---

## Overview

**CALC** is a web-based scientific calculator engineered with a strong emphasis on **accuracy, performance, and reliability**. Rather than patching over JavaScript's well-known floating-point limitations, this project addresses them head-on — using high-precision math, a proper expression parser, and verified output before any result is displayed.

---

## Why This Exists

Most browser calculators share the same flaw: they rely on `eval()` and raw IEEE 754 arithmetic, which means `0.1 + 0.2 ≠ 0.3`. This project was built to fix that — to create something that behaves like a real device, handles edge cases gracefully, and can be trusted.

---

## How It Works

```
  Raw Expression Input
          │
          ▼
  ┌───────────────────────┐
  │   Expression Parser   │  ──▶  Tokenizes & builds an AST
  └───────────────────────┘       (no eval, ever)
          │
          ▼
  ┌───────────────────────┐
  │  Precedence Resolver  │  ──▶  Respects BODMAS / operator order
  └───────────────────────┘
          │
          ▼
  ┌───────────────────────┐
  │  High-Precision Engine│  ──▶  Avoids JS floating-point errors
  └───────────────────────┘
          │
          ▼
  ┌───────────────────────┐
  │   Result Verifier     │  ──▶  Cross-checks before display
  └───────────────────────┘
          │
          ▼
       Output ✓
```

---

## Features

```
┌──────────────────────────┬────────────────────────────────────────┐
│  CATEGORY                │  CAPABILITIES                          │
├──────────────────────────┼────────────────────────────────────────┤
│  🔢 Arithmetic           │  Full expression support, BODMAS,      │
│                          │  nested brackets                       │
├──────────────────────────┼────────────────────────────────────────┤
│  📐 Scientific           │  Trig, logarithms, powers, roots       │
├──────────────────────────┼────────────────────────────────────────┤
│  🔣 Advanced Math        │  Complex numbers, matrices,            │
│                          │  linear & quadratic equations          │
├──────────────────────────┼────────────────────────────────────────┤
│  ∫ Calculus              │  Numerical differentiation &           │
│                          │  integration                           │
├──────────────────────────┼────────────────────────────────────────┤
│  📜 History              │  Full log with expressions, results,   │
│                          │  and timestamps — reusable anytime     │
├──────────────────────────┼────────────────────────────────────────┤
│  🛡️ Error Handling       │  Invalid input, division by zero,      │
│                          │  domain errors — all caught cleanly    │
└──────────────────────────┴────────────────────────────────────────┘
```

---

## Precision Approach

Standard JavaScript arithmetic fails silently on decimal values. This calculator avoids that by:

- Parsing all expressions into an AST rather than using `eval`
- Computing via a high-precision math library instead of native JS floats
- Cross-verifying results internally before rendering to the user

Every result shown is **computed, verified, and trusted**.

---

## Calculation History

Each entry in the history log stores:

```
┌──────────────────────────────────────────────────┐
│  Expression   │  sin(45) + log(100)               │
│  Result       │  2.70710678...                    │
│  Timestamp    │  2025-07-14  18:42:03             │
└──────────────────────────────────────────────────┘
```

Entries can be recalled, edited, and re-evaluated at any time.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React (Vite) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Math Engine** | High-precision arithmetic library |

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DEVTHAKUR-90/calculator-ts-vite.git

# Navigate into the project directory
cd calc

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
calc/
│
├── src/
│   ├── components/        # UI components (keypad, display, history)
│   ├── parser/            # Expression tokenizer & AST builder
│   ├── engine/            # High-precision computation core
│   ├── utils/             # Helpers, formatters, error handlers
│   └── data/              # History state management
│
├── public/
├── index.html
├── vite.config.ts
└── tailwind.config.ts
```

---

## Roadmap

- [x] Full scientific function support
- [x] High-precision arithmetic engine
- [x] Calculation history with timestamps
- [x] Matrix operations & equation solving
- [x] Complex number support
- [ ] Adjustable precision (10 / 20 / 50 decimal places)
- [ ] Step-by-step solution mode
- [ ] Extended equation solver (cubic, systems)
- [ ] Exportable history log

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add: your feature description'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Author

**Dev Thakur**

Cybersecurity enthusiast and developer passionate about building precise, reliable tools and intelligent systems.

[![GitHub](https://img.shields.io/badge/GitHub-DevThakur-181717?style=flat-square&logo=github)](https://github.com/DEVTHAKUR-90)

---

<div align="center">
  <sub>⭐ If this project was useful, a star goes a long way — thank you!</sub>
</div>
