import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * A control that names a price must charge that price.
 *
 * PremiumGate's CTA read "Unlock This Module: ₹49" and called
 * setShowPricing(true) — it opened PricingModal instead of charging. In that
 * modal the section-unlock buttons sit in a thin header strip while a "Most
 * Popular" Premium subscription card dominates the body, so the promised ₹49
 * single-module purchase led to a ₹399 monthly subscription: eight times the
 * price, for a different product, recorded as premium_monthly.
 *
 * That is exactly what happened the first time anyone used it — it caught the
 * person who wrote it. There is no jsdom in this project so the click cannot be
 * driven directly; these read the source instead, which is enough to catch the
 * CTA being rewired back to the modal.
 */

const read = (rel: string) => fs.readFileSync(path.resolve(__dirname, rel), 'utf8');
const GATE = read('../components/premium/PremiumGate.tsx');
const MODAL = read('../components/premium/PricingModal.tsx');

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

describe('the module unlock CTA charges for a module', () => {
  const gate = stripComments(GATE);

  it('initiates checkout itself rather than delegating to the pricing modal', () => {
    expect(gate).toContain('initiateCheckout');
  });

  it('buys a section unlock, never a subscription', () => {
    expect(gate).toContain("planType: 'section_unlock'");
    for (const wrong of ['premium_monthly', 'astrologer_monthly', 'full_report_unlock']) {
      expect(gate, `PremiumGate must never purchase ${wrong}`).not.toContain(wrong);
    }
  });

  it('passes the section being unlocked, so the entitlement matches the gate', () => {
    expect(gate).toMatch(/sectionToUnlock:/);
    expect(gate).toMatch(/reportKey/);
  });

  it('keeps the primary button off the modal — that is the bug', () => {
    // The onClick sits BEFORE the label in the JSX, so look backwards from it.
    // An earlier version of this test sliced forwards and stayed green while
    // the CTA was wired straight back to the modal.
    const idx = gate.indexOf('Unlock This Module');
    expect(idx, 'priced CTA label not found').toBeGreaterThan(-1);
    const button = gate.slice(Math.max(0, idx - 600), idx);

    expect(button, 'the priced CTA opens the pricing modal again')
      .not.toContain('setShowPricing(true)');
    expect(button, 'the priced CTA no longer calls the direct-checkout handler')
      .toContain('handleUnlockModule');
  });

  it('still offers the modal as a secondary route', () => {
    // Removing it entirely would strand anyone wanting the full report or a
    // subscription, so this must stay — just not on the priced button.
    expect(gate).toContain('See all plans');
    expect(gate).toContain('setShowPricing(true)');
  });

});

describe('no price is hardcoded where it can drift from what is charged', () => {
  it.each([['PremiumGate', GATE], ['PricingModal', MODAL]])('%s', (_name, src) => {
    const literals = (stripComments(src).match(/[₹$]\s?[\d,]+(?:\.\d+)?/g) || [])
      .filter(s => !/^[₹$]\s?0$/.test(s));
    expect(literals, `hardcoded prices drift from regionService: ${literals.join(', ')}`)
      .toHaveLength(0);
  });
});
