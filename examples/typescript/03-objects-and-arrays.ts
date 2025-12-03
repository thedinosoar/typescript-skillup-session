// ============================================================================
// 03-OBJECTS-AND-ARRAYS: Typed Objects and Arrays in TypeScript
// ============================================================================
// DEMO: Object types, array types, catching typos, typed map/filter
// ============================================================================

// --- OBJECT TYPE DEFINITION (INLINE) ---

// Define the shape of an object directly
const user: { id: number; name: string; email: string; isActive: boolean } = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  isActive: true,
};

console.log(user.name);  // "Alice" ✅

// --- TYPOS ARE CAUGHT AT COMPILE TIME ---

// console.log(user.nmae);   // ❌ Error: Property 'nmae' does not exist
// console.log(user.emial);  // ❌ Error: Property 'emial' does not exist

// Setting a typo'd property is also an error:
// user.actve = false;  // ❌ Error: Property 'actve' does not exist

// --- ARRAY TYPES ---

// Specify what types an array can contain
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["Alice", "Bob", "Carol"];

// Alternative syntax using generics:
const moreNumbers: Array<number> = [6, 7, 8];

// Mixed arrays? You must be EXPLICIT:
// const oops: number[] = [1, 2, "three"];  // ❌ Error: Type 'string' is not assignable

// If you really need mixed types, declare it:
const mixed: (number | string)[] = [1, "two", 3, "four"];

// --- TYPE-SAFE SUM FUNCTION ---

function sumNumbers(arr: number[]): number {
  let total = 0;
  for (const item of arr) {
    total += item;  // Safe! TypeScript knows item is a number
  }
  return total;
}

console.log(sumNumbers(numbers));  // 15 ✅
// sumNumbers([1, 2, "three"]);    // ❌ Error at compile time!

// --- TYPED USER OBJECTS ---

// Better: Define a type for reuse (we'll cover interfaces more later)
type User = {
  id: number;
  name: string;
  role: "admin" | "user";  // Literal types - only these values allowed!
};

const users: User[] = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Carol", role: "user" },
];

// --- TYPED MAP/FILTER ---

// Map with type safety - typos are caught!
const userNames = users.map((u) => u.name);  // string[]
console.log(userNames);  // ["Alice", "Bob", "Carol"]

// const bugged = users.map((u) => u.nmae);  // ❌ Error: Property 'nmae' does not exist

// Filter with type inference
const admins = users.filter((u) => u.role === "admin");  // User[]
console.log(admins);  // [{ id: 1, name: "Alice", role: "admin" }]

// Chaining with full type safety
const adminNames = users
  .filter((u) => u.role === "admin")
  .map((u) => u.name.toUpperCase());  // string[]
console.log(adminNames);  // ["ALICE"]

// --- OBJECTS AS FUNCTION PARAMETERS ---

function printUserInfo(userParam: User): void {
  // TypeScript KNOWS these properties exist!
  console.log(`User: ${userParam.name} (ID: ${userParam.id})`);
  console.log(`Role: ${userParam.role}`);
}

printUserInfo(users[0]);  // Works ✅

// printUserInfo({ firstName: "Dave" });
// ❌ Error: Object literal may only specify known properties

// If you pass an object literal, TypeScript checks it matches exactly:
printUserInfo({ id: 4, name: "Dave", role: "user" });  // ✅

// ============================================================================
// KEY BENEFITS:
// 1. Property typos are compile-time errors
// 2. Array types prevent mixing incompatible values
// 3. map/filter operations preserve type information
// 4. Function parameters with types enforce correct shapes
// 5. Literal types ("admin" | "user") restrict to valid values
// ============================================================================

