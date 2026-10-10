/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/tests/setup.ts'],
    transform: {
        '^.+.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
    },
};
