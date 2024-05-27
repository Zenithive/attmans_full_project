// next.config.js

import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  // Your existing Next.js configuration
  env: {
    SERVER_URL: process.env.SERVER_URL || ""
  }
};

export default nextConfig;
