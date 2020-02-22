module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    '_': true,
    'G_BASE_API': true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'camelcase': [0, { 'properties': 'always' }],
    'no-useless-escape': 0,
    "vue/no-use-v-if-with-v-for": 0,
    'vue/no-unused-vars': 0,
    'object-property-newline': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
