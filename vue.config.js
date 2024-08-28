module.exports = {
  transpileDependencies: [
    /[/\\]node_modules[/\\](.+?)?chart(.*)[/\\]dist/,
    /[/\\]node_modules[/\\](.+?)?vue-chartjs(.*)[/\\]dist/,
    "vuetify",
  ],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [(__dirname, "src/styles/*.scss")],
    },
  },
};
