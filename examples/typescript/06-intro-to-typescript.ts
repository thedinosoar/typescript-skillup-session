// ============================================================================
// 06-INTRO-TO-TYPESCRIPT: Core TypeScript Concepts
// ============================================================================
// DEMO: Basic types, any vs unknown, noImplicitAny, type safety
// ============================================================================

// --- BASIC TYPES ---

const name1: string = "Alice";
const age: number = 30;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: string[] = ["Alice", "Bob"];

// Object (inline type)
const user: { id: number; name: string } = { id: 1, name: "Alice" };

// --- THE 'any' TYPE: Escape Hatch ---

// 'any' disables type checking - use sparingly!
let anything: any = "hello";
anything = 42;
anything = { foo: "bar" };
anything = null;

// any is dangerous - these "work" but are bugs:
// anything.nonExistentMethod();  // No error at compile time, but crashes!
// anything.foo.bar.baz;          // No error, but likely undefined

// --- noImplicitAny: Making 'any' Explicit ---

// With "noImplicitAny": true in tsconfig.json, this is an error:
// function process(data) { }  // ❌ Parameter 'data' implicitly has an 'any' type

// You must be explicit:
function processExplicit(data: any): void {
  console.log(data);
}

// Better: use proper types
function processTyped(data: { name: string }): void {
  console.log(data.name);
}

// --- 'unknown' TYPE: Safe Alternative to 'any' ---

// 'unknown' is like 'any', but requires type checking before use
let mystery: unknown = getUserInput();

// Can't use it directly:
// mystery.toUpperCase();  // ❌ Error: Object is of type 'unknown'
// mystery + 1;            // ❌ Error

// Must narrow the type first:
if (typeof mystery === "string") {
  console.log(mystery.toUpperCase());  // ✅ Now TypeScript knows it's a string
}

if (typeof mystery === "number") {
  console.log(mystery + 1);  // ✅ Now TypeScript knows it's a number
}

function getUserInput(): unknown {
  return "hello";  // Pretend this comes from user input
}

// --- COMPARING any vs unknown ---

function processAny(value: any): string {
  // NO SAFETY: TypeScript trusts you completely
  return value.name.toUpperCase();  // Might crash at runtime!
}

function processUnknown(value: unknown): string {
  // SAFE: TypeScript forces you to check
  if (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof (value as { name: unknown }).name === "string"
  ) {
    return (value as { name: string }).name.toUpperCase();
  }
  return "Unknown";
}

// --- TYPED USER DATA FUNCTION ---

interface UserData {
  name: string;
  email: string;
  age: number;
  isAdmin?: boolean;  // Optional property
}

interface ProcessedUser {
  displayName: string;
  contact: string;
  adult: boolean;
}

function processUserData(user: UserData): ProcessedUser {
  console.log(`Processing user: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Age: ${user.age}`);
  
  if (user.isAdmin) {
    console.log("User is an administrator!");
  }
  
  return {
    displayName: user.name.toUpperCase(),
    contact: user.email,
    adult: user.age >= 18,
  };
}

// This works:
const result1 = processUserData({
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  isAdmin: true,
});
console.log(result1);

// This is caught at compile time:
// processUserData({
//   firstName: "Bob",      // ❌ Object literal may only specify known properties
//   emailAddress: "bob@x", // ❌
// });

// --- TYPE-SAFE CALCULATION ---

type Operation = "add" | "multiply" | "subtract" | "divide";

function calculate(a: number, b: number, operation: Operation): number {
  switch (operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return a / b;
  }
}

console.log(calculate(5, 3, "add"));       // 8 ✅
// console.log(calculate("5", "3", "add")); // ❌ Error: string not assignable to number
// console.log(calculate(5, 3, "power"));   // ❌ Error: "power" not in Operation type

// ============================================================================
// KEY INSIGHTS:
// 1. Basic types: string, number, boolean, null, undefined, arrays, objects
// 2. 'any' disables checking - use only as last resort
// 3. 'unknown' is safer - forces type narrowing
// 4. noImplicitAny catches accidental 'any' types
// 5. Interfaces define object shapes and catch mismatches
// 6. Literal union types ("add" | "multiply") restrict to valid values
// ============================================================================

