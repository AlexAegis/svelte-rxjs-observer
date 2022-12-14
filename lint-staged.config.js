// For the glob features check out https://github.com/micromatch/micromatch
export default {
	'*.(ts|js)': ['eslint --max-warnings=0', 'prettier --check'],
	'*.(css|scss)': ['stylelint', 'prettier --check'],
	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [('eslint', 'prettier --check')],
	'*.md': ["markdownlint --ignore 'CHANGELOG.md' --ignore-path '.gitignore'", 'prettier --check'],
	'*.(yml|yaml)': ['prettier --check'],
};
