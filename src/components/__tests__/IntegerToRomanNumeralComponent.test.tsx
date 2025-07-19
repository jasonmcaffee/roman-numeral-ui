import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IntegerToRomanNumeralComponent from '../IntegerToRomanNumeralComponent';
import { useRomanNumeralConverter } from '@/hooks/useRomanNumeralConverter';
import { TestWrapper } from '@/__tests__/test-utils';

// Mock the hook
jest.mock('@/hooks/useRomanNumeralConverter');
const mockUseRomanNumeralConverter = useRomanNumeralConverter as jest.MockedFunction<typeof useRomanNumeralConverter>;

describe('IntegerToRomanNumeralComponent', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let mockConvertToRomanNumeral: jest.MockedFunction<(input: string) => Promise<string>>;

  beforeEach(() => {
    user = userEvent.setup();
    mockConvertToRomanNumeral = jest.fn();

    // Setup default mock implementation
    mockUseRomanNumeralConverter.mockReturnValue({
      convertToRomanNumeral: mockConvertToRomanNumeral,
      isLoading: false,
      error: null,
      result: null
    });
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

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should display the correct heading', () => {
      renderComponent();
      expect(screen.getByText('Roman numeral converter')).toBeInTheDocument();
    });

    it('should render all required form elements', () => {
      renderComponent();

      expect(screen.getByRole('textbox', { name: /enter a number/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit button/i })).toBeInTheDocument();
      expect(screen.getByRole('form', { name: /roman numeral conversion form/i })).toBeInTheDocument();
    });

    it('should have correct initial state', () => {
      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      expect(input).toHaveValue('');
      expect(button).toHaveTextContent('Convert to roman numeral');
      expect(button).not.toBeDisabled();
      expect(screen.queryByText(/roman numeral:/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      renderComponent();

      const form = screen.getByRole('form', { name: /roman numeral conversion form/i });
      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      expect(form).toHaveAttribute('aria-label', 'Roman numeral conversion form');
      expect(input).toHaveAttribute('aria-label', 'Enter a number');
      expect(button).toHaveAttribute('aria-label', 'Submit button');
    });
  });

  describe('User Interactions', () => {
    it('should accept user input in the text field', async () => {
      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      await user.type(input, '42');

      expect(input).toHaveValue('42');
    });

    it('should handle form submission with valid input', async () => {
      mockConvertToRomanNumeral.mockResolvedValue('XLII');

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '42');
      await user.click(button);

      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('42');
      });
    });

    it('should handle form submission via Enter key', async () => {
      mockConvertToRomanNumeral.mockResolvedValue('XLII');

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });

      await user.type(input, '42');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('42');
      });
    });
  });

  describe('Loading States', () => {
    it('should disable form elements during loading', async () => {
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: true,
        error: null,
        result: null
      });

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
    });
  });

  describe('Success States', () => {
    it('should display result after successful conversion', () => {
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: null,
        result: 'XLII'
      });

      renderComponent();

      expect(screen.getByText(/roman numeral:/i)).toBeInTheDocument();
      expect(screen.getByText('XLII')).toBeInTheDocument();
    });

    it('should display different results correctly', () => {
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: null,
        result: 'MMXXIV'
      });

      renderComponent();

      expect(screen.getByText('MMXXIV')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display validation errors', () => {
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Number must be between 1 and 3999',
        result: null
      });

      renderComponent();

      const errorAlert = screen.getByRole('alert');

      expect(errorAlert).toHaveTextContent('Please fix the errors and try again.');
      expect(screen.getByText('Number must be between 1 and 3999')).toBeInTheDocument();
    });

    it('should display different error messages', () => {
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Please enter a value.',
        result: null
      });

      renderComponent();

      expect(screen.getByText('Please enter a value.')).toBeInTheDocument();
    });

    it('should clear errors when new conversion starts', async () => {
      // Start with error state
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Previous error',
        result: null
      });

      const { rerender } = renderComponent();

      expect(screen.getByText('Previous error')).toBeInTheDocument();

      // Clear error state
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: null,
        result: null
      });

      rerender(
        <TestWrapper>
          <IntegerToRomanNumeralComponent />
        </TestWrapper>
      );

      expect(screen.queryByText('Previous error')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should handle empty form submission', async () => {
      // Mock the hook to return an error for empty input
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Please enter a value.',
        result: null
      });

      renderComponent();

      const button = screen.getByRole('button', { name: /submit button/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('');
      });
    });

    it('should handle whitespace-only input', async () => {
      // Mock the hook to return an error for whitespace-only input
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Please enter a value.',
        result: null
      });

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '   ');
      await user.click(button);

      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('   ');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labeling', () => {
      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const label = screen.getByText(/enter a number/i);

      expect(input).toHaveAttribute('aria-label', 'Enter a number');
      expect(label).toBeInTheDocument();
    });

    it('should associate error messages with form fields', () => {
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Validation error',
        result: null
      });

      renderComponent();

      const errorMessage = screen.getByText('Validation error');

      expect(errorMessage).toBeInTheDocument();
    });

    it('should have proper button labeling', () => {
      renderComponent();

      const button = screen.getByRole('button', { name: /submit button/i });
      expect(button).toHaveAttribute('aria-label', 'Submit button');
    });
  });

  describe('Integration with Hook', () => {
    it('should call hook with correct parameters', async () => {
      mockConvertToRomanNumeral.mockResolvedValue('XLII');

      renderComponent();

      const input = screen.getByRole('textbox', { name: /enter a number/i });
      const button = screen.getByRole('button', { name: /submit button/i });

      await user.type(input, '42');
      await user.click(button);

      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('42');
      });
    });

    it('should update UI based on hook state changes', () => {
      // Test that component properly reflects hook state
      const { rerender } = renderComponent();

      // Initial state
      expect(screen.queryByText(/roman numeral:/i)).not.toBeInTheDocument();

      // Success state
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: null,
        result: 'XLII'
      });

      rerender(
        <TestWrapper>
          <IntegerToRomanNumeralComponent />
        </TestWrapper>
      );

      expect(screen.getByText('XLII')).toBeInTheDocument();

      // Error state
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Test error',
        result: null
      });

      rerender(
        <TestWrapper>
          <IntegerToRomanNumeralComponent />
        </TestWrapper>
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.queryByText('XLII')).not.toBeInTheDocument();
    });
  });
});
