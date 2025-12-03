// ============================================================================
// 04-CONTROL-FLOW-AND-TRUTHINESS: Type-Safe Null Handling in TypeScript
// ============================================================================
// DEMO: Union types with null, explicit checks, avoiding truthiness bugs
// ============================================================================

// --- UNION TYPES: Be Explicit About Null/Undefined ---

// Instead of relying on truthiness, declare what can be null
let userName: string | null = null;
userName = "Alice";

let count: number | undefined = undefined;
count = 42;

// TypeScript FORCES you to handle null/undefined before using the value
function processName(name: string | null): string {
  // name.toUpperCase();  // ❌ Error: Object is possibly 'null'
  
  if (name === null) {
    return "Anonymous";
  }
  // After the check, TypeScript knows name is string
  return name.toUpperCase();
}

console.log(processName("Alice"));  // "ALICE"
console.log(processName(null));     // "Anonymous"

// --- FIXING THE DISCOUNT BUG ---

function getDiscount(amount: number | null): string {
  // Explicit null check - 0 is NOT treated as "no discount"
  if (amount === null) {
    return "No discount applied";
  }
  // Now TypeScript knows amount is a number (could be 0, and that's fine!)
  return `Discount: $${amount}`;
}

console.log(getDiscount(10));   // "Discount: $10" ✅
console.log(getDiscount(0));    // "Discount: $0" ✅ (Fixed!)
console.log(getDiscount(null)); // "No discount applied" ✅

// --- NULLISH COALESCING (??) vs OR (||) ---

// ?? only falls back for null/undefined, NOT for 0 or ""
function greet(name: string | null): string {
  const displayName = name ?? "Guest";  // ?? is null-safe!
  return `Hello, ${displayName}!`;
}

console.log(greet("Alice"));  // "Hello, Alice!" ✅
console.log(greet(null));     // "Hello, Guest!" ✅
console.log(greet(""));       // "Hello, !" ✅ (empty string is preserved!)

// Compare with ||
function greetWithOr(name: string | null): string {
  const displayName = name || "Guest";  // Falls back for any falsy
  return `Hello, ${displayName}!`;
}

console.log(greetWithOr(""));  // "Hello, Guest!" (different behavior)

// --- TYPED ARRAYS: Proper Empty Checks ---

function getFirstItem<T>(items: T[]): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items[0];
}

// TypeScript tracks the return type correctly
const first = getFirstItem([0, 1, 2]);  // number | undefined
if (first !== undefined) {
  console.log(`First item: ${first}`);  // Works with 0!
}

// --- OPTIONAL CHAINING (?.) ---

interface UserProfile {
  name: string;
  address?: {
    city?: string;
  };
}

function getCity(user: UserProfile): string {
  // Safe navigation - no runtime error if address is undefined
  return user.address?.city ?? "Unknown";
}

const user1: UserProfile = { name: "Alice", address: { city: "NYC" } };
const user2: UserProfile = { name: "Bob" };

console.log(getCity(user1));  // "NYC"
console.log(getCity(user2));  // "Unknown"

// --- EXHAUSTIVE CHECKS WITH never ---

type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "Waiting for review...";
    case "approved":
      return "Your request was approved!";
    case "rejected":
      return "Sorry, your request was rejected.";
    default:
      // If you add a new status, TypeScript will error here!
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}

// ============================================================================
// KEY BENEFITS:
// 1. Union types (string | null) make nullability explicit
// 2. TypeScript forces explicit null checks before accessing values
// 3. ?? (nullish coalescing) correctly handles 0 and ""
// 4. ?. (optional chaining) safely navigates nested properties
// 5. Exhaustive switches ensure all cases are handled
// ============================================================================

