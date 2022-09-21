"use strict";

module.exports = {
	meta: {
		type: "problem",
		docs: {
			description: "Disables the use of the optional-call operator.",
			recommended: true,
			url: "https://github.com/getify/eslint-plugin-no-optional-call",
		},
		fixable: null,
		schema: [],
	},

	create(context) {
		return {
			CallExpression(node) {
				if (node.optional) {
					context.report(node, "Avoid the use of the optional-call operator");
				}
			},
		};
	},
};
