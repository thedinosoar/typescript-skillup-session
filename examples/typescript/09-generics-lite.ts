// ============================================================================
// 09-GENERICS-LITE: Type-Safe Utilities with Generics in TypeScript
// ============================================================================
// DEMO: Generic functions, type inference, preserving type information
// ============================================================================

// --- WRAP UTILITY: Preserves Type Information ---

// T is a "type parameter" - a placeholder for the actual type
function wrap<T>(value: T): { value: T } {
  return { value: value };
}

// TypeScript INFERS T from the argument!
const wrappedNumber = wrap(123);        // T = number
const wrappedString = wrap("hello");    // T = string
const wrappedObject = wrap({ id: 1, name: "Alice" });  // T = { id: number; name: string }

console.log(wrappedNumber.value);   // 123, and TypeScript knows it's a number!
console.log(wrappedString.value);   // "hello", and TypeScript knows it's a string!
console.log(wrappedObject.value.name);  // "Alice" - autocomplete works! ✅
// wrappedObject.value.nmae  // ❌ Error: Property 'nmae' does not exist

// --- FIRST/LAST UTILITIES ---

function first<T>(array: T[]): T | undefined {
  return array[0];
}

function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

const numbers = [1, 2, 3, 4, 5];
const names = ["Alice", "Bob", "Carol"];

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const firstNum = first(numbers);   // number | undefined
const lastName = last(names);      // string | undefined
const firstUser = first(users);    // User | undefined

// Full autocomplete and type checking!
if (firstUser) {
  console.log(firstUser.name);  // ✅ Autocomplete works!
  // firstUser.nmae  // ❌ Error: Property 'nmae' does not exist
}

// --- IDENTITY FUNCTION ---

function identity<T>(value: T): T {
  return value;
}

const num = identity(42);        // number
const str = identity("hello");   // string
const obj = identity({ x: 1, y: 2 });  // { x: number; y: number }

// Type is preserved!
console.log(num.toFixed(2));     // "42.00" ✅
console.log(str.toUpperCase());  // "HELLO" ✅
console.log(obj.x + obj.y);      // 3 ✅

// --- PAIR CREATOR: Multiple Type Parameters ---

function makePair<A, B>(first: A, second: B): { first: A; second: B } {
  return { first, second };
}

const pair1 = makePair(1, "one");       // { first: number; second: string }
const pair2 = makePair("x", { y: 10 }); // { first: string; second: { y: number } }

// TypeScript tracks both types!
console.log(pair1.first.toFixed(0));    // "1" ✅ (knows it's a number)
console.log(pair1.second.toUpperCase()); // "ONE" ✅ (knows it's a string)
console.log(pair2.second.y);             // 10 ✅ (knows the structure)

// --- TYPE-SAFE MAP VALUES ---

function mapValues<K extends string, V, R>(
  obj: Record<K, V>,
  fn: (value: V) => R
): Record<K, R> {
  const result = {} as Record<K, R>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn(obj[key]);
    }
  }
  return result;
}

const prices = { apple: 1.5, banana: 0.75, orange: 2.0 };
const doubled = mapValues(prices, (x) => x * 2);

console.log(doubled.apple);   // 3 ✅
console.log(doubled.banana);  // 1.5 ✅
// doubled.aple  // ❌ Error: Property 'aple' does not exist

// --- GENERIC CONSTRAINTS ---

// Sometimes you need to constrain what T can be
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(value: T): number {
  return value.length;
}

console.log(getLength("hello"));    // 5 ✅
console.log(getLength([1, 2, 3]));  // 3 ✅
// getLength(123);  // ❌ Error: number doesn't have 'length'

// --- KEY-BASED FILTERING ---

function filterByProp<T, K extends keyof T>(
  array: T[],
  propName: K,
  value: T[K]
): T[] {
  return array.filter((item) => item[propName] === value);
}

interface Product {
  name: string;
  category: string;
  price: number;
}

const products: Product[] = [
  { name: "Widget", category: "tools", price: 10 },
  { name: "Gadget", category: "electronics", price: 50 },
  { name: "Gizmo", category: "tools", price: 25 },
];

const tools = filterByProp(products, "category", "tools");
console.log(tools);  // [{ name: "Widget"... }, { name: "Gizmo"... }]

// Type safety enforced:
// filterByProp(products, "categry", "tools");     // ❌ Error: "categry" is not a key
// filterByProp(products, "price", "expensive");   // ❌ Error: "expensive" not assignable to number

// --- GENERIC MEMOIZE ---

function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();
  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key)!;
  };
}

function slowAdd(a: number, b: number): number {
  return a + b;
}

const memoizedAdd = memoize(slowAdd);
console.log(memoizedAdd(1, 2));  // 3

// Type signature is preserved!
// memoizedAdd("a", "b");  // ❌ Error: strings not assignable to number
// memoizedAdd(1);         // ❌ Error: Expected 2 arguments

// ============================================================================
// KEY INSIGHT: Generics = "Write once, compiler fills in types everywhere"
//
// Benefits:
// 1. Type parameters (<T>) preserve type information through transformations
// 2. TypeScript INFERS types from usage - you rarely need to specify them
// 3. Constraints (extends) limit what types are allowed
// 4. keyof enables type-safe property access
// 5. Higher-order functions maintain full type signatures
// ============================================================================

