import { useState, useCallback, useMemo } from 'react';
import {Configuration, InputValidationError, RomanNumeralApi,} from '@/clients/roman-numeral-client';
import * as runtime from '@/clients/roman-numeral-client/runtime';
import { appConfig } from '@/config/appConfig';

interface UseRomanNumeralConverterResult {
  convertToRomanNumeral: (input: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export const useRomanNumeralConverter = (): UseRomanNumeralConverterResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Create API client with useMemo to prevent recreation on every render
  const api = useMemo(() => {
    const apiConfig = new Configuration({
      basePath: appConfig.getRomanNumeralClientConfig().baseUrl
    });
    return new RomanNumeralApi(apiConfig);
  }, []);

  const convertToRomanNumeral = useCallback(async (input: string): Promise<string> => {
    // Clear previous results and errors
    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      // We intentionally allow for any values, including text and invalid numbers,
      // so we can ensure the validation logic is enforced by the service,
      // rather than have duplicated logic on the client side.
      if (!input.trim()) {
        const errorMessage = 'Please enter a value.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const response = await api.convertIntegerToRomanNumeral(input as unknown as number);
      const romanNumeral = response.output;
      setResult(romanNumeral);
      return romanNumeral;
    } catch (err) {
      //if we have a bad request, we know that the response should be an InputValidationError
      if (err instanceof runtime.ResponseError && err.response.status == 400) {
        try{
          setError('error with 400');
          const inputValidationError = (await err.response.json()) as InputValidationError;
          //we only expect one here, but handle the use case where there could be multiple by joining them all together.
          const validationErrorMessage = inputValidationError.errorDetails.map(d => d.message).join(' ');
          setError(validationErrorMessage);
        } catch { //if we don't get the data back in the expected format, just display a generic error.
          setError('Unknown validation issue.  Please check your input.');
        }
      }else{
        const errorMessage = err instanceof Error ? err.message : 'Failed to convert number. Please try again.';
        setError(errorMessage);
      }
      throw new Error('error making api call');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    convertToRomanNumeral,
    isLoading,
    error,
    result
  };
};
