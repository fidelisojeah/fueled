module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/declarations/**/*', '!test', '!src/core/database/**/*'],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.(ts|tsx)$': 'babel-jest'
    },
    testMatch: ['**/*.test.(ts|js)'],
    testEnvironment: 'node',
    reporters: ['default', 'jest-junit'],
    coverageReporters: ['cobertura', 'text'],
    coverageDirectory: 'coverage',
    watchPathIgnorePatterns: ['node_modules']
};
