import test from "node:test";
import assert from "node:assert/strict";
import { generateAuthorHash, sanitizeReviewText, generateAnonymousLabel } from "../utils/privacy.js";

test("Privacy Security: Customer identities must be irreversible and free of PII", async (t) => {
  await t.test("HMAC author hash does not expose raw customer ID or email", () => {
    const rawId = "user_65fd1a892b1";
    const hash1 = generateAuthorHash(rawId);
    const hash2 = generateAuthorHash(rawId);

    assert.equal(hash1, hash2, "HMAC should be deterministic for internal rate limiting");
    assert.ok(!hash1.includes(rawId), "Hash must never leak original ID");
    assert.equal(hash1.length, 64, "SHA-256 output length");
  });

  await t.test("Anonymous labels should never contain personal information", () => {
    const label = generateAnonymousLabel(42);
    assert.match(label, /^(Verified Diner|Evening Guest|Weekend Diner|Food Enthusiast|Lunch Diner|Local Explorer) #\d+$/);
    assert.ok(!label.includes("@"));
  });

  await t.test("Review text sanitizer strips accidental email and phone leaks", () => {
    const textWithPII = "Great food! Reach me at user.john@example.com or call 987-654-3210 for table reservation";
    const sanitized = sanitizeReviewText(textWithPII);

    assert.ok(!sanitized.includes("user.john@example.com"));
    assert.ok(!sanitized.includes("987-654-3210"));
    assert.ok(sanitized.includes("[email redacted]"));
    assert.ok(sanitized.includes("[phone redacted]"));
  });
});

