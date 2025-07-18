/**
 * LoadingFallback Component
 * 
 * A simple loading state component that is displayed while client-side components
 * are initializing. This provides a better user experience by showing a loading
 * indicator instead of a blank screen during the transition from server-side
 * rendering to client-side rendering.
 * 
 * This component is designed to be:
 * - Lightweight and fast to render
 * - Visually consistent with the application
 * - Non-intrusive during the loading process
 * 
 * Used as a fallback in ClientOnly components to provide visual feedback
 * while React Spectrum components are loading on the client side.
 */
export default function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div>Loading...</div>
    </div>
  );
} 