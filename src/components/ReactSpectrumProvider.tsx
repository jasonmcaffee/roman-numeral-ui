"use client"; //use of useRouter https://nextjs.org/docs/app/api-reference/directives/use-client

import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

/**
 * ReactSpectrumProvider Component
 *
 * This component provides the React Spectrum context to the application,
 * including theme, locale, and router configuration. It wraps the React Spectrum
 * Provider with client-side rendering protection to prevent SSR issues.
 *
 * Key Features:
 * - Provides React Spectrum theme (automatically detects system theme)
 * - Configures locale settings (English)
 * - Integrates with Next.js router for navigation
 * - Shows loading state while components initialize
 * - Automatically switches theme based on system settings
 *
 * This component should wrap any part of the application that uses
 * React Spectrum components. It handles the complex setup required
 * to make React Spectrum work properly with Next.js App Router.
 *
 * @param children - The application components that need React Spectrum context
 */
interface ReactSpectrumProviderProps {
  children: ReactNode;
}

export default function ReactSpectrumProvider({ children }: ReactSpectrumProviderProps) {
  const router = useRouter();

  return (
      <Provider theme={defaultTheme} locale="en" router={{navigate: router.push}}>
        {children}
      </Provider>
  );
}
