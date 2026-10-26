import { test } from "node:test";
import assert from "node:assert/strict";
import { handleMetaEvents } from "../src/lib/meta-events.server.ts";
const originalFetch = globalThis.fetch;
const event = (id: string, name = "PageView") => ({
  event_name: name,
  event_id: id,
  event_source_url: "https://office.example/?email=never-forward-this",
  custom_data: { value: 0.01, email: "private@example.com" },
  fbp: "fb.1.1793040000000.123456",
});
function request(body: unknown, origin = "https://office.example") {
  return new Request("https://office.example/api/meta-events", {
    method: "POST",
    headers: {
      origin,
      "Content-Type": "application/json",
      "User-Agent": "QA",
      "cf-connecting-ip": "192.0.2.4",
    },
    body: JSON.stringify(body),
  });
}
test("relay validates events, keeps secrets server-side, strips data and deduplicates", async () => {
  const sent: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = (async (url, init) => {
    sent.push({ url: String(url), init });
    return Response.json({ events_received: 1 });
  }) as typeof fetch;
  try {
    assert.equal(
      (await handleMetaEvents(request(event("cross-origin-123"), "https://other.example"))).status,
      403,
    );
    assert.equal(
      (await handleMetaEvents(request(event("purchase-123456", "Purchase")))).status,
      400,
    );
    assert.equal((await handleMetaEvents(request(event("pending-123456")), {})).status, 503);
    const bindings = { META_CAPI_ACCESS_TOKEN: "unit-test-secret" };
    const first = await handleMetaEvents(
      request(event("deduplicated-123", "InitiateCheckout")),
      bindings,
    );
    assert.equal(first.status, 200);
    assert.deepEqual(await first.json(), { accepted: true });
    assert.equal(sent.length, 1);
    assert.equal(
      new Headers(sent[0].init?.headers).get("authorization"),
      "Bearer unit-test-secret",
    );
    assert.ok(!sent[0].url.includes("unit-test-secret"));
    const payload = JSON.parse(String(sent[0].init?.body));
    assert.equal(payload.data[0].event_id, "deduplicated-123");
    assert.equal(payload.data[0].event_source_url, "https://office.example/");
    assert.equal(payload.data[0].custom_data.value, 9.99);
    assert.equal(payload.data[0].custom_data.email, undefined);
    assert.equal(payload.data[0].user_data.email, undefined);
    assert.deepEqual(
      await (
        await handleMetaEvents(request(event("deduplicated-123", "InitiateCheckout")), bindings)
      ).json(),
      { accepted: true, duplicate: true },
    );
    assert.equal(sent.length, 1);
    assert.equal(
      (
        await handleMetaEvents(
          request({ ...event("large-body-123"), extra: "x".repeat(5000) }),
          bindings,
        )
      ).status,
      413,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
