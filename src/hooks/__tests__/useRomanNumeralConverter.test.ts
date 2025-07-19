import { renderHook, act } from '@testing-library/react';
import { useRomanNumeralConverter } from '../useRomanNumeralConverter';
import { RomanNumeralApi, Configuration } from '@/clients/roman-numeral-client';
import { ResponseError } from '@/clients/roman-numeral-client/runtime';

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

/**
 * Test state management and api response handling (network errors, bad request, etc)
 */
describe('useRomanNumeralConverter hook', () => {
  let mockApiInstance: any;
  let mockRomanNumeralApi: any;
  let mockConfiguration: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock API instance
    mockApiInstance = {
      convertIntegerToRomanNumeral: jest.fn()
    };

    // Get the mocked classes
    mockRomanNumeralApi = RomanNumeralApi;
    mockConfiguration = Configuration;

    // Setup Configuration mock
    mockConfiguration.mockImplementation(() => ({} as any));

    // Setup RomanNumeralApi mock
    mockRomanNumeralApi.mockImplementation(() => mockApiInstance);
  });

  describe('initial state', () => {
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

  describe('convertToRomanNumeral - success cases', () => {
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

  describe('convertToRomanNumeral - validation errors', () => {
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

    it('should handle API validation errors (400 status)', async () => {
      // Create a proper mock Response object
      const mockResponse = {
        status: 400,
        json: jest.fn().mockResolvedValue({
          errorDetails: [
            { message: 'Number must be between 1 and 3999' }
          ]
        }),
        headers: new Headers(),
        ok: false,
        redirected: false,
        statusText: 'Bad Request',
        type: 'default' as ResponseType,
        url: 'http://localhost:8080/convert',
        clone: jest.fn(),
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
        body: null,
        bodyUsed: false
      } as unknown as Response;

      // Use the actual ResponseError from the runtime module
      const responseError = new ResponseError(mockResponse);
      mockApiInstance.convertIntegerToRomanNumeral.mockRejectedValue(responseError);

      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        try {
          await result.current.convertToRomanNumeral('5000');
        } catch (error) {
          // Expected to throw - the hook always throws at the end
        }
      });

      // The hook should extract the validation error message from the response
      expect(result.current.error).toBe('Number must be between 1 and 3999');
      expect(result.current.result).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('convertToRomanNumeral - network errors', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockApiInstance.convertIntegerToRomanNumeral.mockRejectedValue(networkError);

      const { result } = renderHook(() => useRomanNumeralConverter());

      await act(async () => {
        try {
          await result.current.convertToRomanNumeral('42');
        } catch (error) {
          // Expected to throw - the hook always throws at the end
        }
      });

      // The hook should use the error message from the Error object
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

  describe('loading states', () => {
    it('should set loading state during API call', async () => {
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockApiInstance.convertIntegerToRomanNumeral.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useRomanNumeralConverter());

      // Start the conversion
      const conversionPromise = result.current.convertToRomanNumeral('42');

      // Wait for the next tick to allow React to update state
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Check that loading is true
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();

      // Resolve the promise
      resolvePromise!({ output: 'XLII' });

      // Now await the conversion
      await act(async () => {
        try {
          await conversionPromise;
        } catch (error) {
          // Expected to throw
        }
      });

      // Check that loading is false after completion
      expect(result.current.isLoading).toBe(false);
    });

    it('should clear previous results and errors when starting new conversion', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRomanNumeralConverter());

      // Ensure the hook is properly initialized
      expect(result.current.convertToRomanNumeral).toBeDefined();

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

  describe('API client memoization', () => {
    it('should not recreate API client on every render', () => {
      // Clear mocks to start fresh
      jest.clearAllMocks();

      const { result, rerender } = renderHook(() => useRomanNumeralConverter());

      // Ensure the hook is initialized
      expect(result.current.convertToRomanNumeral).toBeDefined();

      // Force re-render
      rerender();

      // Configuration and API should only be called once
      expect(mockConfiguration).toHaveBeenCalledTimes(1);
      expect(mockRomanNumeralApi).toHaveBeenCalledTimes(1);
    });
  });
});
