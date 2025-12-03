# 01 — Problems With Dynamic Typing

A fast, blunt overview of why dynamic typing becomes painful at scale. Use these bullets as talking points.

---

## **1. No Compile‑Time Guarantees**

* In JS, every type error is a *runtime* error.
* Misspelled property? Silent failure until a user hits the code path.
* Functions accept anything, return anything.

**JavaScript**

```js
function getFullName(user) {
  return user.firtName + " " + user.lastName; // typo: firtName
}
getFullName({ firstName: "A", lastName: "B" });
// Runtime explosion, no warnings.
```

**C# equivalent** (impossible to compile):

```csharp
class User { public string FirstName; public string LastName; }
var u = new User();
u.FirtName = "A"; // compile error: no such field
```

---

## **2. Hidden, Accidental Type Changes**

* JS variables can mutate into completely different shapes.
* This makes refactoring fragile.

```js
let value = 10;
value = "now a string";
value = { now: "an object" };
```

**C++**

```cpp
int value = 10;
value = "nope"; // won't compile
```

Dynamic typing allows chaotic evolution. Static typing enforces discipline.

---

## **3. Functions With "Mystery" Inputs and Outputs**

* No one knows what a function expects without reading the entire implementation.
* Docs rot. Real behavior shifts. Bugs hide in assumptions.

```js
function process(data) {
  // What is data? Array? Object? Null? Number?
}
```

**C# version**

```csharp
string Process(UserData data) { ... } // clear contract
```

---

## **4. Silent Failures Instead of Hard Errors**

* JS loves returning `undefined` when something is wrong.
* Accidentally calling something that isn’t a function? Runtime only.

```js
const maybeFn = user.callback;
maybeFn(); // TypeError only when executed
```

**C++ would never let this compile**.

---

## **5. Impossible to Safely Refactor Large Codebases**

* Rename a property? Good luck.
* IDE search/replace becomes dangerous.
* Tests can’t cover every path.

```js
// Old field
user.profilePicUrl

// New field
user.avatarUrl

// Hundreds of hidden references remain
```

Static types make refactors mechanical instead of risky.

---

## **6. Dynamic Overloading Makes Reasoning Hard**

* Functions behave differently based on runtime type.
* No compiler guard rails.

```js
function add(a, b) {
  return a + b; // could be number addition or string concat
}
```

**C#**

```csharp
int Add(int a, int b);
string Add(string a, string b);
```

In JS, the wrong one happens silently.

---

## **7. Data From APIs Is Completely Unchecked**

* JSON responses are trusted blindly.
* Any shape mismatch is runtime-only.

```js
const todo = await fetch('/todos/1').then(r => r.json());
console.log(todo.titel); // typo
```

A typed language won’t even build.

---

## **8. Large Teams End Up Re-Implementing Type Systems by Hand**

* Writing enormous docs explaining object shapes
* JSDoc type comments everywhere
* Runtime validators to ensure shape correctness

All of that work is free with static typing.

---

## **9. You Can’t Trust Intellisense**

* Dynamic types = bad autocomplete.
* TS turns autocomplete into an actual realtime contract.

---

## **10. “Works on My Machine” Becomes the Default Failure Mode**

* Without strict typing, local mutations or test data hide bugs.
* When the real data arrives, things break.

---

## **11. Runtime Errors in Places That Should Never Fail**

* Operations that are *logically impossible* in typed languages happen all the time in JS.

```js
const count = getCount();
count.toUpperCase(); // happens if API suddenly returns a string
```

Static typing makes entire categories of bugs literally unrepresentable.

---

## **The Pitch**

> Dynamic typing feels fast in the beginning and slow forever.
> Static typing feels slower in the beginning and fast forever.

TS eliminates entire classes of bugs, makes refactors trivial, and lets you trust your code.
