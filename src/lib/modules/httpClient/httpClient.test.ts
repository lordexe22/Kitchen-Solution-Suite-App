import { HttpClient } from './httpClient';
import { 
  HttpError, 
  NetworkError, 
  ValidationError, 
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError
} from './httpClient.errors';
import { 
  createAuthInterceptor, 
  createResponseLogInterceptor,
  createErrorLogInterceptor 
} from './httpClient.interceptors';
import type { ApiResponse, HttpResponse, RequestConfig, ResponseInterceptor } from './httpClient.types';

// Mock global fetch
global.fetch = jest.fn();

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('HttpClient', () => {
  let client: HttpClient;
  
  beforeEach(() => {
    client = new HttpClient({
      baseURL: 'https://api.example.com',
      timeout: 30000, // 30 segundos para evitar timeouts en tests
      retry: { maxRetries: 3, delay: 100 }
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // ...existing code...
});
