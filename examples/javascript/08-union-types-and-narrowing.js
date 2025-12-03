// ============================================================================
// 08-UNION-TYPES-AND-NARROWING: Handling Multiple Types in JavaScript
// ============================================================================
// DEMO: Functions accepting multiple types, messy runtime checks
// ============================================================================

// --- FUNCTION ACCEPTING "ID OR IDS" ---

// This function should work with a single ID or an array of IDs
// JavaScript requires messy runtime checks with no guarantees

function processIds(ids) {
  // Is it a single ID or an array? We have to check at runtime!
  if (Array.isArray(ids)) {
    console.log(`Processing ${ids.length} IDs:`, ids);
    return ids.map((id) => `processed-${id}`);
  } else {
    console.log(`Processing single ID:`, ids);
    return [`processed-${ids}`];
  }
}

console.log(processIds("abc123"));           // ["processed-abc123"] ✅
console.log(processIds(["id1", "id2"]));     // ["processed-id1", "processed-id2"] ✅

// But nothing stops these:
console.log(processIds(123));                // ["processed-123"] - is number ok? 🤔
console.log(processIds({ id: "abc" }));      // ["processed-[object Object]"] 🐛
console.log(processIds(null));               // Crashes or weird behavior 🐛

// --- BUGGY CONDITIONALS ---

function getUserDisplay(user) {
  // User might have different shapes depending on source
  // Some have 'name', some have 'firstName' + 'lastName'
  
  if (user.name) {
    return user.name;
  } else if (user.firstName) {
    return `${user.firstName} ${user.lastName}`;
  } else {
    return "Unknown User";
  }
}

// Works with some data:
console.log(getUserDisplay({ name: "Alice" }));  // "Alice" ✅
console.log(getUserDisplay({ firstName: "Bob", lastName: "Smith" }));  // "Bob Smith" ✅

// But edge cases cause issues:
console.log(getUserDisplay({ firstName: "Carol" }));  // "Carol undefined" 🐛
console.log(getUserDisplay({ name: "" }));  // "Unknown User" 🐛 (empty string is falsy!)
console.log(getUserDisplay(null));  // TypeError! 🐛

// --- HANDLING NULLABLE VALUES ---

function getLength(value) {
  // Value might be a string, array, or null/undefined
  if (value) {
    return value.length;
  }
  return 0;
}

console.log(getLength("hello"));   // 5 ✅
console.log(getLength([1, 2, 3])); // 3 ✅
console.log(getLength(null));      // 0 ✅
console.log(getLength(""));        // 0 🐛 (empty string is falsy, but length is 0 anyway!)
console.log(getLength([]));        // 0 ✅ (works by accident!)

// But:
console.log(getLength(123));       // undefined 🐛 (numbers don't have .length)
console.log(getLength({ length: "not a number" }));  // "not a number" 🐛

// --- DISCRIMINATED UNIONS (MESSY IN JS) ---

// API responses might have different shapes for success vs error
function handleApiResponse(response) {
  if (response.success) {
    console.log("Data:", response.data);
    return response.data;
  } else {
    console.log("Error:", response.error);
    throw new Error(response.error);
  }
}

// Works when data is correct:
handleApiResponse({ success: true, data: { id: 1, name: "Alice" } });
handleApiResponse({ success: false, error: "Not found" });

// But what about malformed responses?
handleApiResponse({ success: true });  // "Data: undefined" 🐛
handleApiResponse({ success: false }); // "Error: undefined", throws Error("undefined") 🐛
handleApiResponse({});                  // Goes to else branch, throws Error(undefined) 🐛

// --- TYPE CONFUSION ---

function addOrConcat(a, b) {
  // Should this add numbers or concat strings?
  // JavaScript will "helpfully" figure it out... wrong
  return a + b;
}

console.log(addOrConcat(5, 3));        // 8 ✅
console.log(addOrConcat("foo", "bar")); // "foobar" ✅
console.log(addOrConcat(5, "3"));       // "53" 🐛 (wanted 8!)
console.log(addOrConcat("5", 3));       // "53" 🐛

// ============================================================================
// KEY PROBLEMS:
// 1. No way to declare "this accepts A or B but nothing else"
// 2. Runtime checks are verbose and error-prone
// 3. Falsy value checks miss edge cases (0, "")
// 4. No help for discriminated unions (success/error patterns)
// 5. Type coercion causes silent bugs
// ============================================================================

