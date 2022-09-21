"use strict";

module.exports.rules["default"] =
	require(
		path.join(__dirname,"rules","no-optional-call.js")
	);
