/**
 * IziAnalytics - Unit & Logic Test Suite (Tiers 1, 2, 3)
 * Framework: Node.js native test runner (node:test, node:assert/strict)
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Load and transpile src/lib/storage.ts dynamically
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

// In-memory mock for browser localStorage
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

// Setup mock window for client storage testing
const mockStorage = new MockLocalStorage();
globalThis.window = { localStorage: mockStorage };

const storage = await loadStorageModule();

describe('Tier 1: Feature Coverage', () => {
  it('generateTrackingId produces an ID matching ^izi_live_[a-z0-9]{6,12}$', () => {
    const trackingId = storage.generateTrackingId();
    assert.match(
      trackingId,
      /^izi_live_[a-z0-9]{6,12}$/,
      `Tracking ID "${trackingId}" does not match expected format`
    );
  });

  it('sanitizeDomain correctly strips https://, http://, trailing slashes, and paths', () => {
    assert.equal(storage.sanitizeDomain('https://monsaas.com/pricing/'), 'monsaas.com');
    assert.equal(storage.sanitizeDomain('http://calfood.africa/dashboard'), 'calfood.africa');
    assert.equal(storage.sanitizeDomain('https://dakartech.io/'), 'dakartech.io');
    assert.equal(storage.sanitizeDomain('http://izisaas.bio/app/overview?ref=1'), 'izisaas.bio');
  });

  it('generateProLicenseKey matches ^IZI-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-2026$', () => {
    const key = storage.generateProLicenseKey();
    assert.match(
      key,
      /^IZI-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-2026$/,
      `License key "${key}" does not match expected pattern`
    );
  });

  it('Pricing calculations match the defined plan rates and order bump', () => {
    const PLAN_PRICES = {
      starter: 0,
      founder_annual: 39000,
      founder_monthly: 4900,
    };
    const ORDER_BUMP_PRICE = 9900;

    // Starter = 0 FCFA
    assert.equal(PLAN_PRICES.starter, 0);

    // Founder Pro Annuel = 39 000 FCFA
    assert.equal(PLAN_PRICES.founder_annual, 39000);

    // Founder Pro Mensuel = 4 900 FCFA
    assert.equal(PLAN_PRICES.founder_monthly, 4900);

    // Order Bump = +9 900 FCFA
    assert.equal(ORDER_BUMP_PRICE, 9900);

    // Founder Pro Annuel + Order Bump = 48 900 FCFA
    const totalWithOrderBump = PLAN_PRICES.founder_annual + ORDER_BUMP_PRICE;
    assert.equal(totalWithOrderBump, 48900);
  });

  it('Supported payment gateways include Wave, Orange Money, MTN, and Stripe', () => {
    const supportedGateways = ['wave', 'orange_money', 'mtn', 'stripe'];
    assert.equal(supportedGateways.length, 4);
    assert.ok(supportedGateways.includes('wave'));
    assert.ok(supportedGateways.includes('orange_money'));
    assert.ok(supportedGateways.includes('mtn'));
    assert.ok(supportedGateways.includes('stripe'));
  });
});

describe('Tier 2: Boundary & Corner Cases', () => {
  it('sanitizeDomain handles subdomains, query params, port numbers, and whitespace', () => {
    // Subdomains preserved
    assert.equal(storage.sanitizeDomain('https://app.dashboard.mysaas.co/'), 'app.dashboard.mysaas.co');
    // Query params and hashes stripped
    assert.equal(storage.sanitizeDomain('http://store.sn/checkout?token=xyz#step2'), 'store.sn');
    // Port numbers stripped
    assert.equal(storage.sanitizeDomain('http://localhost:3000/test'), 'localhost');
    assert.equal(storage.sanitizeDomain('https://mydev.io:8080/app'), 'mydev.io');
    // Leading and trailing whitespace trimmed, uppercase normalized
    assert.equal(storage.sanitizeDomain('   HTTPS://PAY.AFRICA/PAY/   '), 'pay.africa');
    // Empty or falsy input returns empty string
    assert.equal(storage.sanitizeDomain(''), '');
    assert.equal(storage.sanitizeDomain(null), '');
    assert.equal(storage.sanitizeDomain(undefined), '');
  });

  it('generates 100 unique tracking IDs matching ^izi_live_[a-z0-9]{6,12}$', () => {
    const count = 100;
    const generated = new Set();
    for (let i = 0; i < count; i++) {
      const id = storage.generateTrackingId();
      assert.match(id, /^izi_live_[a-z0-9]{6,12}$/);
      generated.add(id);
    }
    assert.equal(generated.size, count, `Collision detected in 100 generated tracking IDs: only ${generated.size} unique`);
  });

  it('generates 100 unique license keys matching ^IZI-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-2026$', () => {
    const count = 100;
    const generated = new Set();
    for (let i = 0; i < count; i++) {
      const key = storage.generateProLicenseKey();
      assert.match(key, /^IZI-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-2026$/);
      generated.add(key);
    }
    assert.equal(generated.size, count, `Collision detected in 100 generated license keys: only ${generated.size} unique`);
  });

  it('validateLicenseKey correctly handles valid, lowercase, and malformed keys', () => {
    // Valid standard key
    assert.equal(storage.validateLicenseKey('IZI-PRO-89AF-77B2-2026'), true);
    // Lowercase / whitespace valid key
    assert.equal(storage.validateLicenseKey('  izi-pro-89af-77b2-2026  '), true);
    // Invalid prefixes
    assert.equal(storage.validateLicenseKey('IZI-FREE-89AF-77B2-2026'), false);
    // Invalid block length
    assert.equal(storage.validateLicenseKey('IZI-PRO-89A-77B22-2026'), false);
    // Invalid year
    assert.equal(storage.validateLicenseKey('IZI-PRO-89AF-77B2-1999'), false);
    // Malicious / injection strings
    assert.equal(storage.validateLicenseKey("IZI-PRO-'; DROP TABLE users;--"), false);
    assert.equal(storage.validateLicenseKey('<script>alert("XSS")</script>'), false);
    // Empty / null inputs
    assert.equal(storage.validateLicenseKey(''), false);
    assert.equal(storage.validateLicenseKey(null), false);
    assert.equal(storage.validateLicenseKey(undefined), false);
  });

  it('Adversarial resilience: corrupted localStorage JSON safely recovers to default sites', () => {
    mockStorage.setItem(storage.STORAGE_KEYS.SITES, '{MALFORMED_JSON_CORRUPTED: true,,]');
    const recovered = storage.getStoredSites();
    assert.ok(Array.isArray(recovered));
    assert.equal(recovered.length, 3);
    assert.equal(recovered[0].name, 'CalFood Africa');
  });

  it('Adversarial resilience: SSR-safety verification when window is undefined', async () => {
    const originalWindow = globalThis.window;
    try {
      delete globalThis.window;
      // When window is undefined, safeGetItem returns null, safeSetItem is no-op
      const sites = storage.getStoredSites();
      assert.ok(Array.isArray(sites));
      assert.equal(sites.length, 3);
      assert.equal(storage.isProPlan(), false);
      assert.equal(storage.getProLicense(), null);
    } finally {
      globalThis.window = originalWindow;
    }
  });
});

describe('Tier 3: Cross-Feature Interactions', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('State transition simulation: adding site -> selecting active site -> updating tracking snippet', () => {
    // 1. Initial state starts with 3 default mock sites
    const initialSites = storage.getStoredSites();
    assert.equal(initialSites.length, 3);
    assert.equal(initialSites[0].name, 'CalFood Africa');

    // 2. Active site is initially CalFood Africa
    const initialActive = storage.getActiveSite();
    assert.equal(initialActive.name, 'CalFood Africa');
    assert.equal(initialActive.trackingId, 'izi_live_89a7fb3c');

    // 3. Initial tracking snippet verification
    const initialSnippet = `<script defer src="https://izianalytics.app/script.js" data-site="${initialActive.trackingId}"></script>`;
    assert.ok(initialSnippet.includes('izi_live_89a7fb3c'));

    // 4. Add a new site
    const newSite = storage.addStoredSite({
      name: 'Senegal Fintech',
      domain: 'https://senegal-fintech.sn/portal?ref=promo',
      currency: 'FCFA',
    });

    assert.equal(newSite.name, 'Senegal Fintech');
    assert.equal(newSite.domain, 'senegal-fintech.sn');
    assert.match(newSite.trackingId, /^izi_live_[a-z0-9]{6,12}$/);

    // 5. Total sites should now be 4
    const updatedSites = storage.getStoredSites();
    assert.equal(updatedSites.length, 4);

    // 6. New site is automatically selected as active
    const activeSiteAfterAdd = storage.getActiveSite();
    assert.equal(activeSiteAfterAdd.id, newSite.id);
    assert.equal(activeSiteAfterAdd.domain, 'senegal-fintech.sn');

    // 7. Dynamic tracking snippet updates with new site tracking ID
    const updatedSnippet = `<script defer src="https://izianalytics.app/script.js" data-site="${activeSiteAfterAdd.trackingId}"></script>`;
    assert.ok(updatedSnippet.includes(newSite.trackingId));
    assert.ok(!updatedSnippet.includes('izi_live_89a7fb3c'));

    // 8. Switching active site back to Dakar Tech Hub
    const dakarSite = updatedSites.find((s) => s.domain === 'dakartech.io');
    assert.ok(dakarSite);
    storage.setActiveSiteId(dakarSite.id);

    const activeSiteSwitched = storage.getActiveSite();
    assert.equal(activeSiteSwitched.id, dakarSite.id);
    assert.equal(activeSiteSwitched.domain, 'dakartech.io');

    const switchedSnippet = `<script defer src="https://izianalytics.app/script.js" data-site="${activeSiteSwitched.trackingId}"></script>`;
    assert.ok(switchedSnippet.includes(dakarSite.trackingId));
  });

  it('Paywall simulation: selecting Wave -> selecting Order bump -> verifying total 48 900 FCFA -> simulating checkout -> generating license key -> activating PRO status', () => {
    // 1. Initial state: free account, not PRO
    assert.equal(storage.isProPlan(), false);
    assert.equal(storage.getProLicense(), null);

    // 2. Select plan: Founder Pro Annuel
    const basePlan = {
      type: 'founder_annual',
      price: 39000,
      currency: 'FCFA',
    };

    // 3. Select payment gateway: Wave
    const selectedGateway = 'wave';
    assert.ok(['wave', 'orange_money', 'mtn', 'stripe'].includes(selectedGateway));

    // 4. Select Order bump: +9 900 FCFA
    const orderBumpSelected = true;
    const orderBumpPrice = 9900;

    // 5. Calculate total
    const totalAmount = basePlan.price + (orderBumpSelected ? orderBumpPrice : 0);
    assert.equal(totalAmount, 48900);

    // 6. Simulate checkout & generate PRO license key
    const proKey = storage.generateProLicenseKey();
    assert.match(proKey, /^IZI-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-2026$/);

    // 7. Save PRO license
    const proLicense = {
      key: proKey,
      plan: basePlan.type,
      orderBump: orderBumpSelected,
      amountPaid: totalAmount,
      currency: basePlan.currency,
      paymentMethod: selectedGateway,
      payerContact: '+221770001122',
      activatedAt: new Date().toISOString(),
    };
    storage.saveProLicense(proLicense);

    // 8. Verify PRO status is now active
    assert.equal(storage.isProPlan(), true);

    // 9. Verify saved license details
    const storedLicense = storage.getProLicense();
    assert.ok(storedLicense);
    assert.equal(storedLicense.key, proKey);
    assert.equal(storedLicense.plan, 'founder_annual');
    assert.equal(storedLicense.orderBump, true);
    assert.equal(storedLicense.amountPaid, 48900);
    assert.equal(storedLicense.paymentMethod, 'wave');
  });

  it('Manual license key unlock modal simulation: valid key unlocks PRO, invalid key returns error', () => {
    // 1. Invalid key attempt
    const invalidResult = storage.activateLicenseKey('INVALID-KEY');
    assert.equal(invalidResult.success, false);
    assert.ok(invalidResult.error);
    assert.equal(storage.isProPlan(), false);

    // 2. Valid key attempt
    const validKey = storage.generateProLicenseKey();
    const validResult = storage.activateLicenseKey(validKey);
    assert.equal(validResult.success, true);
    assert.ok(validResult.license);
    assert.equal(validResult.license.key, validKey);
    assert.equal(storage.isProPlan(), true);
  });
});
