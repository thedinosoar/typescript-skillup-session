// ============================================================================
// 02-FUNCTIONS: Function Syntax and Common Pitfalls in JavaScript
// ============================================================================
// DEMO: Regular vs arrow functions, optional params, inconsistent returns
// ============================================================================

// --- REGULAR FUNCTION vs ARROW FUNCTION ---

// Regular function declaration (hoisted)
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expression (not hoisted)
const greetExpr = function (name) {
  return `Hello, ${name}!`;
};

// Arrow function (concise syntax, lexical 'this')
const greetArrow = (name) => `Hello, ${name}!`;

// All three work the same for simple cases:
console.log(greet("Alice"));      // "Hello, Alice!"
console.log(greetExpr("Bob"));    // "Hello, Bob!"
console.log(greetArrow("Carol")); // "Hello, Carol!"

// --- OPTIONAL PARAMETERS (NO CHECKS) ---

// This function expects an optional greeting, but doesn't handle it well
function sendMessage(to, message, greeting) {
  // Bug: greeting might be undefined, but we use it anyway!
  console.log(`${greeting}, ${to}! ${message}`);
}

sendMessage("Alice", "How are you?", "Hi");
// Output: "Hi, Alice! How are you!" ✅

sendMessage("Bob", "Meeting at 3pm");
// Output: "undefined, Bob! Meeting at 3pm" 🐛

// --- FUNCTION RETURNING INCONSISTENT TYPES ---

function findUser(id) {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  const user = users.find((u) => u.id === id);

  if (user) {
    return user; // Returns an object
  }
  // What if user not found?
  // Sometimes developers return different things:
  if (id === 0) {
    return null; // Returns null
  }
  if (id < 0) {
    return "Invalid ID"; // Returns a string?! 🐛
  }
  // Falls through with no return = undefined
}

console.log(findUser(1));        // { id: 1, name: "Alice" }
console.log(findUser(99));       // undefined
console.log(findUser(0));        // null
console.log(findUser(-1));       // "Invalid ID"

// The caller has no idea what type to expect!
const result = findUser(1);
// Is it an object? null? undefined? string? Who knows!

// --- WRONG ARGUMENT COUNT ---

function add(a, b) {
  return a + b;
}

console.log(add(1, 2));        // 3 ✅
console.log(add(1));           // NaN (b is undefined) 🐛
console.log(add(1, 2, 3, 4));  // 3 (extra args ignored) 🐛

// ============================================================================
// KEY PROBLEMS:
// 1. No way to mark parameters as truly optional vs required
// 2. No enforcement of return type consistency
// 3. Wrong argument counts silently produce bugs
// 4. Callers have to guess what a function might return
// ============================================================================

