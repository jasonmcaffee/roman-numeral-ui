"use client";

import { 
  View, 
  Heading, 
  Text, 
  Button, 
  TextField
} from '@adobe/react-spectrum';
import { Flex } from '@react-spectrum/layout';
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
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
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

  // Handle conversion button press by ensuring value is entered, set is loading, and calling the api.
  const handleConvertButtonPress = useCallback(async () => {
    // Let's intentionally allow for invalid input (eg letters and invalid numbers), so we can ensure the validation logic is enforced by the service, rather than have duplicated logic.
    setResult('');
    setError('');
    if(!inputValue){
      setError('Please enter a value');
      return;
    }
    setIsLoading(true);

    try {
      //allow for non-numeric values so we can test out our backend.
      const response = await api.convertIntegerToRomanNumeral(inputValue as unknown as number);
      setResult(response.output);
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, api]);

  // Handle input change. Note: with number fields, change is only fired on blur, rather than when typing happens.
  const handleInputChange = useCallback((value: string | undefined) => {
    setInputValue(value);
    setError('');
    if (value == undefined) {
      setError('Please enter a value');
    }
  }, []);

  return (
    <View 
      padding="size-1000" 
      maxWidth="700px"
      margin="0 auto"
      height="100vh"
    >
      <Flex 
        direction="column" 
        justifyContent="center" 
        height="100%"
        gap="size-400"
      >
        {/* Title */}
        <Heading level={1} marginBottom="size-300" UNSAFE_style={{ textAlign: 'center' }}>
          Roman numeral converter
        </Heading>

        {/* Input Section */}
        <Flex 
          direction="column" 
          gap="size-200"
        >
          <TextField
            label={"Enter a number"}
            onChange={handleInputChange}
            value={inputValue}
            width={"100%"}
            isRequired={true}
          />
          {/* Alternatively, we can use a NumberField, however, it doesn't fire onChange until blur occurs, and also doesn't allow invalid values, like letters, etc. */}
          {/*<NumberField*/}
          {/*  label="Enter a number"*/}
          {/*  value={inputValue}*/}
          {/*  onChange={handleInputChange}*/}
          {/*  minValue={1}*/}
          {/*  maxValue={3999}*/}
          {/*  step={1}*/}
          {/*  hideStepper={true}*/}
          {/*  width="100%"*/}
          {/*  isRequired*/}
          {/*/>*/}

          <Button
            variant="primary"
            onPress={handleConvertButtonPress}
            isDisabled={isLoading}
            width="220px"
          >
            {isLoading ? 'Converting...' : 'Convert to roman numeral'}
          </Button>
        </Flex>

        {/* Result Section */}
        {result && (
          <View marginTop="size-300">
            <Text>
              Roman numeral: {result}
            </Text>
          </View>
        )}

        {/* Error Section */}
        {error && (
          <View marginTop="size-300">
            <Text UNSAFE_style={{ color: 'var(--spectrum-semantic-negative-color-text)' }}>
              {error}
            </Text>
          </View>
        )}
      </Flex>
    </View>
  );
}
