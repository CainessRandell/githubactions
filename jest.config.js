module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'], // Procura testes na pasta tests
  verbose: true,
  forceExit: true,
  // Ignora a pasta node_modules
  testPathIgnorePatterns: ['/node_modules/'] 
};