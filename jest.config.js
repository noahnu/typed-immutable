const CI = process.env.CI === '1'
const ARTIFACT_DIR = process.env.ARTIFACT_DIR || 'artifacts'

module.exports = {
    ...(CI && {
        reporters: [
            'default',
            [
                'jest-junit',
                {
                    suiteName: 'Jest Tests',
                    outputDirectory: `${ARTIFACT_DIR}/test_results/jest/`,
                    outputName: 'jest.junit.xml',
                },
            ],
        ],
        collectCoverage: true,
    }),
    transform: {
        '^.+\\.[jt]sx?$': 'ts-jest',
    },
    coverageReporters: CI ? ['json'] : ['text', 'json'],
    coverageDirectory: `raw-coverage/jest/`,
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', '/__mocks__/', '/tests/'],
    watchPathIgnorePatterns: ['<rootDir>/artifacts', '<rootDir>/dist'],
    testPathIgnorePatterns: ['/node_modules/', '/.yarn/', '<rootDir>/dist/'],
    haste: {
        throwOnModuleCollision: true,
    },
    modulePathIgnorePatterns: ['<rootDir>/dist'],
    testTimeout: 30000,
}
