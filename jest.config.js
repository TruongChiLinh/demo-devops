module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx"],
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)"
    ],
  };
  