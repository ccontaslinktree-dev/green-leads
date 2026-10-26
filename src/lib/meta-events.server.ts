import { officeOffer } from "../data/office-offer.ts";
// Imported only by the SSR server entry. No credential is part of the client build.
const PIXEL_ID = "1418598996441763";
const ALLOWED = new Set([
  "PageView",
  "ViewContent",
  "InitiateCheckout",
  "ClickParaOferta",
  "Funnel_Step",
  "Funnel_Advance",
  "VSL_Play",
  "VSL_25",
  "VSL_50",
  "VSL_75",
  "VSL_Complete",
]);
type Bindings = Record<string, unknown>;
type MetaEvent = {
  event_name: string;
  event_id: string;
  event_source_url: string;
  fbp?: string;
  fbc?: string;
  custom_data?: Record<string, unknown>;
};
const buckets = new Map<string, { count: number; expires: number }>();
const seen = new Map<string, number>();
let cachedToken: { value: string; expires: number } | undefined;
const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
function setting(bindings: Bindings, name: string): string {
  const value = bindings[name] ?? (typeof process !== "undefined" ? process.env[name] : undefined);
  return typeof value === "string" ? value : "";
}
async function accessToken(bindings: Bindings) {
  const direct = setting(bindings, "META_CAPI_ACCESS_TOKEN");
  if (direct) return direct;
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.value;
  const base = setting(bindings, "SUPABASE_URL");
  const key =
    setting(bindings, "SUPABASE_SERVICE_ROLE_KEY") || setting(bindings, "SUPABASE_SECRET_KEY");
  if (!base || !key || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base)) return null;
  const response = await fetch(`${base}/rest/v1/rpc/office_meta_token`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(3500),
  });
  if (!response.ok) return null;
  const value: unknown = await response.json();
  if (typeof value !== "string" || !value) return null;
  cachedToken = { value, expires: Date.now() + 60_000 };
  return value;
}
export async function handleMetaEvents(request: Request, bindings: Bindings = {}) {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const origin = new URL(request.url).origin;
  if (
    request.headers.get("origin") !== origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return json({ error: "forbidden" }, 403);
  if (!(request.headers.get("content-type") ?? "").includes("application/json"))
    return json({ error: "invalid_content_type" }, 415);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  if (buckets.size > 5000)
    for (const [key, bucket] of buckets) if (bucket.expires < now) buckets.delete(key);
  const bucket = buckets.get(ip);
  if (bucket && bucket.expires > now) {
    if (bucket.count >= 35) return json({ error: "rate_limited" }, 429);
    bucket.count++;
  } else buckets.set(ip, { count: 1, expires: now + 60_000 });
  let payload: MetaEvent;
  try {
    // Bounded reader protects against streamed bodies without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "invalid_event" }, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        return json({ error: "too_large" }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ error: "invalid_event" }, 400);
  }
  if (
    !payload ||
    !ALLOWED.has(payload.event_name) ||
    typeof payload.event_id !== "string" ||
    !/^[a-zA-Z0-9_-]{10,100}$/.test(payload.event_id)
  )
    return json({ error: "invalid_event" }, 400);
  let source: URL;
  try {
    source = new URL(payload.event_source_url);
    if (source.origin !== origin) throw new Error();
  } catch {
    return json({ error: "invalid_source" }, 400);
  }
  if (seen.size > 2000) for (const [id, expires] of seen) if (expires < now) seen.delete(id);
  if ((seen.get(payload.event_id) ?? 0) > now) return json({ accepted: true, duplicate: true });
  const custom: Record<string, string | number> = {};
  for (const name of ["content_name", "local", "video"]) {
    const value = payload.custom_data?.[name];
    if (typeof value === "string" && value.length < 100) custom[name] = value;
  }
  if (["ViewContent", "InitiateCheckout"].includes(payload.event_name)) {
    custom.value = officeOffer.price;
    custom.currency = "BRL";
  }
  const userData: Record<string, string> = {
    client_user_agent: request.headers.get("user-agent") ?? "",
  };
  if (ip !== "unknown") userData.client_ip_address = ip;
  for (const name of ["fbp", "fbc"] as const)
    if (
      typeof payload[name] === "string" &&
      /^fb\.[0-9]+\.[0-9]+\.[A-Za-z0-9_.-]{1,600}$/.test(payload[name])
    )
      userData[name] = payload[name];
  try {
    const token = await accessToken(bindings);
    if (!token) return json({ accepted: false, reason: "server_configuration_pending" }, 503);
    const response = await fetch(`https://graph.facebook.com/v23.0/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        data: [
          {
            event_name: payload.event_name,
            event_time: Math.floor(now / 1000),
            event_id: payload.event_id,
            action_source: "website",
            event_source_url: `${source.origin}${source.pathname}`,
            user_data: userData,
            custom_data: custom,
          },
        ],
      }),
      signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) return json({ accepted: false, reason: "upstream_unavailable" }, 502);
    const result = (await response.json()) as { events_received?: number };
    if (result.events_received !== 1)
      return json({ accepted: false, reason: "event_not_accepted" }, 502);
    seen.set(payload.event_id, now + 300_000);
    return json({ accepted: true });
  } catch {
    return json({ accepted: false, reason: "upstream_unavailable" }, 502);
  }
}
