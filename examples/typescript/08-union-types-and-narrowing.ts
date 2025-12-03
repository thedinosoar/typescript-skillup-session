// ============================================================================
// 08-UNION-TYPES-AND-NARROWING: Type-Safe Unions in TypeScript
// ============================================================================
// DEMO: Union types, type guards, narrowing, discriminated unions
// ============================================================================

// --- UNION TYPES: Declare Multiple Possible Types ---

// This function accepts a single string ID or an array of string IDs
function processIds(ids: string | string[]): string[] {
  if (Array.isArray(ids)) {
    // TypeScript KNOWS ids is string[] here
    console.log(`Processing ${ids.length} IDs:`, ids);
    return ids.map((id) => `processed-${id}`);
  } else {
    // TypeScript KNOWS ids is string here
    console.log(`Processing single ID:`, ids);
    return [`processed-${ids}`];
  }
}

console.log(processIds("abc123"));           // ["processed-abc123"] ✅
console.log(processIds(["id1", "id2"]));     // ["processed-id1", "processed-id2"] ✅

// These are compile-time errors:
// processIds(123);              // ❌ Error: number is not assignable
// processIds({ id: "abc" });    // ❌ Error: object is not assignable
// processIds(null);             // ❌ Error: null is not assignable

// --- TYPE NARROWING WITH typeof ---

function getLength(value: string | number[] | null): number {
  if (value === null) {
    return 0;
  }
  // After null check, TypeScript knows value is string | number[]
  return value.length;  // Both string and array have .length ✅
}

console.log(getLength("hello"));   // 5 ✅
console.log(getLength([1, 2, 3])); // 3 ✅
console.log(getLength(null));      // 0 ✅

// --- NARROWING WITH typeof ---

function double(value: string | number): string | number {
  if (typeof value === "number") {
    return value * 2;  // TypeScript knows it's a number
  }
  return value + value;  // TypeScript knows it's a string
}

console.log(double(5));      // 10 ✅
console.log(double("ab"));   // "abab" ✅

// --- DISCRIMINATED UNIONS: The Power Pattern ---

// Use a common "tag" property to distinguish types
interface SuccessResponse {
  success: true;  // Literal type!
  data: {
    id: number;
    name: string;
  };
}

interface ErrorResponse {
  success: false;  // Literal type!
  error: string;
  code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleApiResponse(response: ApiResponse): void {
  if (response.success) {
    // TypeScript KNOWS this is SuccessResponse
    console.log("Data:", response.data.name);
    // response.error would be an error here!
  } else {
    // TypeScript KNOWS this is ErrorResponse
    console.log(`Error ${response.code}:`, response.error);
    // response.data would be an error here!
  }
}

handleApiResponse({ success: true, data: { id: 1, name: "Alice" } });
handleApiResponse({ success: false, error: "Not found", code: 404 });

// Malformed responses are caught at compile time:
// handleApiResponse({ success: true });  // ❌ Error: missing 'data'
// handleApiResponse({ success: false }); // ❌ Error: missing 'error', 'code'

// --- USER DISPLAY WITH PROPER UNION ---

interface SimpleUser {
  kind: "simple";
  name: string;
}

interface DetailedUser {
  kind: "detailed";
  firstName: string;
  lastName: string;
}

type User = SimpleUser | DetailedUser;

function getUserDisplay(user: User): string {
  switch (user.kind) {
    case "simple":
      return user.name;  // TypeScript knows this is SimpleUser
    case "detailed":
      return `${user.firstName} ${user.lastName}`;  // TypeScript knows this is DetailedUser
  }
}

console.log(getUserDisplay({ kind: "simple", name: "Alice" }));  // "Alice"
console.log(getUserDisplay({ kind: "detailed", firstName: "Bob", lastName: "Smith" }));  // "Bob Smith"

// --- NULLABLE TYPES: Explicit null Handling ---

function processOptional(value: string | null | undefined): string {
  // Must handle null and undefined explicitly
  if (value == null) {  // == null catches both null and undefined
    return "default";
  }
  return value.toUpperCase();
}

console.log(processOptional("hello"));    // "HELLO"
console.log(processOptional(null));       // "default"
console.log(processOptional(undefined));  // "default"

// --- CUSTOM TYPE GUARDS ---

interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

// Custom type guard function
function isDog(animal: Cat | Dog): animal is Dog {
  return "bark" in animal;
}

function makeSound(animal: Cat | Dog): void {
  if (isDog(animal)) {
    animal.bark();  // TypeScript knows it's a Dog
  } else {
    animal.meow();  // TypeScript knows it's a Cat
  }
}

// --- THE 'in' OPERATOR FOR NARROWING ---

interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "circle":
      return Math.PI * shape.radius ** 2;
  }
}

console.log(getArea({ kind: "square", size: 5 }));      // 25
console.log(getArea({ kind: "circle", radius: 3 }));    // ~28.27

// ============================================================================
// KEY BENEFITS:
// 1. Union types (A | B) declare exactly what's allowed
// 2. TypeScript tracks narrowing through conditionals
// 3. Array.isArray, typeof, === work as type guards
// 4. Discriminated unions (with "kind" tags) are super powerful
// 5. null/undefined must be handled explicitly
// 6. Custom type guards (is Type) for complex checks
// ============================================================================

