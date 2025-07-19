import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from '@adobe/react-spectrum';

// Test wrapper component with React Spectrum provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider>
    {children}
  </Provider>
);

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestWrapper, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Export the wrapper for manual use
export { TestWrapper }; 