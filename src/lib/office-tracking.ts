// Public Pixel ID only. API access tokens belong exclusively in server secrets.
export const META_PIXEL_ID = "1418598996441763";
type Parameters = Record<string, string | number>;
type PixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: PixelFunction;
  loaded: boolean;
  version: string;
};
declare global {
  interface Window {
    fbq?: PixelFunction;
    _fbq?: PixelFunction;
    officeTrackingReady?: boolean;
  }
}
const standard = new Set(["PageView", "ViewContent", "InitiateCheckout"]);
const allowed = new Set([
  ...standard,
  "ClickParaOferta",
  "VSL_Play",
  "VSL_25",
  "VSL_50",
  "VSL_75",
  "VSL_Complete",
]);
function cookie(name: string) {
  return document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
export function trackEvent(name: string, parameters: Parameters = {}) {
  if (typeof window === "undefined" || !allowed.has(name)) return;
  const eventId =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    window.fbq?.(standard.has(name) ? "track" : "trackCustom", name, parameters, {
      eventID: eventId,
    });
  } catch {
    /* Tracking must never block the page. */
  }
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  const fbc =
    cookie("_fbc") ||
    (fbclid && /^[A-Za-z0-9_-]{1,500}$/.test(fbclid) ? `fb.1.${Date.now()}.${fbclid}` : undefined);
  void fetch("/api/meta-events", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: name,
      event_id: eventId,
      event_source_url: `${location.origin}${location.pathname}`,
      custom_data: parameters,
      fbp: cookie("_fbp"),
      fbc,
    }),
  }).catch(() => {});
}
export function initializeTracking() {
  if (typeof window === "undefined" || window.officeTrackingReady) return;
  window.officeTrackingReady = true;
  if (!window.fbq) {
    const pixel = function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else pixel.queue.push(args);
    } as PixelFunction;
    pixel.queue = [];
    pixel.loaded = true;
    pixel.version = "2.0";
    pixel.push = pixel;
    window.fbq = pixel;
    window._fbq ??= pixel;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  window.fbq("init", META_PIXEL_ID);
  trackEvent("PageView");
}
