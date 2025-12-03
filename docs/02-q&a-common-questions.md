# Q&A — Common Questions People Will Ask

Prepared, concise answers you can give during the talk.

---

## **Q1: “How are functions objects?”**

**A:** In JavaScript, functions are callable objects. They have properties, can be passed around, stored in variables, and even mutated.

```js
function fn() {}
fn.meta = "data";
```

The engine treats them as objects with an internal `[[Call]]` slot.

---

## **Q2: “Why is typeof null === 'object'?”**

**A:** It’s a 30-year-old bug in the original spec. Fixing it would break the web. `null` is a primitive, but `typeof` reports `object` for historical reasons.

---

## **Q3: “Why does == do weird stuff?”**

**A:** `==` performs type coercion with complex rules from the 90s. `===` compares without coercion. Use `===` unless you enjoy pain.

---

## **Q4: “Are arrays actually objects?”**

**A:** Yes. Arrays are objects with numeric keys and a special `length` property. You can even attach custom fields.

```js
const a = [1,2,3];
a.foo = 123;
```

---

## **Q5: “What’s the real difference between null and undefined?”**

**A:** `undefined` means "missing / not provided". `null` means "intentionally empty". JavaScript mixes them loosely, so TS forces you to be explicit.

---

## **Q6: “What does truthy and falsy actually mean?”**

**A:** In an `if` check, JavaScript coerces values to boolean. `0`, `""`, `null`, `undefined`, `false`, and `NaN` are falsy. Everything else is truthy.

---

## **Q7: “Why can functions accept any number of arguments?”**

**A:** JavaScript doesn’t enforce arity. Extra arguments are ignored; missing ones become `undefined`.

```js
function x(a, b) {}
x(1);
x(1,2,3);
```

---

## **Q8: “Why can objects have random properties added?”**

**A:** Objects are mutable dictionaries. The language allows adding, removing, and changing properties at runtime. This flexibility is why TypeScript exists.

---

## **Q9: “What is the deal with NaN not being equal to itself?”**

**A:** IEEE floating‑point spec: `NaN` represents an invalid number, so it’s not equal to anything—including itself.

```js
NaN === NaN // false
```

---

## **Q10: “Why does 0.1 + 0.2 !== 0.3?”**

**A:** Floating‑point precision. JavaScript uses IEEE 754 doubles; 0.1 and 0.2 cannot be represented exactly.

---

## **Q11: “How does async actually work if JS is single-threaded?”**

**A:** JavaScript has an event loop. Async operations register callbacks. When the call stack is clear, the event loop runs queued microtasks/macrotasks.

---

## **Q12: “Why does calling a method detach ‘this’?”**

**A:** `this` is determined by how a function is *called*, not where it’s defined.

```js
const f = obj.method;
f(); // 'this' lost
```

Arrow functions fix this by capturing the outer scope.

---

## **Q13: “Why does [] == ![] evaluate to true?”**

**A:** Loose equality performs coercion:

1. `![]` → `false`
2. `[] == false`
3. `[]` coerces to `""`
4. `"" == false` → `true`
   Use `===` to avoid this madness.

---

## **Q14: “Why do people say JS is weird?”**

**A:** Because it was built in 10 days and optimized for convenience, not clarity. The language evolved organically.

---

## **Q15: “So what does TypeScript actually fix?”**

**A:** It adds:

* real types
* compile‑time checks
* autocomplete you can trust
* safer refactoring
* guaranteed function signatures
* enforcement against silent failures

JS stays flexible, TS adds safety.

---

## **Q16: “Is TypeScript slower?”**

**A:** No. TS is erased at compile time. The runtime code is plain JS. TS affects *development*, not *execution*.

---

## **Q17: “Can TypeScript understand dynamic values from APIs?”**

**A:** Yes—you define the shape you expect. If the server changes unexpectedly, the compiler forces you to handle it.

---

## **Q18: “Why do people say you can write TypeScript gradually?”**

**A:** Because `.js` and `.ts` can coexist. You can add types where you feel pain and leave the rest alone.

---

## **Q19: “Do you still need tests if you use TS?”**

**A:** Yes, but fewer. TS removes entire classes of bugs (typos, shape mismatches, refactor errors). Tests still cover logic and behavior.

---

## **Q20: “What’s the best summary of why TS matters?”**

**A:** JavaScript lets you write anything. TypeScript tells you when you shouldn’t.
