# Roman Numeral Converter

A Next.js application for converting between integers and Roman numerals, built with React Spectrum components.

## Features

- Convert integers to Roman numerals
- Modern, accessible UI using Adobe's React Spectrum design system
- Responsive design that works on all devices
- Built with Next.js 15 and TypeScript

## Dependencies 

### Adobe Spectrum

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

Open [http://localhost:3001](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app/page.tsx` - Home page with navigation
- `/src/app/integer-to-roman/page.tsx` - Integer to Roman numeral conversion page
- `/src/app/layout.tsx` - Root layout with React Spectrum providers

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React Spectrum](https://react-spectrum.adobe.com/) - Adobe's design system
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
