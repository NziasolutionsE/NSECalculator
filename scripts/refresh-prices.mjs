#!/usr/bin/env node
/**
 * NSE Closing Price Refresher
 * Uses the deveintapps.com API — the same data source powering nse.co.ke live ticker.
 * No API key or npm dependencies required (uses Node.js 18+ built-in fetch).
 *
 * Usage:
 *   node scripts/refresh-prices.mjs            # update data/stocks.json
 *   node scripts/refresh-prices.mjs --dry-run  # preview without writing
 *   node scripts/refresh-prices.mjs --verbose  # show every price (not just changes)
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir      = dirname(fileURLToPath(import.meta.url));
const stocksPath = join(__dir, '..', 'data', 'stocks.json');

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// NSE live market API — powers nse.co.ke embedded ticker.
// Account ID is the public data-account attribute on the NSE homepage.
const NSE_API_URL = 'https://deveintapps.com/nseticker/api/v1/ticker';
const NSE_ACCOUNT = 'KE3000009674';

/** Return today's date in Nairobi time as YYYY-MM-DD */
function todayKE() {
  return new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Convert NSE date format "DD/MM/YYYY" -> ISO "YYYY-MM-DD" */
function parseNSEDate(str) {
  if (!str) return todayKE();
  const [d, m, y] = str.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// ── Fetch ────────────────────────────────────────────────────────────────────

const today = todayKE();
const isWeekend = [0, 6].includes(new Date(Date.now() + 3 * 60 * 60 * 1000).getDay());

console.log(`\nNSE Price Refresh  —  ${today}${DRY_RUN ? '  [DRY RUN]' : ''}`);
console.log('='.repeat(56));

if (isWeekend) {
  console.log(`NOTE: Today (${today}) is a weekend. Prices will reflect the last trading day.`);
}

process.stdout.write('Fetching from NSE data API... ');

let snapshot, priceDate;
try {
  const res = await fetch(NSE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
      'Referer':      'https://www.nse.co.ke/',
      'Origin':       'https://www.nse.co.ke',
      'User-Agent':   'Mozilla/5.0 (compatible; NSECalc/1.0)',
    },
    body: JSON.stringify({ nopage: 'true', isinno: NSE_ACCOUNT, host: 'www.nse.co.ke' }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const json  = await res.json();
  snapshot    = json.message[0].snapshot;
  const meta  = json.message[1].updated_at;
  priceDate   = parseNSEDate(meta.date);

  console.log(`OK`);
  console.log(`  ${snapshot.length} stocks  |  ${meta.date} ${meta.time}  |  market: ${meta.market_status}`);
} catch (err) {
  console.error(`\nFAILED: ${err.message}`);
  process.exit(1);
}

// ── Diff & apply ─────────────────────────────────────────────────────────────

// Build lookup map: ticker -> closing price
const priceMap = {};
for (const s of snapshot) {
  if (s.issuer && s.price != null) {
    priceMap[s.issuer] = Math.round(s.price * 100) / 100;
  }
}

const data   = JSON.parse(readFileSync(stocksPath, 'utf8'));
const stocks = data.stocks;

let updated = 0, unchanged = 0, skipped = 0;

console.log('');
for (const stock of stocks) {
  const newPrice = priceMap[stock.ticker];

  if (newPrice == null) {
    if (VERBOSE) console.log(`  -  ${stock.ticker.padEnd(8)}  NOT IN SNAPSHOT (suspended?)`);
    skipped++;
    continue;
  }

  const oldPrice = stock.price;
  const changed  = oldPrice !== newPrice;

  if (VERBOSE || changed) {
    const arrow  = newPrice > oldPrice ? '\u25b2' : newPrice < oldPrice ? '\u25bc' : '\u2500';
    const pct    = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);
    const tag    = changed ? `${pct > 0 ? '+' : ''}${pct}%` : 'no change';
    console.log(
      `  ${arrow}  ${stock.ticker.padEnd(8)}` +
      `  ${String(oldPrice).padStart(8)} -> ${String(newPrice).padStart(8)}` +
      `  ${tag}`
    );
  }

  if (!DRY_RUN) {
    stock.price     = newPrice;
    stock.priceDate = priceDate;
  }

  changed ? updated++ : unchanged++;
}

// ── Write ─────────────────────────────────────────────────────────────────────

if (!DRY_RUN) {
  data.lastUpdated = today;
  data.dataSource  = `NSE via deveintapps.com (fetched ${today})`;
  writeFileSync(stocksPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('='.repeat(56));
console.log(`Updated:   ${updated} price changes`);
console.log(`Unchanged: ${unchanged} stocks`);
console.log(`Skipped:   ${skipped} stocks (not in NSE snapshot)`);

if (DRY_RUN) {
  console.log('\n[DRY RUN] stocks.json was NOT modified.');
} else {
  console.log(`\nWrote: data/stocks.json  (${updated} prices updated, priceDate: ${priceDate})`);
}
