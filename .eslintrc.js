module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        '@tophat/eslint-config/base',
        '@tophat/eslint-config/jest',
        'prettier',
    ],
    rules: {
        'no-empty': ['error', { allowEmptyCatch: true }],
    },
    ignorePatterns: ['**/.*', 'packages/**/*.js', '**/lib'],
}
