// JavaScript Example - No type checking

function greet(name) {
  return `Hello, ${name}!`;
}

// This works in JS but could cause runtime issues
console.log(greet("World"));
console.log(greet(42)); // No error in JS, but probably not intended

