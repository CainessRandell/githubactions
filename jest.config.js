module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'], // Procura testes na pasta tests
  verbose: true,
  forceExit: true,
  // Ignora a pasta node_modules
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 20,
      branches: 20,
      functions: 20,
      lines: 20,
    },
  },
};
