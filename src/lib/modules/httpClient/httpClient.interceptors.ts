import type { RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './httpClient.types';
import { AuthenticationError } from './httpClient.errors';

export const createAuthInterceptor = (getToken: string | (() => string | null)): RequestInterceptor => {
  return (config) => {
    const token = typeof getToken === 'function' ? getToken() : getToken;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  };
};

export const createLogInterceptor = (logger: (message: string) => void = console.log): RequestInterceptor => {
  return (config) => {
    logger(`🚀 ${config.method || 'GET'} ${config.url}`);
    return config;
  };
};

export const createResponseLogInterceptor = (logger: (message: string) => void = console.log): ResponseInterceptor => {
  return (response) => {
    logger(`✅ ${response.status} ${response.statusText}`);
    return response;
  };
};

export const createErrorLogInterceptor = (logger: (message: string) => void = console.error): ErrorInterceptor => {
  return (error) => {
    const isAuth401 = (
      error instanceof AuthenticationError ||
      ('status' in error && typeof (error as { status: unknown }).status === 'number' && (error as { status: number }).status === 401)
    );

    if (!isAuth401) {
      logger(`❌ Error: ${error.message}`);
    }

    throw error;
  };
};
