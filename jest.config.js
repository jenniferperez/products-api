module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'src/test/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 60,
      statements: 60
    }
  },
  testMatch: ['**/src/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/test/**',
    '!src/docs/**',
    '!src/config/**',
    '!jest.config.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js']
};
