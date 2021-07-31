module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        // project: 'tsconfig.json',
        sourceType: 'module',
    },
    env: {
        browser: true,
        es2020: true,
        node: true,
        jest: true
    },
    plugins: [
        '@typescript-eslint',
        'import',
        'react',
        '@typescript-eslint',
        // 'prettier'
    ],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        // 'standard',
        'plugin:@typescript-eslint/recommended',
        // 'prettier',
        // 'prettier/@typescript-eslint',
        // 'prettier/standard',
        // 'prettier/react'
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
        // 'prettier/prettier': 'error',
        // 'space-before-function-paren': 'off',
        // 'react/prop-types': 'off'
        'react/jsx-one-expression-per-line': 'off',
        'react/jsx-props-no-spreading':'off',
        'react/prop-types': 'off',
        'no-unused-expressions': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            'allowExpressions': true
          }
        ]
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
