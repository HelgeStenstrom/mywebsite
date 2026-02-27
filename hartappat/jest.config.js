module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['hartappat/setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'ts-jest',
  },
};
