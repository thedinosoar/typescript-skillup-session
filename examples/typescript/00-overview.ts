// ============================================================================
// 00-OVERVIEW: What is JavaScript? What is TypeScript?
// ============================================================================
// DEMO: TypeScript = JavaScript + Static Types (no runtime change)
// ============================================================================

// TypeScript adds type annotations that are checked at COMPILE time.
// The types are erased when compiled to JavaScript - zero runtime overhead!

function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// This works fine - types match!
console.log("Valid call:", calculateTotal(10, 5)); // 50

// These would cause COMPILE-TIME errors (uncomment to see):
// console.log("Bug:", calculateTotal("ten", 5));
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// console.log("Oops:", calculateTotal(10, "5"));
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// ============================================================================
// KEY INSIGHT: TypeScript catches errors BEFORE your code runs.
// 
// Think of it like this:
//   JavaScript: "I'll figure it out when I get there" 
//   TypeScript: "Let's make sure this makes sense first"
//
// TypeScript compiles to plain JavaScript - browsers/Node never see the types.
// ============================================================================

// Bonus: Types also enable better IDE support!
// Try hovering over 'calculateTotal' - you see the full signature.
// Try typing 'calculateTotal(' - you get parameter hints.

