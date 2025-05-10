export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function createBackendBaseApi(): BaseApi {
  const API_BASE_URL = process.env.API_BASE_URL
  return new BaseApi(API_BASE_URL as string)
}

export function createSuccessResult<T>(data: T): Result<T> {
  return {
    ok: true,
    value: data
  };
}

export function createErrorResult<T>(error: string): Result<T> {
  return {
    ok: false,
    error: new Error(error)
  };
}

class BaseApi {
  baseUrl: string = "";

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<Result<T>> {
    return this.request<T>(endpoint, 'GET');
  }

  async post<T, D = unknown>(endpoint: string, data?: D): Promise<Result<T>> {
    return this.request<T>(endpoint, 'POST', data);
  }

  async put<T, D = unknown>(endpoint: string, data?: D): Promise<Result<T>> {
    return this.request<T>(endpoint, 'PUT', data);
  }

  async delete<T>(endpoint: string): Promise<Result<T>> {
    return this.request<T>(endpoint, 'DELETE');
  }

  private async request<T>(
    endpoint: string,
    method: string,
    data?: unknown
  ): Promise<Result<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.text();
          console.error(`API error response for ${url}:`, errorBody);
        } catch (e) {
          console.error(`Failed to read error response for ${url}:`, e);
        }
        return createErrorResult<T>(`API error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      return createSuccessResult<T>(responseData.data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return createErrorResult<T>(`Network error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export default BaseApi; 
