module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  moduleNameMapper: {
    'chart\\.js/auto': '<rootDir>/src/__mocks__/chartjs-auto.js',
  },
};
