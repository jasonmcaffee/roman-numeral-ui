import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IntegerToRomanNumeralComponent from '../IntegerToRomanNumeralComponent';
import { useRomanNumeralConverter } from '@/hooks/useRomanNumeralConverter';

// Mock the hook
jest.mock('@/hooks/useRomanNumeralConverter');
const mockUseRomanNumeralConverter = useRomanNumeralConverter as jest.MockedFunction<typeof useRomanNumeralConverter>;

// Mock React Spectrum components to avoid CSS module issues
jest.mock('@adobe/react-spectrum', () => ({
  View: ({ children, ...props }: any) => <div data-testid="view" {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 data-testid="heading" {...props}>{children}</h1>,
  Text: ({ children, ...props }: any) => <span data-testid="text" {...props}>{children}</span>,
  Button: ({ children, onClick, isDisabled, ...props }: any) => (
    <button data-testid="button" onClick={onClick} disabled={isDisabled} {...props}>
      {children}
    </button>
  ),
  TextField: ({ label, value, onChange, errorMessage, isDisabled, ...props }: any) => (
    <div data-testid="textfield">
      <label data-testid="label">{label}</label>
      <input
        data-testid="input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={isDisabled}
        {...props}
      />
      {errorMessage && <span data-testid="error">{errorMessage}</span>}
    </div>
  ),
  Form: ({ children, onSubmit, ...props }: any) => (
    <form data-testid="form" onSubmit={onSubmit} {...props}>
      {children}
    </form>
  ),
  InlineAlert: ({ children, ...props }: any) => (
    <div data-testid="alert" role="alert" {...props}>
      {children}
    </div>
  )
}));

jest.mock('@react-spectrum/layout', () => ({
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>
}));

describe('IntegerToRomanNumeralComponent - Core Functionality', () => {
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
    return render(<IntegerToRomanNumeralComponent />);
  };

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('heading')).toBeInTheDocument();
    });

    it('should display the correct heading', () => {
      renderComponent();
      expect(screen.getByText('Roman numeral converter')).toBeInTheDocument();
    });

    it('should render all required form elements', () => {
      renderComponent();
      
      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    it('should have correct initial state', () => {
      renderComponent();
      
      const input = screen.getByTestId('input');
      const button = screen.getByTestId('button');
      
      expect(input).toHaveValue('');
      expect(button).toHaveTextContent('Convert to roman numeral');
      expect(button).not.toBeDisabled();
      expect(screen.queryByText(/roman numeral:/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should accept user input in the text field', async () => {
      renderComponent();
      
      const input = screen.getByTestId('input');
      await user.type(input, '42');
      
      expect(input).toHaveValue('42');
    });

    it('should handle form submission with valid input', async () => {
      mockConvertToRomanNumeral.mockResolvedValue('XLII');
      
      renderComponent();
      
      const input = screen.getByTestId('input');
      const button = screen.getByTestId('button');
      
      await user.type(input, '42');
      await user.click(button);
      
      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('42');
      });
    });

    it('should handle form submission via Enter key', async () => {
      mockConvertToRomanNumeral.mockResolvedValue('XLII');
      
      renderComponent();
      
      const input = screen.getByTestId('input');
      
      await user.type(input, '42');
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('42');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during conversion', async () => {
      // Setup loading state
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: true,
        error: null,
        result: null
      });
      
      renderComponent();
      
      const button = screen.getByTestId('button');
      const input = screen.getByTestId('input');
      
      expect(button).toHaveTextContent('Converting...');
      expect(button).toBeDisabled();
      expect(input).toBeDisabled();
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
      
      const errorAlert = screen.getByTestId('alert');
      
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
      
      const button = screen.getByTestId('button');
      await user.click(button);
      
      await waitFor(() => {
        expect(mockConvertToRomanNumeral).toHaveBeenCalledWith('');
      });
    });
  });

  describe('Integration with Hook', () => {
    it('should call hook with correct parameters', async () => {
      mockConvertToRomanNumeral.mockResolvedValue('XLII');
      
      renderComponent();
      
      const input = screen.getByTestId('input');
      const button = screen.getByTestId('button');
      
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
      
      rerender(<IntegerToRomanNumeralComponent />);
      
      expect(screen.getByText('XLII')).toBeInTheDocument();
      
      // Error state
      mockUseRomanNumeralConverter.mockReturnValue({
        convertToRomanNumeral: mockConvertToRomanNumeral,
        isLoading: false,
        error: 'Test error',
        result: null
      });
      
      rerender(<IntegerToRomanNumeralComponent />);
      
      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.queryByText('XLII')).not.toBeInTheDocument();
    });
  });
}); 