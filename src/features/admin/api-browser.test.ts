import { afterEach, describe, expect, it, vi } from "vitest";

import { uploadPostImage } from "./api-browser";

function apiResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

describe("uploadPostImage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("presigns, uploads and completes an image", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        apiResponse(
          {
            id: "media-1",
            uploadUrl: "https://storage.example.test/upload/media-1"
          },
          201
        )
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(
        apiResponse({ url: "https://blog.example.test/media/media-1.png" }, 201)
      );
    vi.stubGlobal("fetch", fetchMock);
    const file = new File([new Uint8Array([1, 2, 3])], "sunset.png", { type: "image/png" });

    await expect(uploadPostImage(file)).resolves.toBe(
      "https://blog.example.test/media/media-1.png"
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/v1/media/presign",
      expect.objectContaining({ method: "POST", credentials: "include" })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://storage.example.test/upload/media-1",
      expect.objectContaining({ method: "PUT", body: file })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "/api/v1/media/media-1/complete",
      expect.objectContaining({ method: "POST", credentials: "include" })
    );
  });

  it("rejects unsupported files before requesting a presigned URL", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    const file = new File(["not-an-image"], "notes.txt", { type: "text/plain" });

    await expect(uploadPostImage(file)).rejects.toThrow("仅支持 JPEG、PNG、WebP 或 GIF 图片");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
