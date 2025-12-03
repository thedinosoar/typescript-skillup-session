// ============================================================================
// 01-BASICS: Variables, Types, and Equality in TypeScript
// ============================================================================
// DEMO: Type annotations, const inference, catching type mistakes
// ============================================================================

// --- TYPE ANNOTATIONS ---

// Explicit type annotations make intent clear
let age: number = 25;
let userName: string = "Alice";  // 'name' is reserved in some contexts
let isActive: boolean = true;

// TypeScript will catch type violations:
// age = "twenty-five";  // ❌ Error: Type 'string' is not assignable to type 'number'
// userName = 42;        // ❌ Error: Type 'number' is not assignable to type 'string'

// --- CONST + TYPE INFERENCE ---

// With const, TypeScript infers a "literal type" - the most specific type possible
const PI = 3.14159;        // Type is literally 3.14159, not just 'number'
const greeting = "Hello";  // Type is literally "Hello", not just 'string'

// With let, TypeScript infers the general type
let count = 10;            // Type is 'number'
let message = "Hi";        // Type is 'string'

// --- CATCHING NUMBER + STRING MISTAKES ---

function addNumbers(a: number, b: number): number {
  return a + b;
}

console.log(addNumbers(5, 10));  // 15 ✅

// These are caught at compile time:
// console.log(addNumbers("5", 10));    // ❌ Error: Argument of type 'string'...
// console.log(addNumbers(5, "10"));    // ❌ Error: Argument of type 'string'...

// Compare to the dangerous JS version that silently concatenates!

// --- FIXING THE ID COMPARISON BUG ---

function checkId(id: number): string {
  // Now we KNOW id is a number - no ambiguity!
  if (id === 1) {  // Always use === in TypeScript too
    return "Found user 1!";
  }
  return "Not found";
}

console.log(checkId(1));     // "Found user 1!" ✅
// console.log(checkId("1")); // ❌ Error: Argument of type 'string'...

// If you need to accept both, be explicit about it:
function checkIdFlexible(id: number | string): string {
  // TypeScript forces you to handle both cases properly
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  if (numericId === 1) {
    return "Found user 1!";
  }
  return "Not found";
}

console.log(checkIdFlexible(1));     // "Found user 1!"
console.log(checkIdFlexible("1"));   // "Found user 1!"

// --- NULL AND UNDEFINED ---

// TypeScript has strict null checking (when strictNullChecks is enabled)
let maybeValue: string | null = null;
maybeValue = "Now I have a value";
// maybeValue = 42;  // ❌ Error: Type 'number' is not assignable

// ============================================================================
// KEY BENEFITS:
// 1. Types make intent explicit and self-documenting
// 2. The compiler catches type mismatches before runtime
// 3. const + types = crystal clear, immutable values
// 4. IDE gets full autocomplete and hover information
// ============================================================================
