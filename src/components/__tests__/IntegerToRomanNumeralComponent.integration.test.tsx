import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from '@adobe/react-spectrum';
import IntegerToRomanNumeralComponent from '../IntegerToRomanNumeralComponent';
import { RomanNumeralApi, Configuration } from '@/clients/roman-numeral-client';

// Mock the API client for integration tests
jest.mock('@/clients/roman-numeral-client', () => ({
  RomanNumeralApi: jest.fn(),
  Configuration: jest.fn(),
  InputValidationError: jest.fn()
}));

// Mock the app config
jest.mock('@/config/appConfig', () => ({
  appConfig: {
    getRomanNumeralClientConfig: () => ({
      baseUrl: 'http://localhost:8080'
    })
  }
}));

const mockRomanNumeralApi = RomanNumeralApi as jest.MockedClass<typeof RomanNumeralApi>;
const mockConfiguration = Configuration as jest.MockedClass<typeof Configuration>;

// Test wrapper component with React Spectrum provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider>
    {children}
  </Provider>
);

describe('IntegerToRomanNumeralComponent Integration', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let mockApiInstance: any;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    
    // Create mock API instance
    mockApiInstance = {
      convertIntegerToRomanNumeral: jest.fn()
    };
    
    // Setup Configuration mock
    mockConfiguration.mockImplementation(() => ({} as any));
    
    // Setup RomanNumeralApi mock
    mockRomanNumeralApi.mockImplementation(() => mockApiInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <TestWrapper>
        <IntegerToRomanNumeralComponent />
      </TestWrapper>
    );
  };

  describe('End-to-End User Workflow', () => {
    it('should complete a full conversion workflow successfully', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      // User enters input
      await user.type(input, '42');
      expect(input).toHaveValue('42');

      // User submits form
      await user.click(button);

      // Check loading state
      await waitFor(() => {
        expect(button).toHaveTextContent('Converting...');
        expect(button).toBeDisabled();
        expect(input).toBeDisabled();
      });

      // Wait for API call to complete
      await waitFor(() => {
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith(42);
      });

      // Check final state
      await waitFor(() => {
        expect(button).toHaveTextContent('Convert to roman numeral');
        expect(button).not.toBeDisabled();
        expect(input).not.toBeDisabled();
        expect(screen.getByText('XLII')).toBeInTheDocument();
        expect(input).toHaveValue(''); // Input should be cleared
      });
    });

    it('should handle validation errors in the full workflow', async () => {
      const mockValidationError = {
        response: {
          status: 400,
          json: jest.fn().mockResolvedValue({
            errorDetails: [
              { message: 'Number must be between 1 and 3999' }
            ]
          })
        }
      };

      mockApiInstance.convertIntegerToRomanNumeral.mockRejectedValue(
        new (require('@/clients/roman-numeral-client/runtime').ResponseError)(mockValidationError)
      );

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      // User enters invalid input
      await user.type(input, '5000');
      await user.click(button);

      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText('Number must be between 1 and 3999')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Please fix the errors and try again.');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });

      // User can try again with valid input
      const validResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(validResponse);

      await user.clear(input);
      await user.type(input, '42');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('XLII')).toBeInTheDocument();
        expect(screen.queryByText('Number must be between 1 and 3999')).not.toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');
      mockApiInstance.convertIntegerToRomanNumeral.mockRejectedValue(networkError);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '42');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
        expect(button).not.toBeDisabled(); // Button should be re-enabled
        expect(input).not.toBeDisabled(); // Input should be re-enabled
      });
    });
  });

  describe('Form Behavior', () => {
    it('should handle empty form submission', async () => {
      renderComponent();

      const button = screen.getByRole('button', { name: /submit button/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Please enter a value.')).toBeInTheDocument();
        expect(mockApiInstance.convertIntegerToRomanNumeral).not.toHaveBeenCalled();
      });
    });

    it('should handle whitespace-only input', async () => {
      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '   ');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Please enter a value.')).toBeInTheDocument();
        expect(mockApiInstance.convertIntegerToRomanNumeral).not.toHaveBeenCalled();
      });
    });

    it('should handle form submission via Enter key', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });

      await user.type(input, '42');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith(42);
      });
    });
  });

  describe('State Management', () => {
    it('should clear previous results when starting new conversion', async () => {
      // First conversion
      const firstResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(firstResponse);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '42');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('XLII')).toBeInTheDocument();
      });

      // Second conversion
      const secondResponse = { output: 'MMXXIV' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(secondResponse);

      await user.type(input, '2024');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('MMXXIV')).toBeInTheDocument();
        expect(screen.queryByText('XLII')).not.toBeInTheDocument();
      });
    });

    it('should handle rapid successive submissions', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '42');
      await user.click(button);
      await user.click(button); // Second click while first is still processing

      await waitFor(() => {
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('API Integration', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '42');
      await user.click(button);

      await waitFor(() => {
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith(42);
      });
    });

    it('should handle different input types correctly', async () => {
      const mockResponse = { output: 'MMXXIV' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '2024');
      await user.click(button);

      await waitFor(() => {
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith(2024);
      });
    });
  });
}); 