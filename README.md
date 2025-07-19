# Roman Numeral UI

A Next.js application for converting integers to Roman numerals using React Spectrum components.


## Features

- Convert integers to Roman numerals
- Modern, accessible UI using Adobe's React Spectrum design system
- Responsive design that works on all devices
- Built with Next.js 15 and TypeScript

## Dependencies 

### Next.js
Next.js is a react framework that provides building blocks for creating fast, scalable web applications.
- Server Side Rendering - allows fast page loads to improve SEO and UX
- Client Side Rendering - allows for fast re-rendering of dynamic content, providing better UX

### Roman Numeral Service
The backend web service that provides the functionality related to Roman numeral conversion, etc.

This project uses a openapi generated client based on the roman-numeral-openapi-spec.json provided by the service.

https://github.com/jasonmcaffee/roman-numeral-service

### React Spectrum
[React Spectrum](https://react-spectrum.adobe.com/)
#### 1. React Stately (@react-stately/*) - State Management Layer
Platform-agnostic state management
Responsibilities:
- Complex logic for collections, selection, and component state
- No UI rendering, just state management
- Cross-platform (web, React Native, UXP)
- No theme or design system specific logic

Examples: `useNumberFieldState`, `useToggleState`, `useSelectState`

#### 2. React Aria (@react-aria/*) - Behavior & Accessibility Layer
Platform-specific behavior and accessibility
Responsibilities:
- Event handling, focus management, accessibility, internationalization
- Platform-specific (DOM, React Native, etc.)
- No theme or design system specific logic
- Returns props to be spread onto rendered elements

Examples: `useNumberField`, `useButton`, `useTextField`

#### 3. React Spectrum (@adobe/react-spectrum) - UI Layer
Theme and design system specific
Responsibilities:
- Actual DOM structure and styling
- Uses props from behavior hook and state from state hook
- Implements Adobe's Spectrum design system
- Can be customized with themes

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Configuration

### Environment Variables

The application uses environment variables store in .env file for configuration.  You can override with .env.development, etc.

- npm run dev → development
- npm run build → production
- npm run start → production

#### Available Environment Variables
Note: The prefix NEXT_PUBLIC_ is needed for env variables needed by the browser.

- `NEXT_PUBLIC_ROMAN_NUMERAL_SERVICE_BASE_URL`: The base URL for the backend API service (default: `http://localhost:3000`)

### Backend Service

This UI connects to a backend Roman Numeral service. Make sure the backend service is running and accessible at the URL specified in `NEXT_PUBLIC_ROMAN_NUMERAL_SERVICE_BASE_URL`.


## Project Structure

### App
Directory for our pages.

### Components
Where we house our components used by various pages.

### Hooks
Our components use hooks, which help us separate our business logic, api calls, etc 

### Clients
Where we store clients, including the openapi generated client for our Roman Numeral Service.

# Testing Implementation for Roman Numeral UI
Our testing strategy follows patterns found in the react-spectrum library.

## Testing Stack

- **Jest** - Test runner and assertion library
- **@testing-library/react** - React component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM assertions
- **jsdom** - DOM environment for testing
- **ts-jest** - TypeScript support for Jest

## Test Structure
Tests are stored in __tests__ subfolders

__test__/test-utils.tsx -  
components/__tests__ - tests related to rendering, as well as integration with our hooks
hooks/__tests__ - tests related to our hooks
__mocks__ - mocks for static assets and svg imports

## Test Categories

### 1. Hook Tests
**Test Categories**:
- **Initial State**: Hook initialization and API client setup
- **Success Cases**: Successful API calls and response handling
- **Input Validation**: Empty and whitespace-only input handling
- **Error Handling**: Network errors and unknown error scenarios
- **State Management**: Loading states and result clearing
- **API Client Memoization**: Ensuring API client is not recreated on re-renders


### 2. Component Tests

**Test Categories**:
- **Component Rendering**: Initial render and element presence
- **User Interactions**: Input handling and form submissions
- **Loading States**: UI feedback during API calls
- **Success States**: Result display after successful conversions
- **Error Handling**: Validation errors and error message display
- **Form Validation**: Empty form submission handling
- **Integration with Hook**: Hook integration and state reflection


## Testing Patterns

### Test Organization

**AAA Pattern (Arrange, Act, Assert)**:
We divide our tests into 3 distinct sections, which help us understand the purpose of each part.
- Arrange - set up everything needed for the test, such as configuring the environment and initialization.
- Act - execute the code we want to test.
- Assert - verify the outcomes.

### User-Centric Testing
We use @testing-library/user-event to provide realist user interactions with clicks, typing, enter key press, etc.

## Configuration

### Jest Configuration (`jest.config.js`)
Setup for our test environment, including module resolution, test matching patterns, etc.

### Test Setup (`src/setupTests.ts`)

- Jest DOM extensions
- IntersectionObserver and ResizeObserver mocks
- Console error/warning suppression for expected messages
- Global test cleanup

## Running Tests

### All Tests
```bash
npm test
```

## Best Practices Implemented

1. **Test Behavior, Not Implementation**: Tests focus on user interactions and outcomes
2. **Semantic Queries**: Use `getByTestId`, `getByText` over implementation details
3. **Realistic User Interactions**: Use `userEvent` for realistic user behavior
4. **Comprehensive Error Testing**: Test various error scenarios and edge cases
5. **State Management Testing**: Verify loading states and state transitions
6. **Accessibility Testing**: Ensure components work with screen readers
7. **Mock Isolation**: Properly isolate components and hooks for testing



