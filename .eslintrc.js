module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint/eslint-plugin"],
	extends: [
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"prettier/@typescript-eslint",
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	rules: {
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"no-unused-variable": [true, { "ignore-pattern": "^_" }],
		"@typescript-eslint/explicit-function-return-type": {
			allowExpressions: true,
		},
	},
};
