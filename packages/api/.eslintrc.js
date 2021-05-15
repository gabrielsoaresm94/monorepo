module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'import',
        // 'prettier',
        // 'prettier/@typescript-eslint',
    ],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // "prettier/prettier": "error",
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off"
    },
    ignorePatterns: [
        "*.copy*",
        "**/coverage",
        "**/dist",
        "**/node_modules",
        "**/*.config.js"
    ]
};
