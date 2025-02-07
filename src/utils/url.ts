/**
 * Extracts the path from a webhook URL without protocol and hostname
 */
export function getWebhookPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.replace('/webhook/', '');
  } catch {
    return url;
  }
}

/**
 * Extracts the host without protocol from a URL
 */
export function getHostWithoutProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

/**
 * Extracts the protocol from a URL
 */
export function getProtocol(url: string): 'http' | 'https' {
  return url.startsWith('https://') ? 'https' : 'http';
}

/**
 * Safely parses methods string into an array
 */
export function parseMethods(methodsStr: string): string[] {
  try {
    // If it's already an array, return it
    if (Array.isArray(methodsStr)) return methodsStr;
    
    // If it's a JSON string, parse it
    if (typeof methodsStr === 'string' && methodsStr.startsWith('[')) {
      return JSON.parse(methodsStr);
    }
    
    // If it's a single method string, wrap it in an array
    return [methodsStr];
  } catch {
    console.warn('Failed to parse methods:', methodsStr);
    return [];
  }
}