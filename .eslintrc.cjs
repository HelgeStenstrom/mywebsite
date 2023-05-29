module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    overrides:[ // För att slippa markeringar från ESLint i html-filer
        {files: ['*.html']}
    ]
};
