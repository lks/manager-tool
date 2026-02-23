module.exports = {
  extends: [
    './index.js',
    'next/core-web-vitals',
  ],
  rules: {
    'react/prop-types': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
}
