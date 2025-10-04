/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default config;
