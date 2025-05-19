import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
