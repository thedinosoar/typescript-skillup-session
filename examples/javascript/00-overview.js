// ============================================================================
// 00-OVERVIEW: What is JavaScript? What is TypeScript?
// ============================================================================
// DEMO: This file shows a runtime error that TypeScript would catch at compile time.
// ============================================================================

// JavaScript is a dynamic, loosely-typed language.
// Types are determined at runtime, not compile time.

function calculateTotal(price, quantity) {
  return price * quantity;
}

// This works fine
console.log("Valid call:", calculateTotal(10, 5)); // 50

// But what happens here? 🐛
// This is a RUNTIME error waiting to happen!
console.log("Bug:", calculateTotal("ten", 5)); // NaN - no error, just wrong!

// Even worse - this produces unexpected results
console.log("Oops:", calculateTotal(10, "5")); // 50 (string coercion!)
console.log("Double oops:", calculateTotal("10", "5")); // "105" (string concatenation!)

// The problem: JavaScript won't tell you about these issues until runtime.
// In a large codebase, these bugs can hide for months.

// ============================================================================
// KEY INSIGHT: JavaScript's flexibility is both a strength and a weakness.
// TypeScript adds static types WITHOUT changing how your code runs.
// ============================================================================

