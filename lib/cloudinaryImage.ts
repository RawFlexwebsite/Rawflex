import type { ImageLoaderProps } from "next/image";

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

export function cloudinaryImageLoader({ src, width }: ImageLoaderProps): string {
  return src.replace(
    CLOUDINARY_UPLOAD_SEGMENT,
    `${CLOUDINARY_UPLOAD_SEGMENT}f_auto,q_auto:good,c_limit,w_${width}/`
  );
}

export function cloudinaryLoaderFor(src: string | null | undefined) {
  return src?.startsWith("https://res.cloudinary.com/")
    ? cloudinaryImageLoader
    : undefined;
}
