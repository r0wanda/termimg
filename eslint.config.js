// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		ignores: ['dist/*'],
	},
	{
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/consistent-type-assertions': ['error', {
				assertionStyle: 'angle-bracket'
			}],
			'@typescript-eslint/no-explicit-any': 'off'
		}
	}
);