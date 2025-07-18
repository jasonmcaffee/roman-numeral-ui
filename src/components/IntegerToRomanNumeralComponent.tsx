"use client";

import React from 'react';
import {
  View,
  Heading,
  Text,
  Button,
  TextField,
  Form,
  InlineAlert,
  Content
} from '@adobe/react-spectrum';
import { Flex } from '@react-spectrum/layout';
import { useState, useCallback } from 'react';
import { useRomanNumeralConverter } from '@/hooks/useRomanNumeralConverter';

type IntegerToRomanNumeralComponentProps = Record<never, never>;

const IntegerToRomanNumeralComponent: React.FC<IntegerToRomanNumeralComponentProps> = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const { convertToRomanNumeral, isLoading, error, result } = useRomanNumeralConverter();

  // Handle form submission following React Spectrum best practices
  // Based on react-spectrum forms.mdx: "Uncontrolled forms" and "Server validation" sections
  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data using FormData API as recommended in documentation
    const formData = new FormData(e.currentTarget);
    const numberValue = formData.get('number') as string;
    // Allow for any non-empty value so we can test out our backend validation
    await convertToRomanNumeral(numberValue);
  }, [convertToRomanNumeral]);

  // Handle input change for controlled component
  // Based on react-spectrum forms.mdx: "Controlled forms" section
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
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
        gap="size-400"
      >
        {/* Title with proper heading structure */}
        <Heading level={1} marginBottom="size-300">
          Roman numeral converter
        </Heading>

        {/* Form with proper validation behavior */}
        {/* Based on react-spectrum Form.mdx: "Validation behavior" section */}
        <Form
          onSubmit={handleFormSubmit}
          maxWidth="size-3000"
          aria-label="Roman numeral conversion form"
        >
          {/* Input Section */}
          <Flex
            direction="column"
            gap="size-200"
            marginBottom="size-300"
          >
            {/* TextField with proper validation and accessibility */}
            {/* Based on react-spectrum TextField.mdx: "Validation" and "Labeling" sections */}
            <TextField
              label="Enter a number"
              name="number"
              value={inputValue}
              onChange={handleInputChange}
              isRequired
              necessityIndicator="label"
              description="Enter a number between 1 and 3999 to convert to Roman numerals."
              validationState={error ? 'invalid' : undefined}
              errorMessage={error}
              isDisabled={isLoading}
              width="100%"
            />

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              isDisabled={isLoading}
              width="220px"
            >
              {isLoading ? 'Converting...' : 'Convert to roman numeral'}
            </Button>
          </Flex>
        </Form>

        {/* Result Section */}
        {result && (
          <View marginTop="size-300">
            <Text>
              <strong>Roman numeral:</strong> {result}
            </Text>
          </View>
        )}

        {/* Form-level error alert - positioned at bottom */}
        {/* Based on react-spectrum Form.mdx: "Focus management" section */}
        {error && (
          <InlineAlert variant="negative" marginTop="size-200">
            <Content>
              Please fix the errors below and try again.
            </Content>
          </InlineAlert>
        )}
      </Flex>
    </View>
  );
};

export default IntegerToRomanNumeralComponent;
