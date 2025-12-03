# JavaScript Crash Course

A fast, practical overview of modern JavaScript for people coming from C#, PHP, C++, or older web stacks. Highlight the quirks, the gotchas, and the mental models.

---

## **1. JavaScript Types**

JavaScript has *seven* primitive types:

* `string`
* `number` (no int/float distinction)
* `boolean`
* `null`
* `undefined`
* `symbol`
* `bigint`

And **one non‑primitive**:

* `object`

### **Yes, this means:**

* Arrays are objects.
* Functions are objects.
* Dates are objects.
* Objects are objects.
* And `typeof null === "object"` (historic bug — never fixed).

---

## **2. Everything Is an Object (Except Primitives)**

### **Arrays**

```js
const arr = [1, 2, 3];
arr.push(4);            // works
arr.customProp = "hi"; // also works, it's just an object
```

### **Functions**

```js
function fn() {}
fn.meta = "you can attach properties";
```

Objects can mutate at any time, anywhere.

---

## **3. Equality: `==` vs `===`**

### **Strict equality (`===`) behaves as expected.**

### **Loose equality (`==`) performs aggressive coercion.**

```js
0 == "0"        // true
0 == []          // true
0 == false       // true
"" == false     // true
null == undefined // true
```

Use **`===` always** unless you *extremely* know what you're doing.

---

## **4. Truthy & Falsy Values**

JavaScript's **falsy** values:

* `0`
* `-0`
* `""` (empty string)
* `null`
* `undefined`
* `false`
* `NaN`

Everything else is truthy, including:

* `[]`
* `{}`
* `"0"`
* `"false"`
* any function
* any object

```js
if ([]) console.log("runs");
if ({}) console.log("runs");
```

This leads to subtle bugs.

---

## **5. `null` vs `undefined`**

* `undefined` = JavaScript's default "nothing".
* `null` = intentional "nothing".

But they're loosely equal:

```js
null == undefined // true
```

---

## **6. Functions Are Extremely Flexible**

JavaScript does not enforce arity.

```js
function add(a, b) { return a + b; }
add(1);           // NaN
add(1, 2, 3);     // 3 (extra args ignored)
```

Default parameters exist:

```js
function greet(name = "world") {}
```

---

## **7. Objects Expand Forever**

JavaScript objects are dictionaries. You can add/remove fields at any time.

```js
const user = { name: "A" };
user.age = 30;
delete user.name;
```

No compiler checks.

---

## **8. Prototypes (The Inheritance Model)**

JavaScript doesn't have classical inheritance under the hood — it uses prototype chains.

```js
const base = { a: 1 };
const child = Object.create(base);
child.b = 2;
```

Accessing `child.a` walks the prototype chain.

This is the core mechanism behind classes, arrays, functions, and almost everything.

---

## **9. `this` Is Context-Dependent**

`this` does **not** mean the same thing it means in C# or Java.

```js
const obj = {
  name: "A",
  getName() { return this.name; }
};

const fn = obj.getName;
fn(); // undefined (or global)
```

Arrow functions fix this by capturing outer `this`.

---

## **10. Implicit Conversions Get Weird**

JavaScript will try aggressively to convert types.

```js
1 + "1"   // "11"
1 + true   // 2
[] + []    // ""
[] + {}    // "[object Object]"
{} + []    // 0 (yes, really)
```

---

## **11. Floating Point Math**

JavaScript uses IEEE 754 doubles.

```js
0.1 + 0.2 === 0.3 // false
```

---

## **12. `NaN` is… weird**

* `NaN` means "Not a Number"
* But it's a `number`
* And it’s the only value that is **not equal to itself**

```js
NaN === NaN // false
```

---

## **13. Passing by Reference vs Value**

* Primitives: passed by value
* Objects & arrays: passed by reference

```js
function mutate(user) { user.name = "changed"; }
```

---

## **14. Event Loop & Async Nature**

### **Single-Threaded Execution**

JavaScript runs on a **single thread** — there's only one call stack, and only one thing can execute at a time. Unlike C# or Java, there are no background threads running your code in parallel.

```js
// These run sequentially, blocking each other
heavyComputation();  // blocks until done
anotherFunction();   // can't start until the above finishes
```

So how does JavaScript handle async operations without freezing the browser? The answer is the **event loop**.

### **The Call Stack**

The call stack tracks what function is currently executing. When you call a function, it's pushed onto the stack. When it returns, it's popped off.

```js
function a() { b(); }
function b() { c(); }
function c() { console.log("hi"); }
a();
// Stack: a → b → c → (empty)
```

If the stack is busy, nothing else can run — the UI freezes, clicks don't register.

### **The Event Loop**

The event loop is JavaScript's secret weapon. It continuously checks: *"Is the call stack empty? If yes, grab the next task from the queue."*

```
┌─────────────────────────────┐
│         Call Stack          │  ← JS runs code here (one thing at a time)
└─────────────────────────────┘
              ↑
              │ (when empty, pull from queues)
              │
┌─────────────────────────────┐
│   Microtask Queue           │  ← Promises, queueMicrotask() [HIGH PRIORITY]
└─────────────────────────────┘
              │
┌─────────────────────────────┐
│   Macrotask Queue           │  ← setTimeout, setInterval, I/O [LOWER PRIORITY]
└─────────────────────────────┘
```

### **Async Operations Don't Block**

When you call `setTimeout` or `fetch`, the browser/Node handles the waiting *outside* of JavaScript. When the result is ready, a callback is queued.

```js
console.log("1");
setTimeout(() => console.log("2"), 0);  // queued as macrotask
Promise.resolve().then(() => console.log("3"));  // queued as microtask
console.log("4");

// Output: 1, 4, 3, 2
// Why? Microtasks (Promises) run before macrotasks (setTimeout)
```

### **Why This Matters**

* **Long-running sync code blocks everything** — avoid heavy loops on the main thread.
* **Promises resolve before timers** — microtasks have priority.
* **"0ms" setTimeout isn't instant** — it just means "next macrotask cycle."
* **async/await is syntactic sugar** — it's still using Promises and the event loop under the hood.

### **What About Web Workers?**

If you truly need parallel execution, **Web Workers** let you spawn background threads. But they run in isolation — no DOM access, and you typically communicate via message passing (`postMessage`). They're useful for CPU-heavy tasks like image processing or complex calculations, but they're a separate concept from the event loop.

For advanced use cases, **SharedArrayBuffer** allows actual shared memory between threads. Combined with **Atomics** for synchronization, you can build lock-free data structures and true parallel algorithms. However, due to security concerns (Spectre), SharedArrayBuffer requires specific HTTP headers (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`) to be enabled.

---

## **15. Modules**

ES modules:

```js
export function x() {}
import { x } from "./file.js";
```

CommonJS:

```js
module.exports = {}
const lib = require("lib")
```

---

## **16. Summary Line for Presentation**

> JavaScript is powerful, but extremely permissive.
> If you don’t put guardrails around it, it will absolutely let you drive off a cliff.

Use TypeScript to impose structure on top of this chaos.
