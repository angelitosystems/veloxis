import type { VeloxisRequestConfig, VeloxisResponse } from '../types';

/**
 * Custom error class for Veloxis library.
 */
export class VeloxisError extends Error {
  config: VeloxisRequestConfig;
  response?: VeloxisResponse;
  status?: number;
  code?: string;

  constructor(
    message: string,
    config: VeloxisRequestConfig,
    code?: string,
    response?: VeloxisResponse
  ) {
    super(message);
    this.name = 'VeloxisError';
    this.config = config;
    this.code = code;
    this.response = response;
    this.status = response?.status;

    Object.setPrototypeOf(this, VeloxisError.prototype);
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      code: this.code,
      status: this.status,
      config: this.config,
    };
  }
}
