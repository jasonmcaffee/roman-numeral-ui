module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/cssMock.js',
    '\\.([a-z0-9]+)\\.([a-f0-9]+)\\.css$': '<rootDir>/src/__mocks__/cssMock.js',
    '^.*\\.css$': '<rootDir>/src/__mocks__/cssMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js'
  },
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)',
    '**/*.test.(ts|tsx)'
  ],
  
  // Transform configuration using @swc/jest like react-spectrum examples
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true
          },
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        }
      }
    ]
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Collect coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/'
  ],
  
  // Transform ignore patterns - transform React Spectrum packages
  transformIgnorePatterns: [
    'node_modules/(?!(@adobe/react-spectrum|@react-aria|@react-stately|@spectrum-css|@react-spectrum)/)'
  ]
}; 