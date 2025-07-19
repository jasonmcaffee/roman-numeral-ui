export const appConfig = {
    getRomanNumeralClientConfig() {
        return {
            baseUrl: process.env.NEXT_PUBLIC_ROMAN_NUMERAL_SERVICE_BASE_URL || 'http://localhost:3000',
        };
    }
};
