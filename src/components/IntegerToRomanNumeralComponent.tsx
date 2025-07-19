"use client"; //use of useState https://nextjs.org/docs/app/api-reference/directives/use-client

import React from 'react';
import {
  View,
  Heading,
  Text,
  Button,
  TextField,
  Form,
  InlineAlert,
} from '@adobe/react-spectrum';
import { Flex } from '@react-spectrum/layout';
import { useState, useCallback } from 'react';
import { useRomanNumeralConverter } from '@/hooks/useRomanNumeralConverter';

type IntegerToRomanNumeralComponentProps = Record<never, never>;

/**
 * Component which provides functionality for converting integers to Roman numerals, using the roman-numeral-client.
 * Logic for calling the api, error formatting, etc is contained in the useRomanNumeralHook, for better separation of concerns
 * and readability.
 *
 * React spectrum documentation that was referenced:
 * Form - https://github.com/adobe/react-spectrum/blob/dd1603a07247317310207b8ff5c3c1302a8b7f10/packages/@react-spectrum/form/docs/Form.mdx#L1-L1
 * TextField - https://github.com/adobe/react-spectrum/blob/dd1603a07247317310207b8ff5c3c1302a8b7f10/packages/@react-spectrum/textfield/docs/TextField.mdx#L1-L1
 * - Note: NumberField was intentionally not used so that we could allow for invalid input and show error messaging, purely for demonstration purposes.
 * View - https://github.com/adobe/react-spectrum/blob/dd1603a07247317310207b8ff5c3c1302a8b7f10/packages/@react-spectrum/view/docs/View.mdx#L2-L2
 * Flex - https://github.com/adobe/react-spectrum/blob/dd1603a07247317310207b8ff5c3c1302a8b7f10/packages/@react-spectrum/layout/docs/Flex.mdx#L1-L1
 * etc
 * @constructor
 */
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
            gap="size-400"
          >
            {/* TextField with proper validation and accessibility */}
            {/* Based on react-spectrum TextField.mdx: "Validation" and "Labeling" sections */}
            {/* Note: NumberField was intentionally not used so that we could allow for invalid input and show error messaging.  */}
            <TextField
              label="Enter a number"
              aria-label={"Enter a number"}
              name="number"
              value={inputValue}
              onChange={handleInputChange}
              isRequired
              necessityIndicator="label"
              validationState={error ? 'invalid' : undefined}
              errorMessage={error}
              isDisabled={isLoading}
              width="100%"
            />

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              aria-label={"Submit button"}
              isDisabled={isLoading}
              width="220px"
            >
              {isLoading ? 'Converting...' : 'Convert to roman numeral'}
            </Button>
          </Flex>
        </Form>

        {/* Result Section */}
        {result && (
          <View>
            <Text>
              <strong>Roman numeral:</strong> {result}
            </Text>
          </View>
        )}

        {/* Form-level error alert - positioned at bottom */}
        {/* Based on react-spectrum Form.mdx: "Focus management" section */}
        {error && (
          <InlineAlert variant="negative">
            Please fix the errors and try again.
          </InlineAlert>
        )}
      </Flex>
    </View>
  );
};

export default IntegerToRomanNumeralComponent;
