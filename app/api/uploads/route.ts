import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const VALID_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extensionFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "bin";
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }
  if (!env.MEDIA) {
    return Response.json({ error: "Media storage is unavailable" }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose an image file to upload" }, { status: 400 });
  }
  if (!VALID_IMAGE_TYPES.has(file.type)) {
    return Response.json({ error: "Upload a JPG, PNG, WebP, or GIF image" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "Image must be 8 MB or smaller" }, { status: 400 });
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}-${safeName || `image.${extensionFor(file.type)}`}`;

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
    customMetadata: {
      uploadedBy: user.email,
      originalName: file.name,
    },
  });

  return Response.json({ url: `/api/uploads/${key}`, key });
}
