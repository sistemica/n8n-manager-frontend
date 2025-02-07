/**
 * Defines all possible error codes and their translation keys
 */
export const ErrorCodes = {
  // HTTP Status Codes
  STATUS_400: 'errors.status.400',
  STATUS_401: 'errors.status.401',
  STATUS_403: 'errors.status.403',
  STATUS_404: 'errors.status.404',
  STATUS_500: 'errors.status.500',
  STATUS_502: 'errors.status.502',
  STATUS_503: 'errors.status.503',
  STATUS_504: 'errors.status.504',

  // Network Errors
  NETWORK_OFFLINE: 'errors.network.offline',
  NETWORK_TIMEOUT: 'errors.network.timeout',
  
  // Connection Errors
  CONN_REFUSED: 'errors.connection.refused',
  CONN_TIMEOUT: 'errors.connection.timeout',
  CONN_HOST_NOT_FOUND: 'errors.connection.hostNotFound',
  
  // SSL/TLS Errors
  SSL_CERT_EXPIRED: 'errors.ssl.certExpired',
  SSL_CERT_INVALID: 'errors.ssl.certInvalid',
  SSL_CERT_SELF_SIGNED: 'errors.ssl.selfSigned',

  // Validation Errors
  VALIDATION_ERROR: 'errors.validation.generic',
  
  // Generic Errors
  SERVER_ERROR: 'errors.server.generic',
  UNEXPECTED_ERROR: 'errors.unexpected',
  DEFAULT_ERROR: 'errors.default'
} as const;