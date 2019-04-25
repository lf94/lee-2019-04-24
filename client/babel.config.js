module.exports = {
  presets: [
    [ '@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 'core-js@3'
    }],
    [ '@babel/preset-react' ],
  ],
  plugins: [
    [ 'module-resolver', {
      "root": ["./src"],
      "alias": {
        "~": "./src",
      }
    }]
  ]
};
