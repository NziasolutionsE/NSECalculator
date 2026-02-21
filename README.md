# NSE Fee Calculator 🇰🇪

**Stop losing 8%+ on small NSE trades.**

A free, privacy-first calculator that shows Kenyan retail investors exactly what they'll pay in fees before placing a trade on the Nairobi Securities Exchange.

**[Try it live →](https://nsecalc.co.ke)**

---

## Why This Exists

When you buy stocks on the NSE via Ziidi, SIB, or any broker, you see the share price — but not the total cost.

**Example:**
- Buy 1 SCOM share @ KES 33.85 → You pay KES 36.73 (8.5% in fees)
- Buy 295 SCOM shares @ KES 33.85 → Fees drop to 1.61%

Same stock. Same price. **Quantity changes everything.**

This calculator makes hidden fees visible *before* you trade.

---

## Features

✅ **Real-time calculations** — Enter ticker, quantity, broker → see total cost instantly  
✅ **Fee breakdown** — Brokerage, VAT, NSE/CMA/CDSC/ICF levies, stamp duty  
✅ **5 broker comparison** — Ziidi, SIB, Dyer & Blair, Faida, EFG Hermes  
✅ **Break-even calculator** — Know your exit price before you buy  
✅ **Fee impact by quantity** — See how much you save at the "sweet spot"  
✅ **Works offline (PWA)** — Service worker caches data for low-connectivity users  
✅ **Dark mode** — Respects system preference  
✅ **No sign-up, no tracking** — 100% client-side, privacy-first  

---

## Screenshots

*(Add screenshots here after taking them — see [docs/screenshot-guide.md](docs/screenshot-guide.md))*

### Desktop
![Hero Section](docs/screenshots/nse-calculator-hero-desktop.png)

### Mobile
![Calculator View](docs/screenshots/nse-calculator-mobile-view.png)

### Fee Breakdown
![Results](docs/screenshots/nse-calculator-results-breakdown.png)

---

## How It Works

### Fee Structure (as of Feb 2026)

Every NSE trade includes:

| Fee | Rate | Who gets it |
|:--|:--|:--|
| Brokerage | 1.0%–1.5% | Your broker |
| VAT | 16% of brokerage | KRA |
| NSE Transaction Levy | 0.12% | Nairobi Securities Exchange |
| CMA Levy | 0.08% | Capital Markets Authority |
| CDSC Transaction Levy | 0.08% | Central Depository & Settlement Corp |
| ICF / Guarantee Fund | 0.01% | Investor Compensation Fund |
| Stamp Duty | KES 2 per KES 10,000 bracket | Kenya Revenue Authority |

**Total:** ~2.5%+ before stamp duty (which hits small trades hardest).

### The Stamp Duty Problem

Stamp duty is a flat **KES 2 per KES 10,000 bracket**. On small trades, this becomes a huge percentage:

- KES 30 trade (1 share of ABSA): **6.6% just in stamp duty**
- KES 9,990 trade (347 shares): **0.02% in stamp duty**

This calculator helps you find the "sweet spot" quantity that maximizes your bracket usage.

---

## Tech Stack

Built with zero dependencies for maximum performance:

- **HTML5** — Single-page app, no build step
- **Vanilla CSS** — Custom properties for theming, mobile-first
- **ES2020+ JavaScript** — Modules, pure functions, no frameworks
- **Service Worker** — Offline support, stale-while-revalidate caching
- **GitHub Pages** — Free hosting with custom domain

**Performance:**
- First Contentful Paint: < 1.0s on 3G
- Total page weight: < 100KB
- Lighthouse score: 95+ (performance, accessibility, SEO)

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/NziaSolutions/NSECalculator.git
cd NSECalculator

# Start local server
python3 -m http.server 8080
# or: npx serve

# Open in browser
open http://localhost:8080

# Run tests
node test.mjs
```

No dependencies, no `npm install`, no build process. Just open `index.html` in a browser.

---

## SEO & Indexing

The project ships with technical SEO essentials:

- `canonical` URL set to `https://nsecalc.co.ke/`
- `robots.txt` at `/robots.txt`
- `sitemap.xml` at `/sitemap.xml`
- Open Graph and Twitter card metadata
- JSON-LD structured data (`WebSite`, `WebApplication`)

### Submit to Google Search Console

1. Open Search Console and add property: `https://nsecalc.co.ke/`
2. Verify ownership (recommended: DNS TXT record)
3. Submit sitemap: `https://nsecalc.co.ke/sitemap.xml`
4. Use URL Inspection on homepage and request indexing

### Submit to Bing Webmaster Tools

1. Add site: `https://nsecalc.co.ke/`
2. Verify ownership (DNS TXT, XML file, or meta tag)
3. Submit sitemap: `https://nsecalc.co.ke/sitemap.xml`

### Post-deploy SEO checks

- `https://nsecalc.co.ke/robots.txt` loads
- `https://nsecalc.co.ke/sitemap.xml` loads
- Canonical points to `https://nsecalc.co.ke/`
- Structured data validates in Google Rich Results Test

---

## AI Discovery (LLMs)

To make this tool easier for AI systems to find and reference:

- `https://nsecalc.co.ke/llms.txt` — human/LLM-readable usage guide
- `https://nsecalc.co.ke/ai/tool.json` — structured tool manifest

### AI deep-link format

Use URL params so AI answers can point users to a reproducible calculator state:

`https://nsecalc.co.ke/?ticker=SCOM&qty=10&broker=ziidi&direction=buy`

### Notes

- No backend API is required; calculations are performed in-browser.
- For references/citations, prefer linking to the exact deep-link URL.

---

## Project Structure

```
/
├── index.html              # Single-page app
├── css/
│   └── style.css           # Mobile-first CSS, dark mode support
├── js/
│   ├── calculator.js       # Pure functions (fee calculations)
│   ├── ui.js               # DOM manipulation, event handlers
│   ├── share.js            # Social sharing (lazy-loads html2canvas)
│   └── data.js             # Stock/broker/fee data loader
├── data/
│   ├── stocks.json         # 65+ NSE stocks with prices
│   ├── brokers.json        # 5 broker rates
│   └── fees.json           # Statutory fee rates
├── sw.js                   # Service worker (PWA support)
├── manifest.json           # Web app manifest
└── docs/                   # Full documentation
    ├── nse-fee-calculator-spec.md       # Product spec (source of truth)
    ├── launch-publicity.md              # Marketing materials
    └── screenshot-guide.md              # Visual assets guide
```

---

## Testing

18 unit tests covering:
- Fee calculations (brokerage, VAT, levies, stamp duty)
- Break-even algorithm (iterative, not approximate)
- Sweet spot quantity (`Math.floor`, not `Math.ceil`)
- Edge cases (minimum broker fees, stamp duty brackets)

Run tests:
```bash
node test.mjs
```

All calculations verified against actual NSE trades and broker contract notes.

---

## Contributing

Contributions welcome! Areas where help is needed:

1. **Price updates** — Stock prices are from Feb 2026. Script exists at `scripts/refresh-prices.mjs` but needs API integration.
2. **Broker verification** — Confirm current brokerage rates for all 5 brokers.
3. **New features** — See [issues](https://github.com/NziaSolutions/NSECalculator/issues) for V2 roadmap (contract note analyzer, portfolio tracker, Swahili translation).
4. **Bug reports** — If a calculation is wrong, open an issue with the trade details.

**Before contributing:**
- Read [docs/nse-fee-calculator-spec.md](docs/nse-fee-calculator-spec.md) (source of truth for all fee rates)
- All fee constants come from official sources (CDSC, CMA, NSE)
- No external dependencies or frameworks (keep it vanilla)

---

## Roadmap

### V1 (✅ Complete)
- [x] Trade cost calculator with live breakdown
- [x] Fee impact comparison table
- [x] Break-even calculator
- [x] Broker comparison table
- [x] Shareable results card
- [x] PWA + service worker
- [x] Dark mode
- [x] Deep linking (URL params)

### V2 (Planned)
- [ ] Contract Note Analyzer (PDF upload via pdf.js)
- [ ] Portfolio fee tracker (total fees paid over time)
- [ ] Swahili language toggle
- [ ] Per-ticker SEO landing pages (build script)
- [ ] Bond/T-Bill yield calculator
- [ ] Dividend WHT calculator

**Not planned:** User accounts, backend, database, payment processing, trading execution.

---

## FAQ

**Q: How accurate are the calculations?**  
A: All fee rates are from official sources (CDSC, CMA, NSE websites) and verified against actual broker contract notes. Last verified: Feb 2026.

**Q: Do you store my data?**  
A: No. All calculations happen in your browser. No data is sent to any server. No tracking, no cookies, no analytics (currently).

**Q: Which brokers are supported?**  
A: Ziidi (Kestrel Capital), Standard Investment Bank, Dyer & Blair, Faida Investment Bank, EFG Hermes Kenya. More coming soon.

**Q: Why is my small trade so expensive?**  
A: Stamp duty (KES 2 per KES 10,000 bracket) hits small trades hardest. Buy to the "sweet spot" (just under KES 10,000) to minimize fees.

**Q: Can I use this for T-Bills or bonds?**  
A: Not yet. V1 is equities only. Bond/T-Bill calculator coming in V2.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

**TL;DR:** Free to use, modify, redistribute. No warranty provided.

---

## Acknowledgments

Built for Kenya's growing retail investor community, especially:
- **Ziidi users** — 300k+ mobile-first traders who deserve fee transparency
- **First-time investors** — Who don't know stamp duty is costing them 6%+ on small trades
- **Finance Twitter Kenya** — For feedback and encouragement

Special thanks to:
- CDSC, CMA, NSE for publishing fee schedules
- Brokers who provided rate confirmations
- Early testers who caught calculation bugs

---

## Contact

**Questions? Feedback? Partnership inquiries?**

- **Twitter:** (add your Twitter handle)
- **Email:** (add your email)
- **Issues:** [GitHub Issues](https://github.com/NziaSolutions/NSECalculator/issues)

Built with ❤️ for 🇰🇪

---

## Support This Project

If this tool saved you money:
- ⭐ **Star this repo** on GitHub
- 🐦 **Share on Twitter**
- 📧 **Tell your broker** about it (they might even partner with us!)
- 💡 **Suggest features** via [GitHub Issues](https://github.com/NziaSolutions/NSECalculator/issues)

No donations needed — the goal is transparency, not profit.

---

**[Calculate your fees now →](https://nsecalc.co.ke)**
