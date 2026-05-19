const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  path: string;
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildHeaders(options: RequestOptions): Headers {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (globalThis.window) {
    const token = localStorage.getItem("token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

function buildConfig(options: RequestOptions): RequestInit {
  const { body, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: buildHeaders(options),
  };

  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  return config;
}

async function handleApiError(response: Response): Promise<never> {
  let errorMessage = "An unexpected error occurred";
  let statusCode = response.status;

  try {
    const errorData = (await response.json()) as ApiErrorResponse;

    if (errorData) {
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
      }

      if (errorData.statusCode) {
        statusCode = errorData.statusCode;
      }
    }
  } catch {
    // Fallback
  }

  throw new ApiError(statusCode, errorMessage);
}

async function responseData<T>(response: Response): Promise<T> {
  try {
    const json = await response.json();

    if (
      json &&
      typeof json === "object" &&
      "success" in json &&
      "data" in json
    ) {
      return (json as { data: T }).data;
    }

    return json as T;
  } catch {
    return {} as T;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const config = buildConfig(options);

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    await handleApiError(response);
  }

  return responseData<T>(response);
}
