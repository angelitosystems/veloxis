/**
 * Utility to check if a response has a JSON content type.
 */
export function isJSONResponse(headers: Headers): boolean {
  const contentType = headers.get('content-type');
  return !!contentType && contentType.includes('application/json');
}
