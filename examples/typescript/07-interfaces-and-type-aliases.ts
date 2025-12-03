// ============================================================================
// 07-INTERFACES-AND-TYPE-ALIASES: Defining Contracts in TypeScript
// ============================================================================
// DEMO: interface, type aliases, reusability, refactoring safety
// ============================================================================

// --- INTERFACE: Define the Shape of a User ---

interface User {
  id: number;
  name: string;
  email: string;
  birthDate?: Date;  // Optional
  phone?: string;    // Optional
}

// Now ALL functions agree on what a User looks like!

// --- FUNCTIONS USING THE SAME INTERFACE ---

function formatUserDisplay(user: User): string {
  return `${user.name} <${user.email}>`;
}

function logUserActivity(user: User, action: string): void {
  console.log(`[${new Date().toISOString()}] User ${user.id} (${user.name}): ${action}`);
}

function calculateUserAge(user: User): number | null {
  if (!user.birthDate) {
    return null;  // Explicitly handle missing birthDate
  }
  const birth = new Date(user.birthDate);
  const now = new Date();
  return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

function sendNotification(user: User, message: string): void {
  if (user.email) {
    console.log(`Email to ${user.email}: ${message}`);
  } else if (user.phone) {
    console.log(`SMS to ${user.phone}: ${message}`);
  } else {
    console.log(`No contact method for ${user.name}`);
  }
}

// --- TYPE ALIASES: Alternative Way to Define Types ---

// 'type' can do everything 'interface' can, plus more
type UserId = number;  // Simple alias

type UserRole = "admin" | "editor" | "viewer";  // Union of literals

type UserWithRole = User & { role: UserRole };  // Intersection type

// --- WHEN TO USE INTERFACE vs TYPE ---

// Use 'interface' for object shapes (can be extended, merged)
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Use 'type' for unions, intersections, primitives
type StringOrNumber = string | number;
type Nullable<T> = T | null;

// --- REUSING INTERFACES ACROSS FUNCTIONS ---

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  birthDate: new Date("1990-05-15"),
};

// All functions work with the same user shape:
console.log(formatUserDisplay(user));     // "Alice <alice@example.com>" ✅
logUserActivity(user, "logged in");        // Works ✅
console.log(calculateUserAge(user));       // 34 (or similar) ✅
sendNotification(user, "Hello!");          // Works ✅

// --- COMPILE-TIME ERROR FOR WRONG SHAPE ---

// const badUser: User = {
//   userId: 1,       // ❌ Error: Object literal may only specify known properties
//   fullName: "Bob", // ❌ 'fullName' does not exist in type 'User'
// };

// --- REFACTORING SAFETY: Rename a Property ---

// If you rename 'email' to 'emailAddress' in the interface...
// TypeScript immediately shows errors at EVERY usage site!

// Try it: Change 'email: string' to 'emailAddress: string' in User
// and watch the red squiggles appear everywhere 'email' is used.

// --- EXTENDING INTERFACES ---

interface AdminUser extends User {
  permissions: string[];
  department: string;
}

const admin: AdminUser = {
  id: 2,
  name: "Carol",
  email: "carol@example.com",
  permissions: ["create_user", "delete_user", "view_reports"],
  department: "Engineering",
};

// AdminUser has all User properties plus its own
console.log(formatUserDisplay(admin));  // Works! AdminUser is compatible with User

// --- PARTIAL AND REQUIRED UTILITY TYPES ---

// Make all properties optional (for updates)
type UserUpdate = Partial<User>;

const update: UserUpdate = {
  name: "Alice Smith",  // Only update name
};

// Make all properties required (remove optionals)
type CompleteUser = Required<User>;

// --- READONLY PROPERTIES ---

interface ImmutableUser {
  readonly id: number;
  readonly name: string;
  email: string;  // This can still be changed
}

const immutableUser: ImmutableUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

// immutableUser.id = 2;  // ❌ Error: Cannot assign to 'id' because it is read-only
immutableUser.email = "new@example.com";  // ✅ OK

// ============================================================================
// KEY BENEFITS:
// 1. Single source of truth for object shapes
// 2. All functions agree on what a "User" is
// 3. Optional properties are explicit (?)
// 4. Refactoring is safe - rename in one place, fix all errors
// 5. Interfaces can extend each other for specialization
// 6. Utility types (Partial, Required, Readonly) add flexibility
// ============================================================================

