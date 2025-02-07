export default {
  status: {
    400: 'Invalid request data',
    401: 'Authentication failed. Please check your credentials.',
    403: 'Access denied. You don\'t have permission to perform this action.',
    404: 'Resource not found. Please check the URL.',
    500: 'Server error occurred. Please try again later.',
    502: 'Bad gateway. The server might be down.',
    503: 'Service unavailable. The server might be overloaded.',
    504: 'Gateway timeout. The server is not responding.',
  },
  network: {
    offline: 'You appear to be offline. Please check your internet connection.',
    timeout: 'The request timed out. Please try again.',
  },
  connection: {
    refused: 'Connection refused. The server might be down or unreachable.',
    timeout: 'Connection timed out. The server is not responding.',
    hostNotFound: 'Host not found. Please check the URL.',
  },
  ssl: {
    certExpired: 'SSL certificate has expired.',
    certInvalid: 'Invalid SSL certificate. Consider enabling "Ignore SSL".',
    selfSigned: 'Self-signed certificate detected. Consider enabling "Ignore SSL".',
  },
  validation: {
    generic: 'Validation error: {{error}}',
  },
  server: {
    generic: 'A server error occurred. Please try again later.',
  },
  unexpected: 'An unexpected error occurred. Please try again.',
  default: 'Connection failed. Please check the configuration.',
};