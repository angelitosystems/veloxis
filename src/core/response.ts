import type { VeloxisRequestConfig, VeloxisResponse } from '../types';
import { isJSONResponse } from '../utils/headers';
import { VeloxisError } from '../utils/errors';
import { debugLog } from '../utils/helpers';

/**
 * Parses the raw Fetch Response and wraps it in a VeloxisResponse.
 */
export async function parseResponse<T = any>(
  response: Response,
  config: VeloxisRequestConfig
): Promise<VeloxisResponse<T>> {
  let data: any;
  
  try {
    if (isJSONResponse(response.headers)) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch (error) {
    // If parsing fails, use an empty object or the original text
    data = {};
  }

  const veloxisResponse: VeloxisResponse<T> = {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config
  };

  if (!response.ok) {
    throw new VeloxisError(
      `Request failed with status ${response.status}`,
      config,
      'BAD_STATUS',
      veloxisResponse
    );
  }

  debugLog(config, `Response: ${response.status} ${config.url}`);
  return veloxisResponse;
}
