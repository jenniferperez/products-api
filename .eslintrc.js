module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'off',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-trailing-spaces': 'error',
    'eol-last': 'error'
  },
  globals: {
    'process': 'readonly',
    'require': 'readonly',
    'module': 'readonly',
    'exports': 'readonly',
    '__dirname': 'readonly',
    '__filename': 'readonly',
    'global': 'readonly',
    'Buffer': 'readonly',
    'console': 'readonly',
    'setTimeout': 'readonly',
    'clearTimeout': 'readonly',
    'setInterval': 'readonly',
    'clearInterval': 'readonly'
  }
};
