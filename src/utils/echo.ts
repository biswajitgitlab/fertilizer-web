import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

window.Pusher = Pusher;

const isHttps = (import.meta.env.VITE_REVERB_SCHEME || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http')) === 'https';
const defaultHost = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'localhost' : 'fertilizer-reverb.onrender.com';

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY || '5t7x7ob2inhvggzfyba5',
  wsHost: import.meta.env.VITE_REVERB_HOST || defaultHost,
  wsPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 443,
  forceTLS: isHttps,
  enabledTransports: ['ws', 'wss'],
  disabledTransports: ['sockjs', 'xhr_streaming', 'xhr_polling'],
});

// Suppress infinite connection failure console spam when local/remote WebSocket server is offline or fails handshake
let failedCount = 0;
try {
  const pusher = (echo as any).connector?.pusher;
  if (pusher?.connection) {
    pusher.connection.bind('error', () => {
      failedCount++;
      if (failedCount >= 2) {
        try {
          echo.disconnect();
        } catch {
          // ignore
        }
      }
    });

    pusher.connection.bind('state_change', (states: { current: string }) => {
      if (states.current === 'unavailable' || states.current === 'failed') {
        failedCount++;
        if (failedCount >= 2) {
          try {
            echo.disconnect();
          } catch {
            // ignore
          }
        }
      } else if (states.current === 'connected') {
        failedCount = 0;
      }
    });
  }
} catch {
  // fail safe
}

