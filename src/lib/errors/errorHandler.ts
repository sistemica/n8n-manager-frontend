import { ClientResponseError } from 'pocketbase';
import i18n from '../i18n';
import { ErrorCodes } from './errorCodes';
import { errorPatterns } from './errorMapping';

/**
 * Maps an error message to an error code using the defined patterns
 */
function mapErrorToCode(error: Error | string): string {
  const message = error instanceof Error ? error.message : error;
  
  for (const { pattern, code } of errorPatterns) {
    if (pattern.test(message)) {
      return code;
    }
  }
  
  return ErrorCodes.DEFAULT_ERROR;
}

/**
 * Handles API errors and throws a translated error message
 */
export function handleApiError(error: any): never {
  if (error instanceof ClientResponseError) {
    // Handle validation errors (400)
    if (error.response.code === 400) {
      const firstError = Object.values(error.response.data)[0];
      throw new Error(i18n.t(ErrorCodes.VALIDATION_ERROR, { 
        error: Array.isArray(firstError) ? firstError[0] : String(firstError) 
      }));
    }
    
    // Map other API errors
    const errorCode = mapErrorToCode(error.message);
    throw new Error(i18n.t(errorCode));
  }
  
  // Handle network/connection errors
  if (error instanceof Error) {
    const errorCode = mapErrorToCode(error);
    throw new Error(i18n.t(errorCode));
  }
  
  // Handle unexpected errors
  throw new Error(i18n.t(ErrorCodes.UNEXPECTED_ERROR));
}