import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'media.gettyimages.com' },
      { protocol: 'https', hostname: 'rogueproduce.com' },
      { protocol: 'https', hostname: 'images.winecountrygiftbaskets.com' },
      { protocol: 'https', hostname: 'producebusiness.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.svgrepo.com' },
    ],
  }
};

export default nextConfig;
