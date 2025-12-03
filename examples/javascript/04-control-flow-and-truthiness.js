// ============================================================================
// 04-CONTROL-FLOW-AND-TRUTHINESS: JavaScript's Falsy Value Gotchas
// ============================================================================
// DEMO: Falsy values, if(value) checks, treating 0 as "no data"
// ============================================================================

// --- FALSY VALUES IN JAVASCRIPT ---

// These are ALL "falsy" (evaluate to false in boolean context):
const falsyValues = [
  false,      // boolean false
  0,          // zero
  -0,         // negative zero
  0n,         // BigInt zero
  "",         // empty string
  null,       // null
  undefined,  // undefined
  NaN,        // Not a Number
];

// Everything else is "truthy"!
console.log("--- Falsy values ---");
for (const val of falsyValues) {
  if (val) {
    console.log(`${val} is truthy`);
  } else {
    console.log(`${String(val)} is falsy`);
  }
}

// --- THE if(value) PATTERN ---

// Common pattern: check if a value "exists"
function processData(data) {
  if (data) {
    console.log("Processing:", data);
  } else {
    console.log("No data provided!");
  }
}

processData("hello");    // "Processing: hello" ✅
processData([1, 2, 3]);  // "Processing: [1,2,3]" ✅
processData(null);       // "No data provided!" ✅
processData(undefined);  // "No data provided!" ✅

// BUT WAIT...
processData(0);          // "No data provided!" 🐛 (0 is valid data!)
processData("");         // "No data provided!" 🐛 (empty string might be valid!)
processData(false);      // "No data provided!" 🐛 (false might be intentional!)

// --- THE BUG: Treating 0 as "no data" ---

function getDiscount(amount) {
  // Common mistake: checking if amount "exists"
  if (!amount) {
    return "No discount applied";
  }
  return `Discount: $${amount}`;
}

console.log(getDiscount(10));  // "Discount: $10" ✅
console.log(getDiscount(5));   // "Discount: $5" ✅
console.log(getDiscount(0));   // "No discount applied" 🐛 
// Zero IS a valid discount amount!

// --- ANOTHER COMMON BUG: Array length check ---

function processItems(items) {
  // Buggy: empty array is truthy, but items.length is 0 (falsy)
  if (!items.length) {  // This works for "no items"...
    console.log("No items to process");
    return;
  }
  console.log(`Processing ${items.length} items`);
}

processItems([1, 2, 3]);  // "Processing 3 items" ✅
processItems([]);         // "No items to process" ✅

// But this pattern can bite you:
function getFirstItem(items) {
  const first = items[0];
  if (!first) {  // Checking if first item "exists"
    return "No first item!";
  }
  return first;
}

console.log(getFirstItem(["a", "b"]));  // "a" ✅
console.log(getFirstItem([0, 1, 2]));   // "No first item!" 🐛 (0 is valid!)
console.log(getFirstItem(["", "b"]));   // "No first item!" 🐛 (empty string is valid!)

// --- THE OR (||) OPERATOR TRAP ---

function greet(name) {
  // Using || for default values
  const displayName = name || "Guest";
  return `Hello, ${displayName}!`;
}

console.log(greet("Alice"));  // "Hello, Alice!" ✅
console.log(greet(null));     // "Hello, Guest!" ✅
console.log(greet(""));       // "Hello, Guest!" 🐛 (what if empty name is allowed?)

// ============================================================================
// KEY PROBLEMS:
// 1. 0, "", false are valid values but treated as "missing"
// 2. if(value) pattern doesn't distinguish null/undefined from falsy values
// 3. || operator falls back for any falsy value, not just null/undefined
// 4. Bugs hide until you hit edge cases with 0 or empty strings
// ============================================================================

