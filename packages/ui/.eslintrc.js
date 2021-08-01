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
    rules: {},
    ignorePatterns: [
        "**/*.spec.*",
        "**/*.copy.*",
        "**/coverage",
        "**/dist",
        "**/node_modules",
        "**/*.config.js"
    ]
};
