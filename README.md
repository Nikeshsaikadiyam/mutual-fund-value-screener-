# Mutual Fund Quant Terminal & Advisory Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

> **Live Deployment:** [Live Platform on Vercel](https://your-vercel-link-here.vercel.app)

---

## 📌 Executive Summary

**Mutual Fund Quant Terminal** is an institutional-grade full-stack financial analytics engine and advisory platform designed to solve real-world wealth management and investment banking challenges. Built on official daily data from the **Association of Mutual Funds in India (AMFI)**, the platform eliminates retail aggregator latency to evaluate true active manager skill (Alpha), optimize High Net Worth Individual (HNWI) post-tax cash flows, compute portfolio overlap duplication, and exploit fixed income fee drag via direct corporate bond arbitrage.

---

## 🏛️ Core Modules & Capabilities

### 1. Diagnostic Fund Analyzer (`/`)
* **Base-100 Benchmark Normalization:** Tri-line growth comparison plotting **Fund vs. Category Average vs. Nifty 50 TRI** over identical historical start dates.
* **Rolling Returns Consistency:** Multi-horizon (3Y and 5Y) rolling CAGR distributions evaluating probability of outperforming 8%, 12%, and 15% hurdle rates.
* **Underwater Drawdown Time Series:** Peak-to-trough capital contraction modeling, tracking current drawdown, max historical drawdown, and recovery windows.
* **Modern Portfolio Theory (MPT) & CAPM Risk Table:** Standard Deviation ($\sigma$), Beta ($\beta$), Sharpe Ratio, Sortino Ratio, and Jensen's Alpha ($\alpha$) evaluated against Indian 10-Year G-Sec sovereign benchmarks (6.50% $R_f$).
* **Progressive Disclosure Institutional Metrics:** Collapsible panel revealing **Upside Capture Ratio**, **Downside Capture Ratio**, **Information Ratio (IR)**, and **Tracking Error (TE)** with dynamic color-coding.
* **Tactical Cash Deployment (Lump Sum vs. STP Optimizer):** Collapsible simulator modeling Day-1 upfront equity commitment against a 3M/6M/12M Systematic Transfer Plan from a 7.00% liquid debt fund, quantifying the **Regret Index** (drawdown dampening) vs. **Cash Drag**.

### 2. Portfolio Overlap Engine (`/overlap`)
* **The Diversification Illusion:** Solves the retail trap of holding multiple funds with overlapping stock concentration.
* **Minimum-Weight Intersection Math:** Computes exact shared weight intersections across underlying portfolios:
  $$\text{Overlap}(A, B) = \sum_{i \in A \cap B} \min\left(W_{A,i}, W_{B,i}\right)$$
* **Interactive Visuals:** SVG radial percentage gauge with color-coded risk bands, Venn allocation splits, and granular stock-by-stock common holdings breakdown.

### 3. SEBI Category Screener & Risk-Return Terminal (`/screener`)
* **60 FPS Data Virtualization:** Seamless scrolling across **14,400+ schemes** powered by `@tanstack/react-virtual` to prevent browser memory exhaustion.
* **Multi-Timeframe Momentum Heatmap:** Color-coded median and average returns across all SEBI categories (Small Cap, Mid Cap, Large Cap, ELSS, Flexi Cap, Corporate Bond, Liquid) across 1M, 6M, 1Y, 3Y, and 5Y.
* **4-Quadrant Risk vs. Return Frontier:** Interactive scatter plot mapping Sharpe Ratio against 3Y CAGR to identify high-alpha, low-volatility outliers.

### 4. Fixed Income Arbitrage Terminal (`/bond-arbitrage`)
* **Finance Act 2023 Parity (Section 50AA):** Exploits the removal of debt mutual fund indexation benefits, which placed debt funds and direct corporate bonds under identical marginal income tax slab rates.
* **TER Fee Drag Elimination:** Quantifies the net yield spread unlocked by purchasing duration-matched AAA secondary corporate bonds (PFC, REC, NABARD, HDFC) with 0.00% AMC management fee drag:
  $$\text{Yield Spread Arbitrage} = \text{Net Yield}_{\text{Direct Bond}} - \text{Net Yield}_{\text{Debt Fund}} \approx +25\text{ to }+75\text{ bps}$$
* **Rupee Savings Calculator:** Simulates annual and cumulative compounded cash flow advantages on treasury deployments up to ₹50 Crore.

### 5. Multi-Fund Comparison Engine (`/compare`)
* **Head-to-Head Base-100 Race:** Direct visual growth comparison of up to 3 mutual funds from a uniform ₹100 starting line.
* **Side-by-Side Matrix:** Metric-by-metric comparison of expense ratios, standard deviation, beta, and historical returns with dynamic "Best in Class" badges.

---

## 🛠️ Technical Architecture & Stack

| Layer | Technology | Key Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | Hybrid Server Components (RSC) and Client interactivity |
| **Language** | **TypeScript 5** | Strict financial type safety, zero `any` policy |
| **Styling & Theming** | **Tailwind CSS + Vanilla CSS** | Dual-mode token system (`bg-slate-50 dark:bg-slate-950`) |
| **Data Visualization** | **Recharts** | Dual-mode responsive charts with custom glassmorphism tooltips |
| **Table Virtualization** | **@tanstack/react-virtual** | Windowed DOM rendering for 14,000+ schemes at steady 60 FPS |
| **Database** | **Supabase (PostgreSQL)** | Composite indexes on `(scheme_code, nav_date DESC)` for sub-10ms queries |
| **Data Ingestion** | **AMFI Daily Master Feed** | Automated parser processing official nightly NAV text declarations |

---

## 📚 Interview Preparation Guide

A comprehensive, printable 11-page study guide has been compiled for placement interviews:
* **PDF Guide:** [`INTERVIEW_PREP_GUIDE.pdf`](./INTERVIEW_PREP_GUIDE.pdf) *(Ready for print / tablet review)*
* **Markdown Source:** [`INTERVIEW_PREP_GUIDE.md`](./INTERVIEW_PREP_GUIDE.md)

**Sections Covered:**
1. Mathematical derivations for MPT risk metrics (Sharpe, Sortino, Alpha, Beta, Tracking Error, Information Ratio).
2. Institutional capture ratio asymmetry and portfolio overlap mathematics.
3. Post-2023 debt mutual fund taxation (Section 50AA) and modified duration arbitrage.
4. Newton-Raphson polynomial solving for true XIRR unit accumulation.
5. Top 10 verbal Q&A tailored for Wealth Management & Investment Banking placement interviews.

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/direct-mf-scraper-site.git
cd direct-mf-scraper-site

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Start the development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:3000
```

---

## 👨‍💻 Author

**Kadiyam Nikesh Sai**  
*PGDM Finance Portfolio Project*  
Specialization: Wealth Management, Quantitative Portfolio Analytics, & Investment Banking
