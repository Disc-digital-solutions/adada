/* eslint-disable @next/next/no-img-element */

/**
 * A square picture of an item. A plain <img> on purpose: today's pictures are small
 * sample drawings. When real photos are stored in the database's file storage,
 * this is the one place to switch to an optimised image.
 */
export function Photo({
  src,
  alt,
  eager = false,
  className = "",
}: {
  src: string;
  alt: string;
  /** Load at once (the first picture on a page) instead of when scrolled near. */
  eager?: boolean;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={400}
      height={400}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
