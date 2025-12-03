// ============================================================================
// 06-INTRO-TO-TYPESCRIPT: JavaScript Version (No Types)
// ============================================================================
// DEMO: Same logic as the TS file, but with hidden bugs due to no types
// ============================================================================

// This file shows JavaScript code that works... until it doesn't.
// The TypeScript version shows how types prevent these issues.

// --- A FUNCTION THAT ACCEPTS "ANY" DATA ---

function processUserData(user) {
  // We ASSUME user has certain properties...
  console.log(`Processing user: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Age: ${user.age}`);
  
  if (user.isAdmin) {
    console.log("User is an administrator!");
  }
  
  return {
    displayName: user.name.toUpperCase(),
    contact: user.email,
    adult: user.age >= 18,
  };
}

// This works as expected:
const result1 = processUserData({
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  isAdmin: true,
});
console.log(result1);
// { displayName: "ALICE", contact: "alice@example.com", adult: true }

// --- BUG: Passing wrong shape object ---

// What if someone passes a different object shape?
const result2 = processUserData({
  firstName: "Bob",      // Wrong property name! (should be 'name')
  emailAddress: "bob@x", // Wrong property name! (should be 'email')
  birthYear: 1990,       // Wrong property! (expected 'age')
});
// Output:
// "Processing user: undefined"
// "Email: undefined"
// "Age: undefined"
// TypeError: Cannot read properties of undefined (reading 'toUpperCase')
// 🐛 RUNTIME ERROR!

// --- NO PROTECTION AT FUNCTION BOUNDARIES ---

function sendEmail(to, subject, body) {
  console.log(`Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
}

// Nothing stops these mistakes:
sendEmail("alice@example.com", "Hello");  // Missing body 🐛
sendEmail({ email: "bob@x" }, "Hi", "Test");  // Wrong type for 'to' 🐛
sendEmail(null, null, null);  // All nulls 🐛

// --- IMPLICIT ANY EVERYWHERE ---

function calculate(a, b, operation) {
  // What are a and b? Numbers? Strings? Objects?
  // What is operation? A string? A function?
  
  if (operation === "add") {
    return a + b;  // Works for numbers, concatenates strings!
  }
  if (operation === "multiply") {
    return a * b;  // NaN if not numbers!
  }
  return null;
}

console.log(calculate(5, 3, "add"));       // 8 ✅
console.log(calculate("5", "3", "add"));   // "53" 🐛 (string concat!)
console.log(calculate(5, 3, "divide"));    // null (missing operation)
console.log(calculate({}, [], "add"));     // "[object Object]" 🐛

// --- UNKNOWN DATA FROM EXTERNAL SOURCES ---

async function fetchUserFromApi(userId) {
  // Pretend this fetches from an API
  const response = { id: userId, name: "Alice", age: "thirty" };  // age is string!
  
  // We assume the response structure, but what if the API changes?
  // What if 'age' is sometimes a string, sometimes a number?
  
  if (response.age >= 18) {  // 🐛 "thirty" >= 18 is false (string comparison)
    console.log("Adult user");
  } else {
    console.log("Minor user");  // This gets printed! Wrong!
  }
  
  return response;
}

fetchUserFromApi(1);

// ============================================================================
// KEY PROBLEMS:
// 1. Functions accept ANY data - no shape enforcement
// 2. Wrong property names silently produce undefined
// 3. Missing arguments don't cause errors
// 4. Operations on wrong types fail at runtime
// 5. API responses are trusted blindly
// ============================================================================

