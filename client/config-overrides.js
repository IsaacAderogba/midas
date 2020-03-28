const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#5168C2",
      "@link-color": "#5168C2",
      "@font-size-base": "16px",
      "@heading-color": "#1A202C",
      "@text-color": "#4A5568",
      "@text-color-secondary": "#A0AEC0"
    }
  })
);
