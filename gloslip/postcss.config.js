module.exports = {
  plugins: {
    'postcss-preset-env': {
      autoprefixer: {
        grid: true,
      },
      features: {
        'nesting-rules': true,
      },
    },
  },
}