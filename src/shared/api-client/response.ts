export interface IApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface IApiErrorPayload {
  statusCode?: number;
  code?: string;
  message?: string;
  fields?: Record<string, string[]>;
  traceId?: string;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fields?: Record<string, string[]>;
  readonly traceId?: string;

  constructor(status: number, payload: IApiErrorPayload = {}) {
    super(payload.message ?? `请求失败（${status}）`);
    this.name = "ApiClientError";
    this.status = status;
    this.code = payload.code;
    this.fields = payload.fields;
    this.traceId = payload.traceId;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function readApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let payload: unknown;
  try {
    payload = text ? (JSON.parse(text) as unknown) : undefined;
  } catch {
    payload = undefined;
  }

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      isRecord(payload) ? (payload as IApiErrorPayload) : {}
    );
  }
  if (!isRecord(payload) || !("data" in payload)) {
    throw new ApiClientError(502, { code: "INVALID_API_RESPONSE", message: "服务返回格式不正确" });
  }
  return (payload as unknown as IApiEnvelope<T>).data;
}
