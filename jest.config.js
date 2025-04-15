require("dotenv").config();

module.exports = {
  testEnvironment: "./tests/env.js",
  moduleFileExtensions: ["js", "ts", "json"],
  transform: {
    "^.*\\.tsx?$": [require.resolve("jest-tsd-transform")],
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?|react-native-webview)/)",
  ],
  testMatch: ["<rootDir>/**/*test.ts"],
  coverageReporters: [],
  resolver: require.resolve("jest-pnp-resolver"),
  watchPlugins: ["./tests/watchplugin.js"],
};
