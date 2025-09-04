import { useMemo } from 'react';
import { ClientJS } from 'clientjs';

export const STORAGE_KEY = 'app:deviceId';

type DeviceInfo = {
  deviceId: string;
  userAgent: string;
  platform: string;
  language: string;
  deviceName: string;
  screen: {
    width: number;
    height: number;
  };
  os: string;
  browser: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
};

type UseDeviceData = {
  deviceId: string;
  deviceInfo: DeviceInfo;
};


export function useDeviceData(): UseDeviceData {
  const deviceId = useMemo(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

      try {
        if(import.meta.env.MODE !== 'production'){
          throw new Error()
        }
        const client = new ClientJS()

          console.log(client.getBrowserData(),"getBrowserData")


        const fp = client.getFingerprint().toString();
        localStorage.setItem(STORAGE_KEY, fp);
        return fp;
      } catch {
        const uuid = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, uuid);
        return uuid;
      }
  }, []);

  const deviceInfo = useMemo<DeviceInfo>(() => {
    const ua = navigator.userAgent;
    const browser = detectBrowser(ua)
    return {
      deviceId: deviceId,
      userAgent: ua,
      platform: navigator.platform,
      language: navigator.language,
      deviceName: browser,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      os: detectOS(ua),
      browser,
      deviceType: detectDeviceType(ua),
    };
  }, [deviceId]);

  return { deviceId, deviceInfo };
}

function detectOS(ua: string): string {
  if (/Windows NT/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua)) return 'macOS';
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown';
}

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua) && /Version\//.test(ua)) return 'Safari';
  return 'Unknown';
}

function detectDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
}

/**
 * Exemplo de uso:
 *
 * import React from 'react';
 * import { useDeviceData } from './useDeviceId';
 *
 * function App() {
 *   const { deviceId, deviceInfo } = useDeviceData();
 *   return (
 *     <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
 *       <h1>Device ID:</h1>
 *       <pre>{deviceId}</pre>
 *       <h2>Informações do dispositivo:</h2>
 *       <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
 *     </div>
 *   );
 * }
 */
