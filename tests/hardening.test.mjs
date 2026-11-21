/**
 * IziAnalytics - Hardening & Vulnerability Mitigation Test Suite
 * Validates mitigations for Challenger 1 findings:
 * 1. Storage poisoning resilience (null/sparse array items)
 * 2. Primary key collision prevention in same-millisecond site creations
 * 3. Domain sanitization for query strings and hash anchors without trailing slash
 * 4. Tracking ID collision detection and regeneration
 * 5. Defense-in-depth in validateLicenseKey
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

function loadStorageModule() {
  const filePath = path.resolve('src/lib/storage.ts');
  const source = fs.readFileSync(filePath, 'utf-8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`);
}

class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.get(key) ?? null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

const mockStorage = new MockLocalStorage();
globalThis.window = { localStorage: mockStorage };

const storage = await loadStorageModule();

describe('Hardening & Adversarial Resilience Verification', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('Fix 1: Storage poisoning with [null] or sparse arrays recovers gracefully without crashing getActiveSite()', () => {
    // Inject array containing null, undefined, primitive, and empty object
    mockStorage.setItem(
      storage.STORAGE_KEYS.SITES,
      JSON.stringify([null, undefined, 123, "string", {}, { id: "", name: "" }])
    );

    // getStoredSites should filter out all invalid entries and fall back to DEFAULT_SITES
    const sites = storage.getStoredSites();
    assert.ok(Array.isArray(sites));
    assert.equal(sites.length, 3);
    assert.equal(sites[0].name, 'CalFood Africa');

    // getActiveSite() must not throw TypeError
    assert.doesNotThrow(() => {
      const active = storage.getActiveSite();
      assert.ok(active);
      assert.equal(active.name, 'CalFood Africa');
    });

    // Test with mixed valid and invalid sites
    const validCustomSite = {
      id: 'site_valid_custom',
      name: 'Custom Valid SaaS',
      domain: 'custom.sn',
      trackingId: 'izi_live_12345678',
      currency: 'FCFA',
      createdAt: new Date().toISOString(),
      isConnected: true,
      stats: {
        uniqueVisitors: 10,
        visitorsChangePct: 0,
        yesterdayVisitors: 10,
        topSource: 'Direct',
        topSourceClicks: 10,
        revenue: 1000,
        currency: 'FCFA',
        salesCount: 1,
        conversionRate: 10,
        gateways: [],
        hourlyTraffic: [],
      },
    };

    mockStorage.setItem(
      storage.STORAGE_KEYS.SITES,
      JSON.stringify([null, validCustomSite, undefined, {}])
    );

    const filteredSites = storage.getStoredSites();
    assert.equal(filteredSites.length, 1);
    assert.equal(filteredSites[0].id, 'site_valid_custom');

    const activeSite = storage.getActiveSite();
    assert.equal(activeSite.id, 'site_valid_custom');
  });

  it('Fix 2: Synchronous creation of 50 sites in the same millisecond generates 50 unique IDs with no shadowing', () => {
    const sitesCount = 50;
    const createdSites = [];

    for (let i = 0; i < sitesCount; i++) {
      createdSites.push(
        storage.addStoredSite({
          name: `Rapid Site ${i}`,
          domain: `rapid-${i}.com`,
        })
      );
    }

    const uniqueIds = new Set(createdSites.map((s) => s.id));
    assert.equal(
      uniqueIds.size,
      sitesCount,
      `Expected ${sitesCount} unique IDs, but got ${uniqueIds.size}`
    );

    // Verify all 50 can be individually activated and retrieved via getActiveSite()
    for (let i = 0; i < sitesCount; i++) {
      const target = createdSites[i];
      storage.setActiveSiteId(target.id);
      const active = storage.getActiveSite();
      assert.equal(
        active.id,
        target.id,
        `Site shadowing detected: active site ${active.id} !== target ${target.id}`
      );
      assert.equal(active.name, `Rapid Site ${i}`);
    }
  });

  it('Fix 3: Domain sanitization cleanly strips query parameters and hash fragments without slashes', () => {
    // Cases highlighted by Challenger 1
    assert.equal(storage.sanitizeDomain('example.com?query=1'), 'example.com');
    assert.equal(storage.sanitizeDomain('example.com#anchor'), 'example.com');
    assert.equal(storage.sanitizeDomain('example.com?token=xyz#step2'), 'example.com');
    assert.equal(storage.sanitizeDomain('example.com:8080?token=xyz'), 'example.com');
    assert.equal(storage.sanitizeDomain('example.com:8080#tab'), 'example.com');
    assert.equal(storage.sanitizeDomain('sub.domain.sn?key=val&utm=test#top'), 'sub.domain.sn');
    assert.equal(storage.sanitizeDomain('https://mysite.com?foo=bar'), 'mysite.com');
    assert.equal(storage.sanitizeDomain('http://api.tech.sn#section'), 'api.tech.sn');
    assert.equal(storage.sanitizeDomain('ftp://files.company.africa?auth=1'), 'files.company.africa');

    // Type safety edge cases
    assert.equal(storage.sanitizeDomain(null), '');
    assert.equal(storage.sanitizeDomain(undefined), '');
    assert.equal(storage.sanitizeDomain(12345), '');
    assert.equal(storage.sanitizeDomain({}), '');
  });

  it('Fix 4: addStoredSite detects trackingId collisions and regenerates a unique trackingId', () => {
    // Add first site with specific tracking ID
    const initialSite = storage.addStoredSite({
      name: 'Existing SaaS',
      domain: 'existing.sn',
      trackingId: 'izi_live_collision_test',
    });
    assert.equal(initialSite.trackingId, 'izi_live_collision_test');

    // Attempt to add another site with the exact same tracking ID
    const collidingSite = storage.addStoredSite({
      name: 'Colliding SaaS',
      domain: 'colliding.sn',
      trackingId: 'izi_live_collision_test',
    });

    // The new site's trackingId must be regenerated and unique
    assert.notEqual(
      collidingSite.trackingId,
      'izi_live_collision_test',
      'Collision was not resolved: trackingId remained the same'
    );
    assert.match(
      collidingSite.trackingId,
      /^izi_live_[a-z0-9]{6,12}$/,
      'Regenerated tracking ID must match format'
    );
  });

  it('Fix 5: validateLicenseKey handles non-string and malformed inputs with defense-in-depth', () => {
    assert.equal(storage.validateLicenseKey(null), false);
    assert.equal(storage.validateLicenseKey(undefined), false);
    assert.equal(storage.validateLicenseKey(12345), false);
    assert.equal(storage.validateLicenseKey({}), false);
    assert.equal(storage.validateLicenseKey([]), false);
    assert.equal(storage.validateLicenseKey(true), false);
    assert.equal(storage.validateLicenseKey(''), false);
    assert.equal(storage.validateLicenseKey('   '), false);
    assert.equal(storage.validateLicenseKey('IZI-PRO-1234-5678-2026'), true);
  });

  it('Fix 6: Domain validation requiring dot and minimum length', () => {
    // Simulating validation condition in AddSiteModal:
    // !sanitizedDomain || sanitizedDomain.length < 3 || !sanitizedDomain.includes('.')
    const isValidDomain = (raw) => {
      const sanitized = storage.sanitizeDomain(raw);
      if (!sanitized || sanitized.length < 3 || !sanitized.includes('.')) {
        return false;
      }
      return true;
    };

    assert.equal(isValidDomain('example.com'), true);
    assert.equal(isValidDomain('sub.domain.co'), true);
    assert.equal(isValidDomain('a.b'), true);
    assert.equal(isValidDomain('https://monsaas.sn/pricing?ref=1'), true);

    // Invalid inputs that lack a dot or are too short
    assert.equal(isValidDomain('localhost'), false);
    assert.equal(isValidDomain('<img src=x onerror=alert(1)>'), false);
    assert.equal(isValidDomain('javascript:alert(1)'), false);
    assert.equal(isValidDomain('..'), false);
    assert.equal(isValidDomain(''), false);
  });
});
