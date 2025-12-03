// ============================================================================
// 09-GENERICS-LITE: Utility Functions Without Type Information in JavaScript
// ============================================================================
// DEMO: Generic-like patterns that lose type information
// ============================================================================

// --- WRAP UTILITY: Loses Type Information ---

function wrap(value) {
  return { value: value };
}

// Works, but we lose type info:
const wrappedNumber = wrap(123);
const wrappedString = wrap("hello");
const wrappedObject = wrap({ id: 1, name: "Alice" });

console.log(wrappedNumber.value);   // 123
console.log(wrappedString.value);   // "hello"
console.log(wrappedObject.value);   // { id: 1, name: "Alice" }

// But IDE/tooling doesn't know what .value is!
// No autocomplete on wrappedObject.value.name
// No error if you typo: wrappedObject.value.nmae

// --- FIRST/LAST UTILITIES ---

function first(array) {
  return array[0];
}

function last(array) {
  return array[array.length - 1];
}

const numbers = [1, 2, 3, 4, 5];
const names = ["Alice", "Bob", "Carol"];
const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];

console.log(first(numbers));  // 1
console.log(last(names));     // "Carol"
console.log(first(users));    // { id: 1, name: "Alice" }

// But what type is returned? JavaScript doesn't know!
const firstUser = first(users);
// firstUser.name  -- no autocomplete
// firstUser.nmae  -- no error

// --- IDENTITY FUNCTION ---

function identity(value) {
  return value;
}

const num = identity(42);
const str = identity("hello");
const obj = identity({ x: 1, y: 2 });

// All type information is lost
// num could be anything as far as tooling knows

// --- PAIR CREATOR ---

function makePair(first, second) {
  return { first, second };
}

const pair1 = makePair(1, "one");
const pair2 = makePair("x", { y: 10 });

// What are pair1.first and pair1.second?
// IDE has no idea!

// --- MAP-LIKE UTILITY ---

function mapValues(obj, fn) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = fn(obj[key]);
    }
  }
  return result;
}

const prices = { apple: 1.5, banana: 0.75, orange: 2.0 };
const doubled = mapValues(prices, (x) => x * 2);

console.log(doubled);  // { apple: 3, banana: 1.5, orange: 4 }

// But: no type info about keys or values
// doubled.aple  -- typo not caught!

// --- FILTER UTILITY ---

function filterByProp(array, propName, value) {
  return array.filter((item) => item[propName] === value);
}

const products = [
  { name: "Widget", category: "tools", price: 10 },
  { name: "Gadget", category: "electronics", price: 50 },
  { name: "Gizmo", category: "tools", price: 25 },
];

const tools = filterByProp(products, "category", "tools");
console.log(tools);  // [{ name: "Widget"... }, { name: "Gizmo"... }]

// Problems:
// - Typo in property name is not caught: filterByProp(products, "categry", "tools")
// - Wrong value type not caught: filterByProp(products, "price", "expensive")
// - Return type unknown: tools[0].nmae -- no error

// --- CACHING WRAPPER ---

function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (!(key in cache)) {
      cache[key] = fn(...args);
    }
    return cache[key];
  };
}

function slowAdd(a, b) {
  return a + b;
}

const memoizedAdd = memoize(slowAdd);
console.log(memoizedAdd(1, 2));  // 3

// But memoizedAdd has no type info!
// memoizedAdd("a", "b")  -- no error
// memoizedAdd(1)         -- no error for wrong arg count

// ============================================================================
// KEY PROBLEMS:
// 1. Utility functions lose all type information
// 2. Return types are effectively 'any'
// 3. No autocomplete or error checking on returned values
// 4. Property name typos go undetected
// 5. Higher-order functions (memoize) lose signature info
// ============================================================================

