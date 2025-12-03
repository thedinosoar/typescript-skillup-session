// ============================================================================
// 02-FUNCTIONS: Typed Functions in TypeScript
// ============================================================================
// DEMO: Parameter types, return types, optional/default params, type safety
// ============================================================================

// --- BASIC FUNCTION WITH TYPE ANNOTATIONS ---

// Regular function with parameter and return types
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function with types
const greetArrow = (name: string): string => `Hello, ${name}!`;

console.log(greet("Alice"));      // "Hello, Alice!"
console.log(greetArrow("Bob"));   // "Hello, Bob!"

// TypeScript catches wrong argument types:
// greet(42);  // ❌ Error: Argument of type 'number' is not assignable

// --- OPTIONAL PARAMETERS (param?: Type) ---

// The '?' marks a parameter as optional - TypeScript knows it might be undefined
function sendMessage(to: string, message: string, greeting?: string): void {
  // TypeScript forces us to handle the undefined case!
  const actualGreeting = greeting ?? "Hello";  // Nullish coalescing
  console.log(`${actualGreeting}, ${to}! ${message}`);
}

sendMessage("Alice", "How are you?", "Hi");  // "Hi, Alice! How are you!"
sendMessage("Bob", "Meeting at 3pm");         // "Hello, Bob! Meeting at 3pm" ✅

// --- DEFAULT PARAMETERS ---

// Even cleaner: provide a default value
function sendMessageWithDefault(
  to: string,
  message: string,
  greeting: string = "Hello"  // Default value - no need for '?'
): void {
  console.log(`${greeting}, ${to}! ${message}`);
}

sendMessageWithDefault("Carol", "See you soon!");  // "Hello, Carol! See you soon!"

// --- CONSISTENT RETURN TYPES ---

// TypeScript enforces that all code paths return the same type
interface User {
  id: number;
  name: string;
}

function findUser(id: number): User | null {
  const users: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  const user = users.find((u) => u.id === id);

  if (user) {
    return user;  // Returns User ✅
  }

  // Can only return User or null - not strings, not undefined
  return null;  // Returns null ✅

  // return "Invalid ID";  // ❌ Error: Type 'string' is not assignable
}

const result = findUser(1);
// TypeScript knows: result is User | null
// We MUST check for null before using it:
if (result !== null) {
  console.log(result.name);  // Safe! TypeScript knows it's User here
}

// --- WRONG ARGUMENT COUNT IS CAUGHT ---

function add(a: number, b: number): number {
  return a + b;
}

console.log(add(1, 2));  // 3 ✅
// console.log(add(1));           // ❌ Error: Expected 2 arguments, but got 1
// console.log(add(1, 2, 3, 4));  // ❌ Error: Expected 2 arguments, but got 4

// --- FUNCTION TYPES ---

// You can define the shape of a function
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;
const divide: MathOperation = (a, b) => a / b;

// This ensures all operations have the same signature
function calculate(op: MathOperation, x: number, y: number): number {
  return op(x, y);
}

console.log(calculate(multiply, 6, 7));  // 42
console.log(calculate(divide, 20, 4));   // 5

// ============================================================================
// KEY BENEFITS:
// 1. Optional params (?) force you to handle undefined
// 2. Default params provide clean fallback values
// 3. Return types ensure consistent behavior
// 4. Wrong argument counts are compile-time errors
// 5. Function types enable type-safe callbacks
// ============================================================================

