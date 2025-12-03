// ============================================================================
// 03-OBJECTS-AND-ARRAYS: Working with Objects and Arrays in JavaScript
// ============================================================================
// DEMO: Object literals, property typos, mixed arrays
// ============================================================================

// --- PLAIN OBJECT LITERAL ---

const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  isActive: true,
};

console.log(user.name);  // "Alice" ✅

// --- THE TYPO BUG ---

// This is a VERY common bug - property name typos!
console.log(user.nmae);  // undefined 🐛 (no error, just wrong!)
console.log(user.emial); // undefined 🐛

// Even worse - setting a typo'd property creates a NEW property!
user.actve = false;  // Typo! Creates 'actve' instead of modifying 'isActive'
console.log(user);
// { id: 1, name: "Alice", email: "...", isActive: true, actve: false } 🐛

// --- ARRAYS OF MIXED VALUES ---

// JavaScript allows arrays to contain ANY types mixed together
const mixedArray = [1, "two", 3, "four", { five: 5 }, [6, 7]];
console.log(mixedArray);

// This can lead to runtime errors:
function sumNumbers(arr) {
  let total = 0;
  for (const item of arr) {
    total += item;  // What if item is a string or object?
  }
  return total;
}

const numbers = [1, 2, 3, 4, 5];
console.log(sumNumbers(numbers));  // 15 ✅

const oops = [1, 2, "three", 4];
console.log(sumNumbers(oops));  // "3three4" 🐛 (string concatenation!)

// --- ARRAY METHODS WITH NO TYPE SAFETY ---

const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Carol", role: "user" },
];

// Map/filter work, but no guarantee about what we're working with
const names = users.map((u) => u.name);
console.log(names);  // ["Alice", "Bob", "Carol"]

// Typo in map - silently produces undefined values!
const namesBugged = users.map((u) => u.nmae);  // 🐛
console.log(namesBugged);  // [undefined, undefined, undefined]

// --- OBJECTS PASSED TO FUNCTIONS ---

function printUserInfo(user) {
  // We ASSUME user has these properties... but do we know for sure?
  console.log(`User: ${user.name} (ID: ${user.id})`);
  console.log(`Contact: ${user.email}`);
}

printUserInfo(user);  // Works ✅

// But nothing stops this:
printUserInfo({ firstName: "Dave", lastName: "Smith" });
// "User: undefined (ID: undefined)"
// "Contact: undefined"  🐛

// ============================================================================
// KEY PROBLEMS:
// 1. Property typos are silently ignored (return undefined)
// 2. Setting typo'd properties creates new properties
// 3. Mixed arrays can cause type confusion
// 4. No way to enforce object shapes
// 5. map/filter with typos silently produce wrong results
// ============================================================================

