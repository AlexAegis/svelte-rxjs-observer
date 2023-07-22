// TODO: reenable -by-autotool

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		'../../.eslintrc.cjs',
		'@alexaegis/eslint-config-svelte',
		'@alexaegis/eslint-config-vitest',
	],
	overrides: [
		{
			files: '*.svelte',
			rules: {
				'no-undef': 'off',
			},
		},
	],
};
