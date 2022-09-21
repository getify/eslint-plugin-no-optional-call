"use strict";

var path = require("path");
var rule = require(
	path.join("..","..","..","lib","rules","no-optional-call.js")
);
var { RuleTester } = require("eslint");

var test = new RuleTester({
	parser: require.resolve("@babel/eslint-parser"),
	parserOptions: {
		requireConfigFile: false,
	},
});

test.run("no-optional-call", rule, {
	valid: [ "console?.log(42);"],
	invalid: [
		{
			code: "console?.log?.(42)",
			errors: [
				{
					message: "Avoid the use of the optional-call operator",
					type: "CallExpression",
				},
			],
		},
	],
});
