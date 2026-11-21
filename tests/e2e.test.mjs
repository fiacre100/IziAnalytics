/**
 * IziAnalytics - Server & Real-World E2E Test Suite (Tier 4)
 * Framework: Node.js native test runner (node:test, node:assert/strict)
 * Target: http://localhost:3000
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

describe('Tier 4: Real-World Server & HTTP Verification', () => {
  it('GET / returns 200 OK and contains viewport meta tag for mobile responsiveness', async () => {
    const start = performance.now();
    const res = await fetch(`${BASE_URL}/`);
    const duration = performance.now() - start;

    assert.equal(res.status, 200, `Expected 200 OK but received ${res.status}`);
    assert.ok(duration < 2000, `Response took ${duration}ms, exceeding 2000ms threshold`);

    const contentType = res.headers.get('content-type') || '';
    assert.ok(contentType.includes('text/html'), `Expected text/html content-type but got "${contentType}"`);

    const html = await res.text();
    assert.ok(html.length > 500, 'Landing page HTML response is too short');

    // Viewport meta tag presence for mobile-first requirement
    assert.match(
      html,
      /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i,
      'HTML does not contain proper viewport meta tag with width=device-width'
    );

    // Branding presence
    assert.ok(
      html.includes('IziAnalytics') || html.includes('izianalytics'),
      'Landing page does not contain expected IziAnalytics branding'
    );
  });

  it('GET /dashboard returns 200 OK with valid HTML application shell', async () => {
    const start = performance.now();
    const res = await fetch(`${BASE_URL}/dashboard`);
    const duration = performance.now() - start;

    assert.equal(res.status, 200, `Expected 200 OK but received ${res.status}`);
    assert.ok(duration < 2000, `Response took ${duration}ms, exceeding 2000ms threshold`);

    const contentType = res.headers.get('content-type') || '';
    assert.ok(contentType.includes('text/html'), `Expected text/html content-type but got "${contentType}"`);

    const html = await res.text();
    assert.ok(html.length > 500, 'Dashboard HTML response is too short');
  });

  it('POST /api/collect with valid website_id returns 200 OK and tracking confirmation', async () => {
    const payload = {
      website_id: 'izi_live_test_suite',
      path: '/pricing',
      referrer: 'https://tiktok.com',
      source: 'tiktok',
    };

    const res = await fetch(`${BASE_URL}/api/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    assert.equal(res.status, 200, `Expected 200 OK from collector but received ${res.status}`);

    const json = await res.json();
    assert.equal(json.status, 'tracked', 'Expected status: "tracked" in collector response');
    assert.ok(json.mode === 'demo' || json.mode === 'live', `Unexpected tracking mode: "${json.mode}"`);
  });

  it('POST /api/collect with missing website_id returns 400 Bad Request error', async () => {
    const invalidPayload = {
      path: '/test-without-id',
    };

    const res = await fetch(`${BASE_URL}/api/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidPayload),
    });

    assert.equal(res.status, 400, `Expected 400 Bad Request but received ${res.status}`);

    const json = await res.json();
    assert.ok(
      json.error && json.error.toLowerCase().includes('website_id'),
      `Expected error message referencing website_id, got: ${JSON.stringify(json)}`
    );
  });

  it('Adversarial: POST /api/collect with malformed payload returns 400 or handles gracefully', async () => {
    const res = await fetch(`${BASE_URL}/api/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'MALFORMED_NON_JSON_STRING',
    });

    // Should return 400 or 500 without crashing the server process
    assert.ok([400, 500].includes(res.status), `Server responded with unexpected status ${res.status}`);
  });

  it('GET /script.js serves the lightweight client tracking script (< 5 KB)', async () => {
    const res = await fetch(`${BASE_URL}/script.js`);
    assert.equal(res.status, 200, `Expected 200 OK for /script.js but got ${res.status}`);

    const scriptText = await res.text();
    assert.ok(scriptText.length > 100, 'Script is empty or too small');
    // PRD requirement: lightweight script < 5 KB
    assert.ok(
      scriptText.length < 5120,
      `Script size (${scriptText.length} bytes) exceeds 5 KB lightweight requirement`
    );
    assert.ok(
      scriptText.includes('data-site') || scriptText.includes('website_id') || scriptText.includes('collect'),
      'Script does not contain expected collector logic'
    );
  });

  it('GET /non-existent-route returns 404 Not Found cleanly', async () => {
    const res = await fetch(`${BASE_URL}/non-existent-route-${Date.now()}`);
    assert.equal(res.status, 404, `Expected 404 Not Found but received ${res.status}`);
  });
});
