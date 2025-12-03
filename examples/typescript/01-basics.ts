// TypeScript Example - With type checking

function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("World"));
// console.log(greet(42)); // TypeScript Error: Argument of type 'number' is not assignable to parameter of type 'string'

