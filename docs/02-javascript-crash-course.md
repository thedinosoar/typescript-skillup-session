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

JavaScript is single-threaded but async via:

* Call stack
* Event loop
* Microtasks (Promises)
* Macrotasks (Timers, I/O)

```js
console.log(1);
promise.then(() => console.log(2));
console.log(3);
// 1, 3, 2
```

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
