/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['mapbox-gl'],
  images: {
    // The project lives on an exFAT volume, where macOS writes `._` AppleDouble
    // sidecars next to every file. The optimizer's disk cache reads those
    // sidecars back as if they were the cached image, so it serves 4 KB of
    // metadata instead of the picture. The handful of symbol images are
    // pre-sized in /public, so serve them as-is.
    unoptimized: true,
  },
}

module.exports = nextConfig
