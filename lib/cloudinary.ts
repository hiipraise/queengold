const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "";

export function getCloudinaryImage(src: string, options?: { width?: number; height?: number; crop?: string; quality?: string }) {
  if (!src) return src;
  if (!cloudName || src.includes("res.cloudinary.com")) return src;
  const width = options?.width ?? 1200;
  const height = options?.height;
  const crop = options?.crop ?? "fill";
  const quality = options?.quality ?? "auto";
  const transforms = ["f_auto", `q_${quality}`, `w_${width}`];
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  const encoded = src.startsWith("http") ? `fetch/${encodeURIComponent(src)}` : `image/upload/${src.replace(/^\//, "")}`;
  return `https://res.cloudinary.com/${cloudName}/${encoded}?tr=${transforms.join(",")}`;
}
