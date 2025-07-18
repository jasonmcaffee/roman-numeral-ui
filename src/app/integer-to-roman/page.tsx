"use client";

import { 
  View, 
  Heading, 
  Text, 
  NumberField, 
  Button
} from '@adobe/react-spectrum';
import ReactSpectrumProvider from '@/components/ReactSpectrumProvider';
import { appConfig } from '@/config/appConfig';
import { Configuration, RomanNumeralApi } from '@/clients/roman-numeral-client';
import { useState, useCallback, useMemo } from 'react';

export default function IntegerToRoman() {
  return (
    <ReactSpectrumProvider>
      <IntegerToRomanContent />
    </ReactSpectrumProvider>
  );
}

function IntegerToRomanContent() {
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Create API client with useMemo to prevent recreation on every render
  const api = useMemo(() => {
    const apiConfig = new Configuration({ 
      basePath: appConfig.getRomanNumeralClientConfig().baseUrl 
    });
    return new RomanNumeralApi(apiConfig);
  }, []);

  // Handle conversion
  const handleConvert = useCallback(async () => {
    if (!inputValue || inputValue < 1 || inputValue > 3999) {
      setError('Please enter a valid integer between 1 and 3999');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const response = await api.convertIntegerToRomanNumeral(inputValue);
      setResult(response.output);
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, api]);

  // Handle input change
  const handleInputChange = useCallback((value: number | undefined) => {
    setInputValue(value);
    setError('');
    if (value !== undefined && (value < 1 || value > 3999)) {
      setError('Please enter a valid integer between 1 and 3999');
    }
  }, []);

  const isValid = inputValue !== undefined && inputValue >= 1 && inputValue <= 3999;

  return (
    <View 
      padding="size-1000" 
      maxWidth="400px" 
      margin="0 auto"
      height="100vh"
      UNSAFE_style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <View 
        UNSAFE_style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spectrum-global-dimension-size-400)'
        }}
      >
        {/* Title */}
        <Heading level={1} marginBottom="size-300" UNSAFE_style={{ textAlign: 'center' }}>
          Roman numeral converter
        </Heading>

        {/* Input Section */}
        <View 
          UNSAFE_style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spectrum-global-dimension-size-200)'
          }}
        >
          <NumberField
            label="Enter a number"
            value={inputValue}
            onChange={handleInputChange}
            minValue={1}
            maxValue={3999}
            step={1}
            width="100%"
            isRequired
          />
          
          <Button
            variant="primary"
            onPress={handleConvert}
            isDisabled={!isValid || isLoading}
            width="100%"
          >
            {isLoading ? 'Converting...' : 'Convert to roman numeral'}
          </Button>
        </View>

        {/* Result Section */}
        {result && (
          <View marginTop="size-300">
            <Text>
              Roman numeral: {result}
            </Text>
          </View>
        )}

        {/* Error Section */}
        {error && !result && (
          <View marginTop="size-300">
            <Text UNSAFE_style={{ color: 'var(--spectrum-semantic-negative-color-text)' }}>
              {error}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
} 