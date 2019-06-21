module.exports = {
  'env': {
    es6: true,
    node: true,
    mocha: true,
    browser: false,
    jquery: false,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 9,
    "sourceType": "module",
  },
  'rules': {
    "max-len": [ 2, {
      "code": 200, "tabWidth": 2, 'ignoreComments': true, "ignoreUrls": true } ],
    'indent': [
      'error',
      2,
      {'SwitchCase': 1}
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    "no-unused-vars": ['error', {
      "varsIgnorePattern": "_",
      "argsIgnorePattern": "_"
    }],
    'no-use-before-define': [
      'error',
      { "functions": false, "classes": false }
    ],
    'no-multi-spaces': [ 'error' ],
    'array-callback-return': [ 'error' ],
    'block-scoped-var': [ 'error' ],
    'curly': [ 'error' ],
    'no-throw-literal': [ 'error' ],
    'no-useless-catch': [ 'error' ],
    'guard-for-in': [ 'error' ],
    'no-extend-native': [ 'error' ],

    // node js
    'handle-callback-err': [ 'error' ],
    'global-require': [ 'error' ],
    'callback-return': [ 'error' ],
    'no-buffer-constructor': [ 'error' ],
    'no-new-require': [ 'error' ],

    "eqeqeq": ["error", "always"],
    'no-extra-boolean-cast': ['off'],
    'no-console': ['off'],
    'no-useless-escape': ['off']
  }
};