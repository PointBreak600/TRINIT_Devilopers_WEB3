'use strict';

module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'script',
  },
  extends: 'eslint:recommended',
  rules: {
    strict: 'error',
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': ['error', { args: 'none' }],
    'no-console': 'off',
    curly: 'error',
    eqeqeq: 'error',
    'no-throw-literal': 'error',
    'no-var': 'error',
    'dot-notation': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-use-before-define': 'error',
    'no-useless-call': 'error',
    'no-with': 'error',
    'operator-linebreak': 'error',
    yoda: 'error',
    'quote-props': ['error', 'as-needed'],
    'no-constant-condition': ['error', { checkLoops: false }],
    'keyword-spacing': 'error',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
    }],
    'space-before-blocks': ['error', 'always'],
    'no-multiple-empty-lines': 'error',
    'comma-spacing': 'error',
    'array-bracket-spacing': 'error',
    'max-len': ['warn', {
      code: 90,
      ignoreTemplateLiterals: true,
    }],
    'eol-last': ['error', 'always'],
    'object-shorthand': ['error', 'properties'],
  },
};
