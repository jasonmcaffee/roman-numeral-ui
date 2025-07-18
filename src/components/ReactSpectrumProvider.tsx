"use client";

import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import ClientOnly from './ClientOnly';
import LoadingFallback from './LoadingFallback';

interface ReactSpectrumProviderProps {
  children: ReactNode;
}

export default function ReactSpectrumProvider({ children }: ReactSpectrumProviderProps) {
  const router = useRouter();

  return (
    <ClientOnly fallback={<LoadingFallback />}>
      <Provider theme={defaultTheme} locale="en" router={{navigate: router.push}}>
        {children}
      </Provider>
    </ClientOnly>
  );
} 