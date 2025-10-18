export const env = import.meta.env.VITE_ENV;
export const isDev = env === 'development';
export const isProd = env === 'production';

declare global {
    interface Window {
        env: string;
    }
}

window.env = env;
