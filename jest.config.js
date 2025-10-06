module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'src/test/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 60,
      statements: 60
    }
  },
  testMatch: [
    '**/src/test/**/*.test.js',
    '**/src/test/**/*.spec.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/test/coverage/',
    '/src/test/fixtures/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/test/**',
    '!src/docs/**',
    '!src/app.js',
    '!src/config/**',
    '!jest.config.js',
    '!**/node_modules/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
