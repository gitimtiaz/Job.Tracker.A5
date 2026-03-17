# GitHub Issues Tracker

## 1️⃣ Difference between `var`, `let`, and `const`

`var` is the old way to declare variables. It is function-scoped and can be redeclared, which sometimes causes bugs.

`let` is block-scoped (works inside `{ }`) and can be updated but not redeclared in the same scope. It’s safer than `var`.

`const` is also block-scoped but cannot be reassigned after declaration. It’s used for values that shouldn’t change. However, objects and arrays declared with `const` can still have their contents modified.

## 2️⃣ What is the spread operator (`...`)?

The spread operator is used to expand elements of an array or object. It’s commonly used to copy arrays, merge arrays/objects, or pass multiple values easily.

**Example:** copying an array without modifying the original.

## 3️⃣ Difference between `map()`, `filter()`, and `forEach()`

- **`map()`** creates a new array by transforming each element.

- **`filter()`** creates a new array with only the elements that meet a condition.

- **`forEach()`** just loops through the array and performs an action, but does not return a new array.

## 4️⃣ What is an arrow function?

An arrow function is a shorter way to write functions using `=>`. It’s commonly used for small functions, callbacks, and cleaner code.

**Example:** instead of writing a full function block, you can write it in one line.

## 5️⃣ What are template literals?

Template literals use backticks (` `) instead of quotes. They allow embedding variables inside strings using `${ }` and also support multi-line strings.

They are very useful for building dynamic text or HTML.