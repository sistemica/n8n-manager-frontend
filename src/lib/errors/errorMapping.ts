import { ErrorCodes } from './errorCodes';

/**
 * Maps error patterns to error codes
 */
export const errorPatterns = [
  {
    pattern: /API request failed with status 401/i,
    code: ErrorCodes.STATUS_401
  },
  {
    pattern: /API request failed with status 404/i,
    code: ErrorCodes.STATUS_404
  },
  {
    pattern: /API request failed with status 500/i,
    code: ErrorCodes.STATUS_500
  },
  {
    pattern: /API request failed with status 502/i,
    code: ErrorCodes.STATUS_502
  },
  {
    pattern: /API request failed with status 503/i,
    code: ErrorCodes.STATUS_503
  },
  {
    pattern: /API request failed with status 504/i,
    code: ErrorCodes.STATUS_504
  },
  {
    pattern: /ECONNREFUSED/i,
    code: ErrorCodes.CONN_REFUSED
  },
  {
    pattern: /ETIMEDOUT/i,
    code: ErrorCodes.CONN_TIMEOUT
  },
  {
    pattern: /ENOTFOUND/i,
    code: ErrorCodes.CONN_HOST_NOT_FOUND
  },
  {
    pattern: /CERT_HAS_EXPIRED/i,
    code: ErrorCodes.SSL_CERT_EXPIRED
  },
  {
    pattern: /UNABLE_TO_VERIFY_LEAF_SIGNATURE/i,
    code: ErrorCodes.SSL_CERT_INVALID
  },
  {
    pattern: /SELF_SIGNED_CERT_IN_CHAIN/i,
    code: ErrorCodes.SSL_CERT_SELF_SIGNED
  }
];