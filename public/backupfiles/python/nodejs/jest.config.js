module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!jest.config.js"
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "text",
    "lcov",
    "html"
  ],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },


    // ✅ Add these for tabular coverage
    collectCoverage: true, // optional; automatic when you pass --coverage
    coverageReporters: ['text', 'text-summary', 'html'], // console + HTML table
    coverageDirectory: '<rootDir>/coverage',


  // Custom reporter to show current time and total duration
  reporters: [
    'default'
    // '<rootDir>/TimeReporter.js',
  ]
};
