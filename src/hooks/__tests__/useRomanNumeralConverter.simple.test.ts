import { renderHook, act } from '@testing-library/react';
import { useRomanNumeralConverter } from '../useRomanNumeralConverter';

// Mock the API client
jest.mock('@/clients/roman-numeral-client', () => ({
  RomanNumeralApi: jest.fn(),
  Configuration: jest.fn(),
  InputValidationError: jest.fn(),
  ResponseError: jest.fn()
}));

// Mock the app config
jest.mock('@/config/appConfig', () => ({
  appConfig: {
    getRomanNumeralClientConfig: () => ({
      baseUrl: 'http://localhost:8080'
    })
  }
}));

describe('useRomanNumeralConverter - Core Functionality', () => {
  let mockApiInstance: any;
  let mockRomanNumeralApi: any;
  let mockConfiguration: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock API instance
    mockApiInstance = {
      convertIntegerToRomanNumeral: jest.fn()
    };
    
    // Get the mocked classes
    const { RomanNumeralApi, Configuration } = require('@/clients/roman-numeral-client');
    mockRomanNumeralApi = RomanNumeralApi;
    mockConfiguration = Configuration;
    
    // Setup mocks
    mockConfiguration.mockImplementation(() => ({} as any));
    mockRomanNumeralApi.mockImplementation(() => mockApiInstance);
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useRomanNumeralConverter());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
      expect(typeof result.current.convertToRomanNumeral).toBe('function');
    });

    it('should create API client with correct configuration', () => {
      renderHook(() => useRomanNumeralConverter());

      expect(mockConfiguration).toHaveBeenCalledWith({
        basePath: 'http://localhost:8080'
      });
      expect(mockRomanNumeralApi).toHaveBeenCalled();
    });
  });

  describe('Success Cases', () => {
    it('should successfully convert a valid number', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        const response = await result.current.convertToRomanNumeral('42');
        expect(response).toBe('XLII');
      });

      expect(result.current.result).toBe('XLII');
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith('42');
    });

    it('should handle different valid numbers', async () => {
      const mockResponse = { output: 'MMXXIV' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        const response = await result.current.convertToRomanNumeral('2024');
        expect(response).toBe('MMXXIV');
      });

      expect(result.current.result).toBe('MMXXIV');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Input Validation', () => {
    it('should handle empty input validation', async () => {
      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        try {
          await result.current.convertToRomanNumeral('');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Please enter a value.');
      expect(result.current.result).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(mockApiInstance.convertIntegerToRomanNumeral).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only input validation', async () => {
      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        try {
          await result.current.convertToRomanNumeral('   ');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Please enter a value.');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockApiInstance.convertIntegerToRomanNumeral.mockRejectedValue(networkError);

      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        try {
          await result.current.convertToRomanNumeral('42');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.result).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle unknown errors', async () => {
      const unknownError = 'Unknown error';
      mockApiInstance.convertIntegerToRomanNumeral.mockRejectedValue(unknownError);

      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        try {
          await result.current.convertToRomanNumeral('42');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Failed to convert number. Please try again.');
      expect(result.current.result).toBeNull();
    });
  });

  describe('State Management', () => {
    it('should clear previous results when starting new conversion', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRomanNumeralConverter());

      // First conversion
      await act(async () => {
        await result.current.convertToRomanNumeral('42');
      });

      expect(result.current.result).toBe('XLII');
      expect(result.current.error).toBeNull();

      // Second conversion - should clear previous results
      const secondMockResponse = { output: 'MMXXIV' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(secondMockResponse);

      await act(async () => {
        await result.current.convertToRomanNumeral('2024');
      });

      expect(result.current.result).toBe('MMXXIV');
      expect(result.current.error).toBeNull();
    });
  });

  describe('API Client Memoization', () => {
    it('should not recreate API client on every render', () => {
      const { rerender } = renderHook(() => useRomanNumeralConverter());

      // Force re-render
      rerender();

      // Configuration and API should only be called once
      expect(mockConfiguration).toHaveBeenCalledTimes(1);
      expect(mockRomanNumeralApi).toHaveBeenCalledTimes(1);
    });
  });
}); 