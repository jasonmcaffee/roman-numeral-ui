"use client";

import { ReactNode, useEffect, useState } from 'react';

/**
 * ClientOnly Component
 * 
 * This component ensures that its children are only rendered on the client side,
 * preventing server-side rendering (SSR) issues with components that depend on
 * browser APIs or client-side state.
 * 
 * Use this wrapper for components that:
 * - Use React Spectrum components (which are client-side only)
 * - Access browser APIs (window, document, localStorage, etc.)
 * - Use hooks that depend on client-side state
 * - Need to avoid hydration mismatches
 * 
 * @param children - The components to render on the client side
 * @param fallback - Optional component to show while client-side rendering is initializing
 */
interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component mounts on the client side
  // This ensures we only render the children after hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show fallback (or nothing) during server-side rendering and initial hydration
  if (!isClient) {
    return <>{fallback}</>;
  }

  // Render children only after we're confirmed to be on the client side
  return <>{children}</>;
} 