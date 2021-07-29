module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        // project: 'tsconfig.json',
        sourceType: 'module',
    },
    env: {
        node: true,
        jest: true,
    },
    plugins: [
        '@typescript-eslint',
        'import'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    root: true,
    rules: {
        // '@typescript-eslint/interface-name-prefix': 'off',
        // '@typescript-eslint/explicit-function-return-type': 'off',
        // '@typescript-eslint/no-explicit-any': 'off',
        // '@typescript-eslint/no-var-requires': 'off',
        // '@typescript-eslint/no-empty-function': [
        //     'error',
        //     { allow: ['constructors'] },
        // ],
        // "arrow-body-style": "off",
	    // "prefer-arrow-callback": "off"
    },
    ignorePatterns: [
        "**/*.spec.*",
        "**/*.copy.*",
        "**/coverage",
        "**/dist",
        "**/node_modules",
        "**/*.config.js"
    ]
};
