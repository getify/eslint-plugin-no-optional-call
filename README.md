# ESLint Plugin: no-optional-call

[![npm Module](https://badge.fury.io/js/eslint-plugin-no-optional-call.svg)](https://www.npmjs.org/package/eslint-plugin-no-optional-call)

## Overview

The **no-optional-call** ESLint plugin provides a single rule (non-configurable) that disallows any usage of the `?.(` optional-call form.

Unlike the related `?.` / `?.[` optional-chaining operators (which are quite useful), the `?.(` optional-call operator is total junk, and should never have been added to the language -- at least, not how it was designed.

This plugin allows you to ensure that it never creeps into your project by accident.

### Explanation

The supposed usage of this operator is like this:

```js
obj?.func?.(42);
```

The first `?.` is optional-chaining (which is fine!), but the second `?.(` is an optional-call (which is bad). But importantly, this is not necessarily an object/method feature, as the optional-call can be used with a single identifier like this:

```js
func?.(42);
```

In both cases, here's the equivalent code this `?.(` operator purports to replace:

```js
if (obj.func != null) {
    obj.func(42);
}

if (func != null) {
    func(42);
}
```

The usage of `!= null` here is on purpose. It's non-nullish checking, meaning that it avoids `null` and `undefined`, but no other values.

**WARNING:** a common misconception is that the `?.(` operator is actually intended for replacing *this* kind of code (which is a bit more common/relaxed):

```js
obj.func && obj.func(42);

// or:
if (obj.func) {
    obj.func(42);
}

// **********

func && func(42);

// or:
if (func) {
    func(42);
}
```

These are subtly but importantly different than the previous `!= null` forms. That's the first gotcha! If your existing code has relied on avoiding falsy values in `obj.func` / `func` other than the nullish values (`null`, `undefined`), such as `false`, `""`, `NaN`, or `0`, then switching to `?.(` *will break* your code, since the `?.(` operator only stops at `null` and `undefined` values.

Oops!

But here's what's worse, what really dooms this `?.(` feature, and why you should avoid ever using it in your programs (and rely on this plugin to ensure you don't).

This operator *looks like* what it's doing is providing a "safe call" type of operator (which exists in other programming languages). It *seems* like it's making sure that the value is callable (is actually a function) before calling it.

To the untrained eye that's not paying close attention, `?.(` looks like it *should* be doing this:

```js
if (typeof obj.func == "function") {
    obj.func(42);
}

if (typeof func == "function") {
    func(42);
}
```

But it doesn't! It only avoids `null` / `undefined` values.

If `obj.func` / `func` holds *any* non-function truthy value (strings, numbers, objects, arrays, dates, regular expressions, etc), then `?.(` will attempt to execute call that value as if it was a function, which of course will fail because none of those *are* functions.

In other words, *all falsy* values except `null` and `undefined`, and *all truthy values* besides functions themselves, are *all* traps where the `?.(` operator is going to fall over and break your program.

### Types!?

I know a bunch of you are yelling at me that TypeScript solves this problem, because it makes sure all those other value-types are not in `obj.func` / `func`.

Here's my simple rebuttal: I call utter B.S. on the design of any JS feature which is full of (technically, an infinite number of) gotcha footguns by itself, and only operates sensibly if you *also* use TypeScript.

It'd be fine if TypeScript wanted to add this feature. Use it there to your heart's content! But if you're writing only JS, you should never, ever, ever, ever... use this `?.(` feature.

## Enabling The Plugin

To use **no-optional-call**, load it as a plugin into ESLint and configure the rules as desired.

### `.eslintrc.json`

To load the plugin and enable its rules via a local or global `.eslintrc.json` configuration file:

```json
"plugins": [
    "no-optional-call"
],
"rules": {
    "no-optional-call/default": "error"
}
```

### `package.json`

To load the plugin and enable its rules via a project's `package.json`:

```json
"eslintConfig": {
    "plugins": [
        "no-optional-call"
    ],
    "rules": {
        "no-optional-call/default": "error"
    }
}
```

### ESLint CLI parameters

To load the plugin and enable its rules via ESLint CLI parameters, use `--plugin` and `--rule` flags:

```cmd
eslint .. --plugin='no-optional-call' --rule='no-optional-call/default: error' ..
```

### ESLint Node API

To use this plugin in Node.js with the ESLint API, require the npm module, and then (for example) pass the rule's definition to `Linter#defineRule(..)`, similar to:

```js
var noOptionalCall = require("eslint-plugin-no-optional-call");

// ..

var eslinter = new (require("eslint").Linter)();

eslinter.defineRule("no-optional-call/default",noOptionalCall.rules.default);
```

Then lint some code like this:

```js
eslinter.verify(".. some code ..",{
    rules: {
        "no-optional-call/default": "error",
    }
});
```

### Inline Comments

Once the plugin is loaded, the rule can be configured using inline code comments if desired, such as:

```js
/* eslint "no-optional-call/default": "error" */
```

## npm Package

To use this plugin with a global install of ESLint (recommended):

```cmd
npm install -g eslint-plugin-no-optional-call
```

To use this plugin with a local install of ESLint:

```cmd
npm install eslint-plugin-no-optional-call
```

## License

All code and documentation are (c) 2022 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).

NOTE: This package was heavily inspired by [eslint-plugin-no-pipe](https://github.com/arendjr/eslint-plugin-no-pipe) by [@arendjr](https://github.com/arendjr).
