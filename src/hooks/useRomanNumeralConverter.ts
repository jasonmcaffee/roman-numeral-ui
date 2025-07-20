import { useState, useCallback, useMemo } from 'react';
import { RomanNumeralApi, Configuration, InputValidationError } from '../clients/roman-numeral-client';
import * as runtime from '../clients/roman-numeral-client/runtime';
import { appConfig } from '../config/appConfig';

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
    const startTime = Date.now();

    // Clear previous results and errors
    setResult(null);
    setError(null);
    setIsLoading(true);

    // Log conversion attempt using structured logging
    console.info({
      msg: 'Roman numeral conversion requested',
      input,
    });

    try {
      // we intentionally allow for any values, including text and invalid numbers, so we can ensure the validation logic
      // is enforced by the service, rather than have duplicated logic on the client side.
      if (!input.trim()) {
        const errorMessage = 'Please enter a value.';
        setError(errorMessage);

        // Log validation error
        console.error({
          msg: 'Roman numeral conversion validation error',
          input,
          error: errorMessage,
        });

        throw new Error(errorMessage);
      }

      const response = await api.convertIntegerToRomanNumeral(input as unknown as number);
      const romanNumeral = response.output;
      setResult(romanNumeral);

      // Log successful conversion
      const responseTime = Date.now() - startTime;
      console.info({
        msg: 'Roman numeral conversion successful',
        input,
        output: romanNumeral,
        responseTime,
      });

      return romanNumeral;
    } catch (err: unknown) {
      // if we have a bad request, we know that the response should be an InputValidationError
      if (err instanceof runtime.ResponseError && err.response.status == 400) {
        try{
          const inputValidationError = (await err.response.json()) as InputValidationError;
          // we only expect one here, but handle the use case where there could be multiple by joining them all together.
          const validationErrorMessage = inputValidationError.errorDetails.map((d: any) => d.message).join(' ');
          setError(validationErrorMessage);

          // Log validation error from API
          console.error({
            msg: 'Roman numeral conversion API validation error',
            input,
            error: validationErrorMessage,
            status: err.response.status,
          });
        } catch { // if we don't get the data back in the expected format, just display a generic error.
          const genericError = 'Unknown validation issue.  Please check your input.';
          setError(genericError);

          console.error({
            msg: 'Roman numeral conversion API error parsing failed',
            input,
            error: genericError,
            status: err instanceof runtime.ResponseError ? err.response.status : 'unknown',
          });
        }
      }else{
        const errorMessage = err instanceof Error ? err.message : 'Failed to convert number. Please try again.';
        setError(errorMessage);

        // Log general error
        console.error({
          msg: 'Roman numeral conversion failed',
          input,
          error: errorMessage,
        });
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
