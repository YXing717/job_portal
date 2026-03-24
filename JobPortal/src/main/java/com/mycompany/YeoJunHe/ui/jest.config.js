module.exports = {
  testEnvironment: 'jsdom',        // ← VERY IMPORTANT for DOM testing
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.test.js'],     // your test files must end with .test.js
};
