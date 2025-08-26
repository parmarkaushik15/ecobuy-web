import FingerprintJS from '@fingerprintjs/fingerprintjs';

// ✅ Fetch IP geolocation from ip-api.com (free)
export async function getIpGeolocation() {
  try {
    const res = await fetch('http://ip-api.com/json/');
    const data = await res.json();

    return {
      query: data.query, // IP
      country: data.country,
      regionName: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      isp: data.isp,
      org: data.org,
      as: data.as
    };
  } catch (err) {
    console.error('IP API error:', err);
    return null;
  }
}

// ✅ Create WebGL Fingerprint
function getWebglFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  } catch {
    return null;
  }
}

// ✅ Get ThumbprintJS fingerprint + enrich with system info
export async function getDeviceFingerprint() {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    return {
      deviceId: result.visitorId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform,
      screenResolution: [window.screen.width, window.screen.height],
      colorDepth: window.screen.colorDepth,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      deviceMemory: navigator.deviceMemory || null,
      fonts: Array.from(document.fonts).map((f) => f.family), // modern browsers
      webglFingerprint: getWebglFingerprint(),
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage
    };
  } catch (err) {
    console.error('Fingerprint error:', err);
    return null;
  }
}

// ✅ Combine into final payload
export async function getDeviceInfo() {
  const ipGeolocation = await getIpGeolocation();
  const fingerprint = await getDeviceFingerprint();

  return {
    ipGeolocation,
    fingerprint
  };
}
