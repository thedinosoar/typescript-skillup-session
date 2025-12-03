// ============================================================================
// 01-BASICS: Variables, Types, and Equality in JavaScript
// ============================================================================
// DEMO: var vs let vs const, primitive types, loose vs strict equality
// ============================================================================

// --- VAR vs LET vs CONST ---

// var: function-scoped, can be redeclared, hoisted (old-school, avoid!)
var message = "Hello";
var message = "Goodbye"; // No error - redeclaration allowed! 🐛

// let: block-scoped, cannot be redeclared, can be reassigned
let count = 1;
count = 2; // OK
// let count = 3; // Error: already declared

// const: block-scoped, cannot be reassigned (but objects/arrays can be mutated!)
const PI = 3.14159;
// PI = 3; // Error: Assignment to constant variable

const user = { name: "Alice" };
user.name = "Bob"; // This works! const prevents reassignment, not mutation.

// --- PRIMITIVE TYPES ---

let age = 25;              // number (integers and floats are the same type)
let name = "Alice";        // string
let isActive = true;       // boolean
let nothing = null;        // null (intentional absence of value)
let notDefined = undefined;// undefined (uninitialized)

// Numbers can be weird:
console.log(0.1 + 0.2);           // 0.30000000000000004 (floating point!)
console.log(typeof NaN);          // "number" (wat?)
console.log(NaN === NaN);         // false (wat?!)

// --- LOOSE vs STRICT EQUALITY (== vs ===) ---

// == performs type coercion (converts types to match)
// === checks value AND type (no coercion)

console.log("--- Loose Equality (==) - DANGER ZONE ---");
console.log(1 == "1");           // true  🐛 (string coerced to number)
console.log(0 == false);         // true  🐛 
console.log(null == undefined);  // true  🐛
console.log("" == 0);            // true  🐛

console.log("--- Strict Equality (===) - SAFE ---");
console.log(1 === "1");          // false ✅
console.log(0 === false);        // false ✅
console.log(null === undefined); // false ✅
console.log("" === 0);           // false ✅

// --- THE BUG: Comparing string "1" to number 1 ---

function checkId(id) {
  // Common bug: data from forms/URLs often comes as strings
  if (id == 1) {  // Using == instead of ===
    return "Found user 1!";
  }
  return "Not found";
}

console.log(checkId(1));    // "Found user 1!"
console.log(checkId("1"));  // "Found user 1!" - Is this intended? Probably a bug!
console.log(checkId("01")); // "Not found" - Inconsistent behavior!

// ============================================================================
// KEY PROBLEMS:
// 1. No way to enforce that 'age' stays a number
// 2. == vs === is easy to get wrong
// 3. The type of data (string vs number) is invisible
// ============================================================================
