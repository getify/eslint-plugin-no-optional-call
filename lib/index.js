"use strict";

var path = require("path");

module.exports.rules["default"] =
	require(
		path.join(__dirname,"rules","no-optional-call.js")
	);
