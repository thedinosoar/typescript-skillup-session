# TypeScript Skill-Up Session

A comprehensive TypeScript training curriculum for developers transitioning from JavaScript. Each topic has a JavaScript file showing bugs/ambiguities, paired with a TypeScript file demonstrating how types prevent those issues.

## Setup

```bash
pnpm install
```

## Curriculum Structure

| # | Topic | JS File (Bugs) | TS File (Solutions) |
|---|-------|----------------|---------------------|
| 00 | Overview | `00-overview.js` | `00-overview.ts` |
| 01 | Basics: Variables & Equality | `01-basics.js` | `01-basics.ts` |
| 02 | Functions | `02-functions.js` | `02-functions.ts` |
| 03 | Objects & Arrays | `03-objects-and-arrays.js` | `03-objects-and-arrays.ts` |
| 04 | Control Flow & Truthiness | `04-control-flow-and-truthiness.js` | `04-control-flow-and-truthiness.ts` |
| 05 | Classes & Modules | `05-classes-and-modules.js` | `05-classes-and-modules.ts` |
| 06 | Intro to TypeScript Syntax | `06-intro-to-typescript.js` | `06-intro-to-typescript.ts` |
| 07 | Interfaces & Type Aliases | `07-interfaces-and-type-aliases.js` | `07-interfaces-and-type-aliases.ts` |
| 08 | Union Types & Narrowing | `08-union-types-and-narrowing.js` | `08-union-types-and-narrowing.ts` |
| 09 | Generics (Lite) | `09-generics-lite.js` | `09-generics-lite.ts` |
| 10 | Promises & Async | `10-promises-and-async.js` | `10-promises-and-async.ts` |
| 11 | Gradual Migration | `11-gradual-migration.js` | `11-gradual-migration.ts` + `.d.ts` |
| 12 | End-to-End Example | `12-end-to-end.js` | `12-end-to-end.ts` |
| 99 | Advanced: Route Types | — | `99-advanced-route-types.ts` |

## Session Planning

### Core Curriculum (00-08)
**Time: ~45-60 minutes**

Covers fundamental concepts that every TypeScript developer needs:
- Type annotations and inference
- Functions with typed parameters/returns
- Objects, arrays, and interfaces
- Null/undefined handling
- Union types and narrowing

> **Stopping point:** If time is short, stop after 08. Attendees will have a solid mental model.

### Advanced Topics (09-12)
**Time: ~30-45 minutes**

Bonus material for longer sessions or Q&A:
- Generics (the "write once, types everywhere" pattern)
- Typed async/await and API responses
- Migrating existing JavaScript codebases
- Real-world refactoring demonstrations

### Mind-Blowing Bonus (99)
**Time: 10-15 minutes**

For audiences who want to see TypeScript's full power:
- Type-level string parsing (template literal types)
- How modern frameworks achieve zero-codegen type safety
- "Turing-complete types" in action

## Running Examples

### JavaScript files
```bash
node examples/javascript/01-basics.js
```

### TypeScript files

First compile, then run:
```bash
pnpm build
node dist/01-basics.js
```

Or compile in watch mode while you work:
```bash
pnpm build:watch
```

### Quick single-file compilation
```bash
npx tsc examples/typescript/01-basics.ts --outDir dist
```

## Topic Summaries

### 00-overview
**What is JavaScript? What is TypeScript?**
- TypeScript = JavaScript + static types (no runtime change)
- Shows a runtime error in JS that TS catches at compile time

### 01-basics
**Variables, Types, and Equality**
- `var` vs `let` vs `const`
- Primitive types: numbers, strings, booleans
- Loose vs strict equality (`==` vs `===`)
- Type annotations make intent obvious

### 02-functions
**Function Syntax and Type Safety**
- Regular functions vs arrow functions
- Optional parameters (`param?: string`)
- Default parameters
- Return type enforcement
- Catching wrong argument counts

### 03-objects-and-arrays
**Object Shapes and Array Types**
- Object type definitions
- Catching property name typos
- Array types (`number[]`, `Array<string>`)
- Typed `map`/`filter` operations

### 04-control-flow-and-truthiness
**Null Handling and Truthiness**
- JavaScript's falsy values (0, "", null, undefined)
- Union types (`string | null`)
- Nullish coalescing (`??`) vs OR (`||`)
- Optional chaining (`?.`)

### 05-classes-and-modules
**Classes with Visibility Modifiers**
- Typed fields and constructors
- `public`, `private`, `readonly`
- Parameter properties (constructor shorthand)
- ES module exports with types

### 06-intro-to-typescript
**Core TypeScript Concepts**
- Basic types: `string`, `number`, `boolean`, `any`, `unknown`
- `noImplicitAny` and explicit typing
- `any` vs `unknown` (forcing type narrowing)

### 07-interfaces-and-type-aliases
**Defining Object Contracts**
- `interface User { id: number; name: string }`
- `type` aliases for unions and intersections
- Reusing interfaces across functions
- Safe refactoring: rename property → all usages flagged

### 08-union-types-and-narrowing
**Multiple Types, Safe Handling**
- Union types: `id: string | string[]`
- Type narrowing with `typeof`, `Array.isArray`, equality
- Discriminated unions (tagged unions)
- Exhaustive `switch` statements

### 09-generics-lite
**Reusable Type-Safe Utilities**
- Generic functions: `function wrap<T>(value: T)`
- Type inference at call sites
- Constraints: `<T extends HasLength>`
- `keyof` for type-safe property access

### 10-promises-and-async
**Typed Async Operations**
- Defining API response interfaces
- `Promise<Todo[]>` return types
- Catching property typos in responses
- Discriminated unions for success/error handling

### 11-gradual-migration
**Adding Types to Legacy JavaScript**
- Creating `.d.ts` declaration files
- Using `any` as an escape hatch (temporarily)
- Type assertions (`as Type`)
- Union types for legacy data shapes

### 12-end-to-end
**Complete App Example**
- Real-world order processing scenario
- 10+ intentional bugs in JS version
- TS version catches all at compile time
- Refactoring demo: rename a property and fix all usages

### 99-advanced-route-types
**Type-Level String Parsing (Bonus)**
- Parses `/users/:userId/posts/:postId` at the **type level**
- Extracts parameter names as a union type
- Builds typed parameter objects automatically
- Demonstrates template literal types and conditional types
- Shows how libraries like tRPC/Hono achieve end-to-end type safety

## Key Takeaways

1. **TypeScript catches bugs at compile time** - Before your code runs
2. **Types are documentation** - Self-documenting code with IDE support
3. **Refactoring is safe** - Change a type, find all affected code
4. **Gradual adoption** - Add types incrementally to existing JS
5. **No runtime cost** - Types are erased when compiled to JavaScript
