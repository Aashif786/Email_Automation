/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_N8N_WEBHOOK_URL:
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
      process.env.REACT_APP_N8N_WEBHOOK_URL ||
      '/api',
    NEXT_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_API_KEY ||
      process.env.REACT_APP_API_KEY ||
      '',
  },
};

module.exports = nextConfig;
