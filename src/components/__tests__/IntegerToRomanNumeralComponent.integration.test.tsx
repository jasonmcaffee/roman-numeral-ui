import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IntegerToRomanNumeralComponent from '../IntegerToRomanNumeralComponent';
import { RomanNumeralApi, Configuration } from '@/clients/roman-numeral-client';
import { TestWrapper } from '@/__tests__/test-utils';

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

      // Wait for API call to complete
      await waitFor(() => {
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith('42');
      });

      // Check final state
      await waitFor(() => {
        expect(button).toHaveTextContent('Convert to roman numeral');
        expect(button).not.toBeDisabled();
        expect(input).not.toBeDisabled();
        expect(screen.getByText('XLII')).toBeInTheDocument();
      });
    });
  });

  describe('Form Behavior', () => {
    it('should handle form submission via Enter key', async () => {
      const mockResponse = { output: 'XLII' };
      mockApiInstance.convertIntegerToRomanNumeral.mockResolvedValue(mockResponse);

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });

      await user.type(input, '42');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith('42');
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
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith('42');
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
        expect(mockApiInstance.convertIntegerToRomanNumeral).toHaveBeenCalledWith('2024');
      });
    });
  });
});
