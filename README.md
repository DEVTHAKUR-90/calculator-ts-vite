# 🧮 Scientific Calculator

This is a web-based scientific calculator built with a focus on **accuracy, performance, and reliability**.
The goal was to create something that feels as dependable as a real calculator (like the Casio fx-991CW), but runs smoothly in the browser.

---

## ✨ What this project does

* Handles complex mathematical expressions correctly
* Avoids common JavaScript precision issues (like `0.1 + 0.2`)
* Gives consistent and reliable results
* Provides a smooth and responsive user experience

---

## 🧠 How it works

Instead of relying on `eval`, this calculator uses a proper way to understand and compute expressions:

* Parses expressions step-by-step
* Respects operator precedence and brackets
* Supports nested calculations without breaking

To improve accuracy:

* Uses high-precision math (instead of normal JS numbers)
* Rechecks results before showing them

---

## ⚙️ Features

* Basic + scientific calculations
* Trigonometric and logarithmic functions
* Error handling (invalid input, divide by zero, etc.)
* Calculation history with timestamps
* Clean and responsive UI

---

## 🧮 Extra capabilities

* Equation solving (linear & quadratic)
* Matrix operations
* Numerical differentiation & integration
* Support for complex numbers

---

## 📜 History

Every calculation is saved with:

* The full expression
* The result
* Time of calculation

You can reuse or edit previous calculations anytime.

---

## ⚡ Performance

* Fast and smooth even with complex inputs
* Optimized to avoid UI lag
* Handles repeated calculations efficiently

---

## 🖥️ Tech Stack

* React + TypeScript + Vite
* Tailwind CSS

---

## 🚀 Run locally

```bash
npm install
npm run dev
```

---

## 🎯 Why I built this

I wanted to go beyond a simple calculator and build something that:

* Produces accurate results
* Handles edge cases properly
* Feels reliable like a real device

---

## 📌 Future improvements

* Adjustable precision (10, 20, 50 decimals)
* Step-by-step solution mode
* More advanced equation solving

---

## 🙌 Final note

Every result shown by this calculator is:

* Carefully computed
* Verified before display
* Designed to be reliable

---

⭐ If you find this useful, feel free to star the repo!
