import { browserApiRequest } from "@/shared/api-client/browser";

interface IPresignedMedia {
  id: string;
  uploadUrl: string;
}

interface ICompletedMedia {
  url: string;
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const CONTAINER_ONLY_HOSTS = new Set(["host.docker.internal", "minio"]);

export function browserUploadUrl(uploadUrl: string, pageOrigin = window.location.origin): string {
  const signed = new URL(uploadUrl, pageOrigin);
  const page = new URL(pageOrigin);
  const loopbackHosts = ["localhost", "127.0.0.1", "::1"];
  const isRemoteLoopback =
    loopbackHosts.includes(signed.hostname) && !loopbackHosts.includes(page.hostname);

  if (!CONTAINER_ONLY_HOSTS.has(signed.hostname) && !isRemoteLoopback) return signed.toString();

  const proxyPath = signed.pathname.startsWith("/media/")
    ? signed.pathname
    : `/media${signed.pathname}`;
  return `${page.origin}${proxyPath}${signed.search}`;
}

async function imageDimensions(file: File): Promise<{ width?: number; height?: number }> {
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return {};
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("仅支持 JPEG、PNG、WebP 或 GIF 图片");
  }
  if (file.size > MAX_IMAGE_BYTES) throw new Error("图片不能超过 10 MB");
  const dimensionsPromise = imageDimensions(file);
  const pending = await browserApiRequest<IPresignedMedia>("/media/presign", {
    method: "POST",
    body: { fileName: file.name, mimeType: file.type, size: file.size }
  });
  const upload = await fetch(browserUploadUrl(pending.uploadUrl), {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file
  });
  if (!upload.ok) throw new Error(`图片上传失败（${upload.status}）`);
  const completed = await browserApiRequest<ICompletedMedia>(`/media/${pending.id}/complete`, {
    method: "POST",
    body: await dimensionsPromise
  });
  return browserUploadUrl(completed.url);
}
