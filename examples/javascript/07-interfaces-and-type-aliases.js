// ============================================================================
// 07-INTERFACES-AND-TYPE-ALIASES: JavaScript Objects Without Contracts
// ============================================================================
// DEMO: Functions expecting "similar" objects with slightly different shapes
// ============================================================================

// In JavaScript, we have no way to define what a "User" looks like.
// Different functions might expect different properties...

// --- FUNCTION 1: Creates a user display string ---

function formatUserDisplay(user) {
  // Expects: { name, email }
  return `${user.name} <${user.email}>`;
}

// --- FUNCTION 2: Logs user activity ---

function logUserActivity(user, action) {
  // Expects: { id, name, timestamp? }
  const time = user.timestamp || new Date().toISOString();
  console.log(`[${time}] User ${user.id} (${user.name}): ${action}`);
}

// --- FUNCTION 3: Calculates user age ---

function calculateUserAge(user) {
  // Expects: { name, birthDate }
  const birth = new Date(user.birthDate);
  const now = new Date();
  return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

// --- FUNCTION 4: Sends notification ---

function sendNotification(user, message) {
  // Expects: { email?, phone?, name }
  // At least one of email or phone should exist...
  if (user.email) {
    console.log(`Email to ${user.email}: ${message}`);
  } else if (user.phone) {
    console.log(`SMS to ${user.phone}: ${message}`);
  } else {
    console.log(`No contact method for ${user.name}`);
  }
}

// --- THE PROBLEM: INCONSISTENT USAGE ---

// We create a user object...
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

// Some functions work:
console.log(formatUserDisplay(user));  // "Alice <alice@example.com>" ✅
logUserActivity(user, "logged in");     // Works ✅
sendNotification(user, "Hello!");       // Works ✅

// But this fails silently:
console.log(calculateUserAge(user));    // NaN 🐛 (no birthDate!)

// --- DIFFERENT "USER" SHAPES ---

const userFromApi = {
  userId: 1,          // Different property name!
  fullName: "Bob",    // Different property name!
  contactEmail: "bob@example.com",  // Different property name!
};

// These all fail or produce wrong results:
console.log(formatUserDisplay(userFromApi));  // "undefined <undefined>" 🐛
logUserActivity(userFromApi, "clicked");       // "User undefined (undefined)" 🐛

// --- PROPERTY EXPECTATIONS ARE INVISIBLE ---

function createUserSummary(user) {
  // What properties does this function expect?
  // You have to read the implementation to find out!
  return {
    display: `${user.firstName} ${user.lastName}`,
    isAdult: user.age >= 18,
    memberSince: new Date(user.joinDate).getFullYear(),
    isPremium: user.subscription?.tier === "premium",
  };
}

// Calling with wrong shape:
const wrongUser = { name: "Carol", age: 25 };
const summary = createUserSummary(wrongUser);
console.log(summary);
// { display: "undefined undefined", isAdult: true, memberSince: NaN, isPremium: false }
// 🐛 Partial success, partial failure - the worst kind of bug!

// --- REFACTORING NIGHTMARE ---

// If we decide to rename 'email' to 'emailAddress' in our user objects,
// how do we find all the places that use 'email'?
// Answer: You can't. You have to search and hope.

// ============================================================================
// KEY PROBLEMS:
// 1. No single source of truth for what a "User" is
// 2. Functions expect different properties - no consistency
// 3. Property name expectations are hidden in implementation
// 4. Wrong shapes cause silent failures (undefined, NaN)
// 5. Refactoring is dangerous - no compiler to find usages
// ============================================================================

